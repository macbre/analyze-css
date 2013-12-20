function rule(analyzer) {
	analyzer.setMetric('selectorsByAttribute');
	analyzer.setMetric('selectorsByClass');
	analyzer.setMetric('selectorsById');
	analyzer.setMetric('selectorsByPseudo');
	analyzer.setMetric('selectorsByTag');

	analyzer.on('rule', function() {
		analyzer.incrMetric('rules');
	});

	analyzer.on('selector', function() {
		analyzer.incrMetric('selectors');
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
}

rule.description = 'Emit CSS stats';
module.exports = rule;
