'use strict';

var COMPLEX_SELECTOR_THRESHOLD = 3;

function rule(analyzer) {
	analyzer.setMetric('complexSelectors');
	analyzer.setMetric('complexSelectorsByAttribute');

	// #foo .bar ul li a
	analyzer.on('selector', function(rule, selector, expressions) {
		if (expressions.length > COMPLEX_SELECTOR_THRESHOLD) {
			analyzer.incrMetric('complexSelectors');
			analyzer.addOffender('complexSelectors', selector);
		}
	});

	// .foo[type*=bar]
	// @see http://www.w3.org/TR/css3-selectors/#attribute-selectors
	analyzer.on('expression', function(selector, expression) {
		if (typeof expression.attributes !== 'undefined') {
			switch (expression.attributes[0].operator) {
				case '=':
					break;

				case '~=': // contains value in a whitespace-separated list of words
				case '|=': // starts with value or value-
				case '^=': // starts with
				case '$=': // ends with
				case '*=': // contains
					analyzer.incrMetric('complexSelectorsByAttribute');
					analyzer.addOffender('complexSelectorsByAttribute', selector);
					break;
			}
		}
	});
}

rule.description = 'Reports too complex CSS selectors';
module.exports = rule;
