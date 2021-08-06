/**
 * analyze-css CommonJS module
 */
"use strict";

const debug = require("debug")("analyze-css"),
  path = require("path"),
  preprocessors = new (require("./preprocessors"))(),
  VERSION = require("./../package").version;

function error(msg, code) {
  var err = new Error(msg);
  err.code = code;

  return err;
}

// Promise-based public endpoint
function analyze(css, options) {
  // options can be omitted
  options = options || {};

  debug("opts: %j", options);

  return new Promise((resolve, reject) => {
    if (typeof css !== "string") {
      reject(
        error(
          "css parameter passed is not a string!",
          analyze.EXIT_CSS_PASSED_IS_NOT_STRING
        )
      );
      return;
    }

    // preprocess the CSS (issue #3)
    if (typeof options.preprocessor === "string") {
      debug('Using "%s" preprocessor', options.preprocessor);

      var preprocessor = preprocessors.get(options.preprocessor);

      try {
        css = preprocessor.process(css, options);
      } catch (ex) {
        throw new Error("Preprocessing failed: " + ex);
      }

      debug("Preprocessing completed");
    }

    const CSSAnalyzer = require("./css-analyzer");
    const instance = new CSSAnalyzer(options);
    const res = instance.analyze(css);

    // error handling
    if (res instanceof Error) {
      debug("Rejecting a promise with an error: " + res);
      reject(res);
      return;
    }

    // return the results
    let result = {
      generator: "analyze-css v" + VERSION,
      metrics: instance.metrics,
    };

    // disable offenders output if requested (issue #64)
    if (options.noOffenders !== true) {
      result.offenders = instance.offenders;
    }

    debug("Promise resolved");
    resolve(result);
  });
}

analyze.version = VERSION;

// @see https://github.com/macbre/phantomas/issues/664
analyze.path = path.normalize(__dirname + "/..");
analyze.pathBin = analyze.path + "/bin/analyze-css.js";

// exit codes
analyze.EXIT_NEED_OPTIONS = 2;
analyze.EXIT_PARSING_FAILED = 251;
analyze.EXIT_EMPTY_CSS = 252;
analyze.EXIT_CSS_PASSED_IS_NOT_STRING = 253;
analyze.EXIT_URL_LOADING_FAILED = 254;
analyze.EXIT_FILE_LOADING_FAILED = 255;

module.exports = analyze;
