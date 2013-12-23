var collection = require('../lib/collection'),
	format = require('util').format;

function rule(analyzer) {
	var selectors = new collection();

	analyzer.setMetric('duplicatedSelectors');

	analyzer.on('rule', function(rule) {
		selectors.push(rule.selectors.join(', '));
	});

	analyzer.on('report', function() {
		selectors.sort().forEach(function(selector, cnt) {
			if (cnt > 1) {
				analyzer.incrMetric('duplicatedSelectors');
				analyzer.addOffender('duplicatedSelectors', format('%s (%d times)', selector, cnt));
			}
		});
	});
}

rule.description = 'Reports duplicated CSS selectors';
module.exports = rule;
