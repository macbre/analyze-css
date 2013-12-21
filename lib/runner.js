/**
 * Fetches remote asset / local CSS file and returns analyzer results
 *
 * Used by analyze-css "binary" to communicate with CommonJS module
 */
var debug = require('debug')('analyze-css:runner'),
	readFileSync = require('fs').readFileSync,
	resolve = require('path').resolve,
	analyzer = require('./index');

/**
 * Simplified implementation of "request" npm module
 *
 * @see http://nodejs.org/api/http.html#http_http_get_options_callback
 * @see http://nodejs.org/api/https.html#https_https_get_options_callback
 */
function request(url, callback) {
	var debug = require('debug')('analyze-css:http'),
		isHttps = url.indexOf('https://') === 0,
		client = require(isHttps ? 'https' : 'http');

	debug('GET %s', url);

	client.get(url, function(resp) {
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
function runner(url, options, callback) {
	var css = '',
		isUrl;

	// options can be omitted
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	debug('Going to analyze <%s> with the following options: %j', url, options);

	// url can be either HTTP address or path to a local CSS file
	try {
		isUrl = /^https?:\/\//.test(url);

		if (isUrl) {
			debug('Fetching remote CSS file: %s', url);

			request(url, function(err, resp, css) {
				if (err || resp.statusCode !== 200) {
					err = new Error('HTTP request failed: ' + (err ? err.toString() : 'received HTTP ' + resp.statusCode));

					debug(err);
					callback(err);
				}
				else {
					new analyzer(css, options, callback);
				}
			});
		}
		else {
			// resolve to the full path
			url = resolve(process.cwd(), url);
			debug('Loading local CSS file: %s', url);

			css = readFileSync(url.toString()).toString();
			new analyzer(css, options, callback);
		}
	}
	catch(ex) {
		debug(ex);
		callback(ex.toString());
	}
}

module.exports = runner;
