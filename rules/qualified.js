'use strict';

function rule(analyzer) {
	analyzer.setMetric('qualifiedSelectors');

	// @see https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Writing_efficient_CSS
	analyzer.on('expression', function(selector, expression) {
		var hasId = expression.id,
			hasTag = expression.tag && expression.tag !== '*',
			hasClass = expression.classList;

		if (
			// tag#id
			(hasId && hasTag) ||
			// .class#id
			(hasId && hasClass) ||
			// tag.class
			(hasClass && hasTag)
		) {
			analyzer.incrMetric('qualifiedSelectors');
			analyzer.addOffender('qualifiedSelectors', selector);
		}
	});
}

rule.description = 'Reports qualified selectors';
module.exports = rule;
