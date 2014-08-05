'use strict';

function rule(analyzer) {
	analyzer.setMetric('imports');

	analyzer.on('import', function(url) {
		analyzer.incrMetric('imports');
		analyzer.addOffender('imports', url);
	});
}

rule.description = 'Number of @import rules';
module.exports = rule;
