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
	url = require('url');

/**
 * Simplified implementation of "request" npm module
 *
 * @see http://nodejs.org/api/http.html#http_http_get_options_callback
 * @see http://nodejs.org/api/https.html#https_https_get_options_callback
 */
function request(requestOptions, callback) {
	var debug = require('debug')('analyze-css:http'),
		isHttps = requestOptions.protocol === 'https:',
		client = require(isHttps ? 'https' : 'http');

	debug('GET %s', requestOptions.href);

	client.get(requestOptions, function(resp) {
		var out = '';

		resp.on('data', function(chunk) {
			out += chunk;
		});

		resp.on('end', function() {
			debug('HTTP %d', resp.statusCode);
			debug('Headers: %j', resp.headers);
			callback(null, resp, out);
		});
	}).on('error', function(err) {
		debug(err);
		callback(err);
	});
}

/**
 * Module's main function
 */
function runner(options, callback) {
	// call CommonJS module
	function analyze(css) {
		new analyzer(css, callback);
	}

	if (options.url) {
		debug('Fetching remote CSS file: %s', options.url);

		var requestOptions = url.parse(options.url);
		requestOptions.rejectUnauthorized = !options.ignoreSslErrors;

		request(requestOptions, function(err, resp, css) {
			if (err || resp.statusCode !== 200) {
				err = new Error('HTTP request failed: ' + (err ? err.toString() : 'received HTTP ' + resp.statusCode));

				debug(err);
				callback(err);
			}
			else {
				analyze(css);
			}
		});
	}
	else if (options.file) {
		// resolve to the full path
		options.file = resolve(process.cwd(), options.file);
		debug('Loading local CSS file: %s', options.file);

		fs.readFile(options.file, {encoding: 'utf-8'}, function(err, css) {
			if (err) {
				debug(err);
				callback(err);
			}
			else {
				analyze(css);
			}
		});
	}
	else if (options.stdin) {
		debug('Reading from stdin');
		cli.withStdin(analyze);
	}
}

module.exports = runner;
