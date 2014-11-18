'use strict';

var collection = require('../lib/collection'),
	debug = require('debug')('analyze-css:colors'),
	format = require('util').format,
	onecolor = require('onecolor');

/**
 * Extract CSS colors from given CSS property value
 */
var regex = /(((rgba?|hsl)\([^\)]+\))|#(\w{3,6}))/g;

function extractColors(value) {
	var matches = value.match(regex);
	return matches || false;
}

function rule(analyzer) {
	// store unique colors with the counter
	var colors = new collection();

	analyzer.setMetric('colors');

	analyzer.on('declaration', function(rule, property, value) {
		var extractedColors = extractColors(value);

		if (extractedColors === false) {
			return;
		}

		debug('%s: %s -> %j', property, value, extractedColors);

		extractedColors.
		map(function(item) {
			var color = onecolor(item);

			// handle parsing errors
			if (color === false) {
				return false;
			}

			// return either rgba(0,0,0,0.25) or #000000
			return (color.alpha() < 1.0) ? color.cssa() : color.hex();
		}).
		forEach(function(color) {
			if (color !== false) {
				colors.push(color);
			}
		});
	});

	analyzer.on('report', function() {
		analyzer.setCurrentPosition(undefined);

		colors.sort().forEach(function(color, cnt) {
			analyzer.incrMetric('colors');
			analyzer.addOffender('colors', format('%s (%d times)', color, cnt));
		});
	});
}

rule.description = 'Reports number of unique colors used in CSS';
module.exports = rule;

// expose for unit testing
module.exports.extractColors = extractColors;
