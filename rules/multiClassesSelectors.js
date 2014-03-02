'use strict';

function rule(analyzer) {
	analyzer.setMetric('multiClassesSelectors');

	analyzer.on('expression', function(selector, expression) {
		if (expression.classList && expression.classList.length > 1) {
			analyzer.incrMetric('multiClassesSelectors');
			analyzer.addOffender('multiClassesSelectors', '.' + expression.classList.join('.'));
		}
	});
}

rule.description = 'Reports selectors with multiple classes';
module.exports = rule;
