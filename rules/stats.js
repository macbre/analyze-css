function rule(analyzer) {
	analyzer.on('rule', function() {
		analyzer.incrMetric('rules');
	});

	analyzer.on('selector', function() {
		analyzer.incrMetric('selectors');
	});

	analyzer.on('declaration', function() {
		analyzer.incrMetric('declarations');
	});
}

rule.description = 'Emit CSS file stats';
module.exports = rule;
