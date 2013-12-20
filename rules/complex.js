var COMPLEX_SELECTOR_THRESHOLD = 3;

function rule(analyzer) {
	analyzer.setMetric('complexSelectors');

	analyzer.on('selector', function(rule, selector, expressions) {
		if (expressions.length > COMPLEX_SELECTOR_THRESHOLD) {
			analyzer.incrMetric('complexSelectors');
			analyzer.addOffender('complexSelectors', selector);
		}
	});
}

rule.description = 'Reports too complex CSS selectors';
module.exports = rule;
