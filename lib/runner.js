/**
 * Fetches remote asset / local CSS file and returns analyzer results
 *
 * Used internally by analyze-css "binary" to communicate with CommonJS module
 */
'use strict';

var cli = require('cli'),
	debug = require('debug')('analyze-css:runner'),
	fs = require('fs'),
	resolve = require('path').resolve,
	analyzer = require('./index'),
	preprocessors = new(require('./preprocessors'))();

/**
 * Return user agent to be used by analyze-css when making HTTP requests (issue #75)
 */
function getUserAgent() {
	var format = require('util').format,
		version = require('../package').version;

	return format(
		'analyze-css/%s (%s %s, %s %s)',
		version,
		process.release.name,
		process.version,
		process.platform,
		process.arch
	);
}

/**
 * Simplified implementation of "request" npm module
 *
 * @see https://www.npmjs.com/package/node-fetch
 */
function request(requestOptions, callback) {
	var debug = require('debug')('analyze-css:http'),
		fetch = require('node-fetch');

	debug('GET %s', requestOptions.url);
	debug('Options: %j', requestOptions);

	fetch(requestOptions.url, requestOptions).
	then(function(resp) {
		debug('HTTP %d %s', resp.status, resp.statusText);
		debug('Headers: %j', resp.headers._headers);

		if (!resp.ok) {
			var err = new Error('HTTP request failed: ' + (err ? err.toString() : 'received HTTP ' + resp.status + ' ' + resp.statusText));
			callback(err);
		} else {
			return resp.text(); // a promise
		}
	}).
	then(function(body) {
		debug('Received %d bytes of CSS', body.length);
		callback(null, body);
	}).
	catch(function(err) {
		debug(err);
		callback(err);
	});
}

/**
 * Module's main function
 */
function runner(options, callback) {
	// call CommonJS module
	var analyzerOpts = {
		'noOffenders': options.noOffenders,
		'preprocessor': false,
	};

	function analyze(css) {
		new analyzer(css, analyzerOpts, callback);
	}

	if (options.url) {
		debug('Fetching remote CSS file: %s', options.url);

		// @see https://www.npmjs.com/package/node-fetch#options
		var agentOptions = {},
			requestOptions = {
				url: options.url,
				headers: {
					'User-Agent': getUserAgent()
				}
			};

		// handle options

		// @see https://github.com/bitinn/node-fetch/issues/15
		// @see https://nodejs.org/api/https.html#https_https_request_options_callback
		if (options.ignoreSslErrors) {
			agentOptions.rejectUnauthorized = false;
		}

		// @see https://gist.github.com/cojohn/1772154
		if (options.authUser && options.authPass) {
			requestOptions.headers.Authorization = "Basic " + new Buffer(options.authUser + ":" + options.authPass, "utf8").toString("base64");
		}

		// @see https://nodejs.org/api/http.html#http_class_http_agent
		var client = require(/^https:/.test(options.url) ? 'https' : 'http');
		requestOptions.agent = new client.Agent(agentOptions);

		// @see http://stackoverflow.com/a/5810547
		options.proxy = options.proxy || process.env.HTTP_PROXY;

		if (options.proxy) {
			debug('Using HTTP proxy: %s', options.proxy);

			requestOptions.agent = new(require('http-proxy-agent'))(options.proxy);
		}

		request(requestOptions, function(err, css) {
			if (err) {
				err.code = analyzer.EXIT_URL_LOADING_FAILED;

				debug(err);
				callback(err);
			} else {
				analyze(css);
			}
		});
	} else if (options.file) {
		// resolve to the full path
		options.file = resolve(process.cwd(), options.file);
		debug('Loading local CSS file: %s', options.file);

		fs.readFile(options.file, {
			encoding: 'utf-8'
		}, function(err, css) {
			if (err) {
				err = new Error('Loading CSS file failed: ' + err.toString());
				err.code = analyzer.EXIT_FILE_LOADING_FAILED;

				debug(err);
				callback(err);
			} else {
				// find the matching preprocessor and use it
				if (analyzerOpts.preprocessor === false) {
					analyzerOpts.preprocessor = preprocessors.findMatchingByFileName(options.file);
				}

				// pass the name of the file being analyzed
				analyzerOpts.file = options.file;

				analyze(css);
			}
		});
	} else if (options.stdin) {
		debug('Reading from stdin');
		cli.withStdin(analyze);
	}
}

module.exports = runner;
