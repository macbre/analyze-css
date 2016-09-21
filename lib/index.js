/**
 * analyze-css CommonJS module
 */
'use strict';

var cssParser = require('css').parse,
	debug = require('debug')('analyze-css'),
	fs = require('fs'),
	path = require('path'),
	preprocessors = new(require('./preprocessors'))(),
	slickParse = require('slick').parse,
	VERSION = require('./../package').version;

function analyzer(css, options, callback) {
	var res;

	// options can be omitted
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	this.options = options;
	debug('opts: %j', this.options);

	if (typeof css !== 'string') {
		callback(this.error('css parameter passed is not a string!', analyzer.EXIT_CSS_PASSED_IS_NOT_STRING), null);
		return;
	}

	// preprocess the CSS (issue #3)
	if (typeof options.preprocessor === 'string') {
		debug('Using "%s" preprocessor', options.preprocessor);

		var preprocessor = preprocessors.get(options.preprocessor);

		try {
			css = preprocessor.process(css, options);
		} catch (ex) {
			throw new Error('Preprocessing failed: ' + ex);
		}

		debug('Preprocessing completed');
	}

	res = this.analyze(css);

	// error handling
	if (res !== true) {
		callback(res, null);
		return;
	}

	// return the results
	res = {
		generator: 'analyze-css v' + VERSION,
		metrics: this.metrics,
	};

	// disable offenders output if requested (issue #64)
	if (options.noOffenders !== true) {
		res.offenders = this.offenders;
	}

	callback(null, res);
}

analyzer.version = VERSION;

// @see https://github.com/macbre/phantomas/issues/664
analyzer.path = path.normalize(__dirname + '/..');
analyzer.pathBin = analyzer.path + '/bin/analyze-css.js';

// exit codes
analyzer.EXIT_NEED_OPTIONS = 2;
analyzer.EXIT_PARSING_FAILED = 251;
analyzer.EXIT_EMPTY_CSS = 252;
analyzer.EXIT_CSS_PASSED_IS_NOT_STRING = 253;
analyzer.EXIT_URL_LOADING_FAILED = 254;
analyzer.EXIT_FILE_LOADING_FAILED = 255;

analyzer.prototype = {
	emitter: false,
	tree: false,

	metrics: {},
	offenders: {},

	error: function(msg, code) {
		var err = new Error(msg);
		err.code = code;

		return err;
	},

	// emit given event
	emit: function( /* eventName, arg1, arg2, ... */ ) {
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
	incrMetric: function(name, incr /* =1 */ ) {
		var currVal = this.metrics[name] || 0;
		incr = incr || 1;

		//debug('incrMetric(%s) += %d', name, incr);
		this.setMetric(name, currVal + incr);
	},

	addOffender: function(metricName, msg, position /* = undefined */ ) {
		if (typeof this.offenders[metricName] === 'undefined') {
			this.offenders[metricName] = [];
		}

		this.offenders[metricName].push({
			'message': msg,
			'position': position || this.currentPosition
		});
	},

	setCurrentPosition: function(position) {
		this.currentPosition = position;
	},

	initRules: function() {
		var debug = require('debug')('analyze-css:rules'),
			re = /\.js$/,
			rules = [];

		// init events emitter
		this.emitter = new(require('events').EventEmitter)();
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

		if (css.trim() === '') {
			return this.error('Empty CSS was provided', analyzer.EXIT_EMPTY_CSS);
		}

		this.tree = cssParser(css, {
			// errors are listed in the parsingErrors property instead of being thrown (#84)
			silent: true
		});

		debug('CSS parsed');
		return true;
	},

	parseRules: function(rules) {
		rules.forEach(function(rule, idx) {
			debug('%j', rule);

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
				case 'media':
					this.emit('media', rule.media, rule.rules);

					// now run recursively to parse rules within the media query
					if (rule.rules) {
						this.parseRules(rule.rules);
					}

					this.emit('mediaEnd', rule.media, rule.rules);
					break;

					// {
					//  "type":"rule",
					//  "selectors":[".ui-header .ui-btn-up-a",".ui-header .ui-btn-hover-a"],
					//  "declarations":[{"type":"declaration","property":"border","value":"0"},{"type":"declaration","property":"background","value":"none"}]
					// }
				case 'rule':
					if (!rule.selectors || !rule.declarations) {
						return;
					}

					this.emit('rule', rule);

					// analyze each selector and declaration
					rule.selectors.forEach(function(selector) {
						var parsedSelector,
							expressions = [],
							i, len;

						// "#features > div:first-child" will become two expressions:
						//  {"combinator":" ","tag":"*","id":"features"}
						//  {"combinator":">","tag":"div","pseudos":[{"key":"first-child","value":null}]}
						parsedSelector = slickParse(selector)[0];

						if (typeof parsedSelector === 'undefined') {
							var positionDump = "Rule position start @ " + rule.position.start.line + ':' + rule.position.start.column + ", end @ " + rule.position.end.line + ':' + rule.position.end.column;
							throw this.error('Unable to parse "' + selector + '" selector. ' + positionDump, analyzer.EXIT_PARSING_FAILED);
						}

						// convert object with keys to array with numeric index
						for (i = 0, len = parsedSelector.length; i < len; i++) {
							expressions.push(parsedSelector[i]);
						}

						this.emit('selector', rule, selector, expressions);

						expressions.forEach(function(expression) {
							this.emit('expression', selector, expression);
						}, this);
					}, this);

					rule.declarations.forEach(function(declaration) {
						this.setCurrentPosition(declaration.position);

						switch (declaration.type) {
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

					// {"type":"font-face","declarations":[{"type":"declaration","property":"font-family","value":"myFont"...
				case 'font-face':
					this.emit('font-face', rule);
					break;

					// {"type":"import","import":"url('/css/styles.css')"}
				case 'import':
					this.emit('import', rule.import);
					break;
			}
		}, this);
	},

	run: function() {
		var stylesheet = this.tree && this.tree.stylesheet,
			rules = stylesheet && stylesheet.rules;

		this.emit('stylesheet', stylesheet);

		// check for parsing errors (#84)
		stylesheet.parsingErrors.forEach(function(err) {
			debug('error: %j', err);

			var pos = {
				line: err.line,
				column: err.column
			};
			this.setCurrentPosition({
				start: pos,
				end: pos
			});

			this.emit('error', err);
		}, this);

		this.parseRules(rules);
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
		try {
			this.run();
		} catch (ex) {
			return ex;
		}

		this.emit('report');

		debug('Completed in %d ms', Date.now() - then);
		return true;
	}
};

module.exports = analyzer;
