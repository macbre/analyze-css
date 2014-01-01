'use strict';

function rule(analyzer) {
	analyzer.setMetric('emptyRules');

	analyzer.on('rule', function(rule) {
		var properties = rule.declarations.filter(function(item) {
			return item.type === 'declaration';
		});

		if (properties.length === 0) {
			analyzer.incrMetric('emptyRules');
			analyzer.addOffender('emptyRules', rule.selectors.join(', '));
		}
	});
}

rule.description = 'Total number of empty CSS rules';
module.exports = rule;
