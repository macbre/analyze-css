var format = require('util').format;

function rule(analyzer) {
	analyzer.setMetric('importants');

	analyzer.on('declaration', function(rule, property, value) {
		if (value.indexOf('!important') > -1) {
			analyzer.incrMetric('importants');
			analyzer.addOffender('importants', format('%s {%s: %s}', rule.selectors.join(', '), property, value));
		}
	});
}

rule.description = 'Number of properties with value forced by !important';
module.exports = rule;
