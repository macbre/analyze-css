'use strict';

function rule(analyzer) {
	var selectors = 0,
		selectorsLength = 0;

	analyzer.setMetric('selectors');
	analyzer.setMetric('selectorLengthAvg');

	analyzer.setMetric('selectorsByAttribute');
	analyzer.setMetric('selectorsByClass');
	analyzer.setMetric('selectorsById');
	analyzer.setMetric('selectorsByPseudo');
	analyzer.setMetric('selectorsByTag');

	analyzer.on('rule', function() {
		analyzer.incrMetric('rules');
	});

	analyzer.on('selector', function(rule, selector, expressions) {
		selectors += 1;
		selectorsLength += expressions.length;
	});

	analyzer.on('declaration', function() {
		analyzer.incrMetric('declarations');
	});

	analyzer.on('expression', function(selector, expression) {
		// a[href]
		if (expression.attributes) {
			analyzer.incrMetric('selectorsByAttribute');
		}

		// .bar
		if (expression.classList) {
			analyzer.incrMetric('selectorsByClass');
		}

		// @foo
		if (expression.id) {
			analyzer.incrMetric('selectorsById');
		}

		// a:hover
		if (expression.pseudos) {
			analyzer.incrMetric('selectorsByPseudo');
		}

		// header
		if (expression.tag && expression.tag !== '*') {
			analyzer.incrMetric('selectorsByTag');
		}
	});

	analyzer.on('report', function() {
		analyzer.setMetric('selectors', selectors);
		analyzer.setMetric('selectorLengthAvg', selectorsLength / selectors);
	});
}

rule.description = 'Emit CSS stats';
module.exports = rule;
