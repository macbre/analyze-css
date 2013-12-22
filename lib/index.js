/**
 * analyze-css CommonJS module
 */
var cssParser = require('css-parse'),
	debug = require('debug')('analyze-css'),
	fs = require('fs'),
	slickParse = require('slick/Source/Slick.Parser.js').Slick.parse,
	VERSION = require('./../package').version;

function analyzer(css, options, callback) {
	var res;

	if (typeof css !== 'string') {
		throw 'css parameter passed is not a string!';
	}

	// options can be omitted
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	res = this.analyze(css);

	if (res !== true) {
		callback(res, null);
		return;
	}

	// return the results
	res = {
		generator: 'analyze-css v' + VERSION,
		metrics: this.metrics,
		offenders: this.offenders
	};

	callback(null, res);
}

analyzer.version = VERSION;

analyzer.prototype = {
	emitter: false,
	tree: false,

	metrics: {},
	offenders: {},

	// emit given event
	emit: function(/* eventName, arg1, arg2, ... */) {
		//debug('Event %s emitted', arguments[0]);
		this.emitter.emit.apply(this.emitter, arguments);
	},

	// bind to a given event
	on: function(ev, fn) {
		this.emitter.on(ev, fn);
	},

	setMetric: function(name, value) {
		value = value || 0;

		//debug('setMetric(%s) = %d', name, value);
		this.metrics[name] = value;
	},

	// increements given metric by given number (default is one)
	incrMetric: function(name, incr /* =1 */) {
		var currVal = this.metrics[name] || 0;
		incr = incr || 1;

		//debug('incrMetric(%s) += %d', name, incr);
		this.setMetric(name, currVal + incr);
	},

	addOffender: function(metricName, msg) {
		if (typeof this.offenders[metricName] === 'undefined') {
			this.offenders[metricName] = [];
		}

		this.offenders[metricName].push(msg);
	},

	initRules: function() {
		var debug = require('debug')('analyze-css:rules'),
			re = /\.js$/,
			rules = [];

		// init events emitter
		this.emitter = new (require('events').EventEmitter)();
		this.emitter.setMaxListeners(200);

		// load all rules
		rules = fs.readdirSync(fs.realpathSync(__dirname + '/../rules/'))
			// filter out all non *.js files
			.filter(function(file) {
				return re.test(file);
			})
			// remove file extensions to get just names
			.map(function(file) {
				return file.replace(re, '');
			});

		debug('Rules to be loaded: %s', rules.join(', '));

		rules.forEach(function(name) {
			var rule = require('./../rules/' + name);
			rule(this);

			debug('"%s" loaded: %s', name, rule.description || '-');
		}, this);
	},

	parseCss: function(css) {
		var debug = require('debug')('analyze-css:parser');

		debug('Going to parse %s kB of CSS', (css.length / 1024).toFixed(2));

		try {
			this.tree = new cssParser(css);
		}
		catch(ex) {
			var errMsg = 'CSS parsing failed: ' + ex.toString();

			debug(errMsg);
			debug('Offending line: ' + css.split('\n')[ex.line-1]);

			return new Error(errMsg);
		}

		debug('CSS parsed');
		return true;
	},

	run: function() {
		var rules = this.tree && this.tree.stylesheet.rules;

		rules.forEach(function(rule, idx) {
			debug('%j', rule);

			switch(rule.type) {
				// {
				//  "type":"rule",
				//  "selectors":[".ui-header .ui-btn-up-a",".ui-header .ui-btn-hover-a"],
				//  "declarations":[{"type":"declaration","property":"border","value":"0"},{"type":"declaration","property":"background","value":"none"}]
				// }
				case 'rule':
					this.emit('rule', rule);

					if (!rule.selectors || !rule.declarations) {
						return;
					}

					// analyze each selector and declaration
					rule.selectors.forEach(function(selector) {
						var parsedSelector,
							expressions;

						// "#features > div:first-child" will become two expressions:
						//  {"combinator":" ","tag":"*","id":"features"}
						//  {"combinator":">","tag":"div","pseudos":[{"key":"first-child","value":null}]}
						parsedSelector = slickParse(selector);
						expressions = parsedSelector.expressions[0];

						this.emit('selector', rule, selector, expressions);

						expressions.forEach(function(expression) {
							this.emit('expression', selector, expression);
						}, this);
					}, this);

					rule.declarations.forEach(function(declaration) {
						switch(declaration.type) {
							case 'declaration':
								this.emit('declaration', rule, declaration.property, declaration.value);
								break;

							case 'comment':
								this.emit('comment', declaration.comment);
								break;
						}
					}, this);
					break;

				// {"type":"comment","comment":" Cached as static-css-r518-9b0f5ab4632defb55d67a1d672aa31bd120f4414 "}
				case 'comment':
					this.emit('comment', rule.comment);
					break;
			}
		}, this);
	},

	analyze: function(css) {
		var res,
			then = Date.now();

		this.metrics = {};
		this.offenders = {};

		// load and init all rules
		this.initRules();

		// parse CSS
		res = this.parseCss(css);

		if (res !== true) {
			return res;
		}

		this.emit('css', css);

		// now go through parsed CSS tree and emit events for rules
		this.run();

		this.emit('report');

		debug('Completed in %d ms', Date.now() - then);
		return true;
	}
};

module.exports = analyzer;
