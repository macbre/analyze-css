const analyze = require("."),
  cssParser = require("css").parse,
  debug = require("debug")("analyze-css:analyzer"),
  fs = require("fs"),
  CSSwhat = require("css-what");

function error(msg, code) {
  var err = new Error(msg);
  err.code = code;

  return err;
}

class CSSAnalyzer {
  constructor(options) {
    this.options = options;

    this.metrics = {};
    this.offenders = {};

    // init events emitter
    this.emitter = new (require("events").EventEmitter)();
    this.emitter.setMaxListeners(200);
  }

  // emit given event
  emit(/* eventName, arg1, arg2, ... */) {
    //debug('Event %s emitted', arguments[0]);
    this.emitter.emit.apply(this.emitter, arguments);
  }

  // bind to a given event
  on(ev, fn) {
    this.emitter.on(ev, fn);
  }

  setMetric(name, value) {
    value = value || 0;

    //debug('setMetric(%s) = %d', name, value);
    this.metrics[name] = value;
  }

  // increements given metric by given number (default is one)
  incrMetric(name, incr /* =1 */) {
    var currVal = this.metrics[name] || 0;
    incr = incr || 1;

    //debug('incrMetric(%s) += %d', name, incr);
    this.setMetric(name, currVal + incr);
  }

  addOffender(metricName, msg, position /* = undefined */) {
    if (typeof this.offenders[metricName] === "undefined") {
      this.offenders[metricName] = [];
    }

    this.offenders[metricName].push({
      message: msg,
      position: position || this.currentPosition,
    });
  }

  setCurrentPosition(position) {
    this.currentPosition = position;
  }

  initRules() {
    var debug = require("debug")("analyze-css:rules"),
      re = /\.js$/,
      rules = [];

    // load all rules
    rules = fs
      .readdirSync(fs.realpathSync(__dirname + "/../rules/"))
      // filter out all non *.js files
      .filter(function (file) {
        return re.test(file);
      })
      // remove file extensions to get just names
      .map(function (file) {
        return file.replace(re, "");
      });

    debug("Rules to be loaded: %s", rules.join(", "));

    rules.forEach(function (name) {
      var rule = require("./../rules/" + name);
      rule(this);

      debug('"%s" loaded: %s', name, rule.description);
    }, this);
  }

  fixCss(css) {
    // properly handle ; in @import URLs
    // see https://github.com/macbre/analyze-css/pull/322
    // see https://github.com/reworkcss/css/issues/137
    return css.replace(/@import url([^)]+["'])/, (match) => {
      return match.replace(/;/g, "%3B");
    });
  }

  parseCss(css) {
    var debug = require("debug")("analyze-css:parser");
    debug("Going to parse %s kB of CSS", (css.length / 1024).toFixed(2));

    if (css.trim() === "") {
      return error("Empty CSS was provided", analyze.EXIT_EMPTY_CSS);
    }

    css = this.fixCss(css);

    this.tree = cssParser(css, {
      // errors are listed in the parsingErrors property instead of being thrown (#84)
      silent: true,
    });

    debug("CSS parsed");
    return true;
  }

  /**
   *
   * @param { import("./types").CSSRule[] } rules
   */
  parseRules(rules) {
    const debug = require("debug")("analyze-css:parseRules");

    rules.forEach(function (rule) {
      debug("rule: %j", rule);

      // store the default current position
      //
      // it will be used when this.addOffender is called from within the rule
      // it can be overridden by providing a "custom" position via a call to this.setCurrentPosition
      this.setCurrentPosition(rule.position);

      switch (rule.type) {
        // {
        //  "type":"media"
        //  "media":"screen and (min-width: 1370px)",
        //  "rules":[{"type":"rule","selectors":["#foo"],"declarations":[]}]
        // }
        case "media":
          this.emit("media", rule.media, rule.rules);

          // now run recursively to parse rules within the media query
          /* istanbul ignore else */
          if (rule.rules) {
            this.parseRules(rule.rules);
          }

          this.emit("mediaEnd", rule.media, rule.rules);
          break;

        // {
        //  "type":"rule",
        //  "selectors":[".ui-header .ui-btn-up-a",".ui-header .ui-btn-hover-a"],
        //  "declarations":[{"type":"declaration","property":"border","value":"0"},{"type":"declaration","property":"background","value":"none"}]
        // }
        case "rule":
          if (!rule.selectors || !rule.declarations) {
            return;
          }

          this.emit("rule", rule);

          // analyze each selector and declaration
          rule.selectors.forEach(function (selector) {
            // https://github.com/fb55/css-what#example
            // "#features > div:first-child" will become:
            // {"type":"attribute","name":"id","action":"equals","value":"features","namespace":null,"ignoreCase":false}
            // {"type":"child"}
            // {"type":"tag","name":"div","namespace":null}
            // {"type":"pseudo","name":"first-child","data":null}
            debug("selector: %s", selector);

            let parsedSelector;

            try {
              parsedSelector = CSSwhat.parse(selector);
            } catch (err) {
              /**
               * > require("css-what").parse('foo { color= red; }');
                Uncaught Error: Unmatched selector: { color= red; }
                    at Object.parse (node_modules/css-what/lib/parse.js:139:15)
              */

              debug("selector parsing failed: %s", err.message);
              this.emit("error", err);
              return;
            }

            // convert object with keys to array with numeric index
            let expressions = [];

            for (let i = 0, len = parsedSelector[0].length; i < len; i++) {
              expressions.push(parsedSelector[0][i]);
            }

            debug("selector expressions: %j", expressions);
            this.emit("selector", rule, selector, expressions);

            expressions.forEach(function (expression) {
              this.emit("expression", selector, expression);
            }, this);
          }, this);

          rule.declarations.forEach(function (declaration) {
            this.setCurrentPosition(declaration.position);

            switch (declaration.type) {
              case "declaration":
                this.emit(
                  "declaration",
                  rule,
                  declaration.property,
                  declaration.value
                );
                break;

              case "comment":
                this.emit("comment", declaration.comment);
                break;
            }
          }, this);
          break;

        // {"type":"comment","comment":" Cached as static-css-r518-9b0f5ab4632defb55d67a1d672aa31bd120f4414 "}
        case "comment":
          this.emit("comment", rule.comment);
          break;

        // {"type":"font-face","declarations":[{"type":"declaration","property":"font-family","value":"myFont"...
        case "font-face":
          this.emit("font-face", rule);
          break;

        // {"type":"import","import":"url('/css/styles.css')"}
        case "import":
          // replace encoded semicolon back into ;
          // https://github.com/macbre/analyze-css/pull/322
          this.emit("import", rule.import.replace(/%3B/g, ";"));
          break;
      }
    }, this);
  }

  run() {
    const stylesheet = this.tree && this.tree.stylesheet,
      rules = stylesheet && stylesheet.rules;

    this.emit("stylesheet", stylesheet);

    this.parseRules(rules);
  }

  analyze(css) {
    var res,
      then = Date.now();

    this.metrics = {};
    this.offenders = {};

    // load and init all rules
    this.initRules();

    // parse CSS
    res = this.parseCss(css);

    if (res !== true) {
      debug("parseCss() returned an error: " + res);
      return res;
    }

    this.emit("css", css);

    // now go through parsed CSS tree and emit events for rules
    this.run();

    this.emit("report");

    debug("Completed in %d ms", Date.now() - then);
    return true;
  }
}

module.exports = CSSAnalyzer;
