'use strict';

var collection = require('../lib/collection');

/**
 * Extract CSS colors from given CSS property value
 */
var regex = /(((rgba?|hsl)\([^\)]+\))|#(\w{3,6}))/g;

function extractColors(value) {
	var matches = value.match(regex);
	return matches || [];
}

function rule(analyzer) {
	// hash storing unique colors with the counter
	var colors = new collection();

	analyzer.setMetric('colors');

	analyzer.on('declaration', function(rule, property, value) {
	});
}

rule.description = 'Reports number of unique colors used in CSS';
module.exports = rule;

// expose for unit testing
module.exports.extractColors = extractColors;

