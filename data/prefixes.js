#!/usr/bin/env node
/**
 * Generates data for prefixes rule using data from autoprefixer
 *
 * @see https://github.com/ai/autoprefixer
 */
var autoprefixer = require('autoprefixer-core'),
	browserslist = require('browserslist'),
	debug = require('debug')('analyze-css:prefixes'),
	fs = require('fs'),
	prefixes = autoprefixer.data.prefixes,
	// data
	browsersByPrefix = {},
	namesByVendor = {},
	data;

// prepare data
data = {
	generated: (new Date()).toJSON().substr(0, 10) + ' using autoprefixer-core v' + (require('../node_modules/autoprefixer-core/package.json').version),
	// supported browsers, i.e. will keep venoder prefixes that they require
	browsers: browserslist().sort(),
	// list of prefixes: prefix / hash (keep: true / false, msg: reason, list of browsers)
	prefixes: {}
};

debug('Generator: %s', data.generated);
debug('Supported browsers: %s', data.browsers.join(', '));

// prepare vendors data
// [prefix] => [supported browsers]
Object.keys(autoprefixer.data.browsers).forEach(function(vendor) {
	var vendorData = autoprefixer.data.browsers[vendor],
		prefix = vendorData.prefix;

	if (typeof browsersByPrefix[prefix] === 'undefined') {
		browsersByPrefix[prefix] = {
			names: [],
			browsers: []
		};
	}

	// push all browsers matching vendor
	data.browsers.forEach(function(browser) {
		// e.g. browser = 'ff 26'
		if (browser.split(' ')[0] === vendor) {
			browsersByPrefix[prefix].names.push(vendor);
			browsersByPrefix[prefix].browsers.push(browser);
		}
	});

	// "and_uc" : "UC Browser for Android"
	namesByVendor[vendor] = vendorData.browser;
});

debug('Browsers by prefix: %j' ,browsersByPrefix);
debug('Names by vendor: %j', namesByVendor);

function getLatestVersions(browsers, oldest) {
	var latest = {},
		ret = [];

	oldest = !!oldest;

	browsers.forEach(function(browser) {
		var parts = browser.split(' '),
			vendor = parts[0],
			version = parseFloat(parts[1]);

		if (oldest) {
			// the oldest one
			latest[vendor] = Math.min(version, latest[vendor] || 1000);
		}
		else {
			// the latest version
			latest[vendor] = Math.max(version, latest[vendor] || 0);
		}
	});

	Object.keys(latest).forEach(function(vendor) {
		ret.push((namesByVendor[vendor] || vendor) + ' ' + latest[vendor]);
	});

	return ret;
}

// iterate through prefixes
Object.keys(prefixes).forEach(function(property) {
	var propertyData = prefixes[property];

	if (propertyData.selector || propertyData.props) {
		return;
	}

	Object.keys(browsersByPrefix).forEach(function(prefix) {
		// support browsers that should be checked against given prefix
		var prefixBrowsers = browsersByPrefix[prefix].browsers,
			vendorNames = browsersByPrefix[prefix].names,
			browsers,
			keep,
			msg;

		// check which supported browsers require this prefix
		browsers = prefixBrowsers.filter(function(browser) {
			return propertyData.browsers.indexOf(browser) > -1;
		});

		// given prefix never existed
		if (propertyData.mistakes && propertyData.mistakes.indexOf(prefix) > -1) {
			msg = prefix + property + ' is a mistake';
		}
		// prefix no longer needed
		else if (browsers.length === 0) {
			// generate the list of old browsers requiring given prefix
			browsers = propertyData.browsers.filter(function(browser) {
				return vendorNames.indexOf(browser.split(' ')[0]) > -1;
			});

			if (browsers.length > 0) {
				msg = 'was required by ' + getLatestVersions(browsers).join(', ') + ' and earlier';
			}
			else {
				// special handling for -ms- prefixes
				// @see http://msdn.microsoft.com/en-us/library/ie/ms530752(v=vs.85).aspx
				msg = 'prefix is no longer supported';
			}
		}
		// prefix still required by...
		else {
			keep = true;
			msg = 'required by ' + getLatestVersions(browsers, true).join(', ') + ' and later';
		}

		prefix = '-' + prefix + '-'; // "mozborder-radius" -> "-moz-border-radius"

		debug('%j', browsers);
		debug('%s: keep? %j (%s)', prefix + property, !!keep, msg);

		data.prefixes[prefix + property] = {
			keep: !!keep,
			msg: msg
		};
	});
});

// store in JSON file
debug('Writing to a file...');
fs.writeFileSync(__dirname + '/../rules/prefixes.json', JSON.stringify(data, null, '  '));

debug('Done');
