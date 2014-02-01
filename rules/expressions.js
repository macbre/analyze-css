'use strict';

var format = require('util').format;

function rule(analyzer) {
	var re = /^expression/i;

	analyzer.setMetric('expressions');

	analyzer.on('declaration', function(rule, property, value) {
		if (re.test(value)) {
			analyzer.incrMetric('expressions');
			analyzer.addOffender('expressions', format('%s {%s: %s}', rule.selectors.join(', '), property, value));
		}
	});
}

rule.description = 'Reports CSS expressions';
module.exports = rule;
