'use strict';

function rule(analyzer) {
	analyzer.setMetric('parsingErrors');

	analyzer.on('error', function(err) {
		analyzer.incrMetric('parsingErrors');
		analyzer.addOffender('parsingErrors', err.reason);
	});
}

rule.description = 'CSS parsing errors';
module.exports = rule;
