function rule(analyzer) {
	var re = {
		// ignore IE fixes - e.g. "* html .ui-autocomplete"
		selector: /^\* html /
	};

	analyzer.setMetric('universalSelectors');

	// @see http://perfectionkills.com/profiling-css-for-fun-and-profit-optimization-notes/
	analyzer.on('expression', function(selector, expression) {
		// .foo > *
		// .foo * li
		// [type="..."]
		// ul :hover
		if (expression.tag === '*' && !expression.classList && !expression.id && !re.selector.test(selector)) {
			analyzer.incrMetric('universalSelectors');
			analyzer.addOffender('universalSelectors', selector);
		}
	});
}

rule.description = 'Reports universal selectors';
module.exports = rule;
