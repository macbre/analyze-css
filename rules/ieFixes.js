var format = require('util').format;

function rule(analyzer) {
	var re = {
		property: /^\*/,
		selector: /^\* html /
	};

	analyzer.setMetric('oldIEFixes');

	// * html // below IE7 fix
	// @see http://blogs.msdn.com/b/ie/archive/2005/09/02/460115.aspx
	analyzer.on('selector', function(rule, selector) {
		if (re.selector.test(selector)) {
			analyzer.incrMetric('oldIEFixes');
			analyzer.addOffender('oldIEFixes', selector);
		}
	});

	// *foo: bar // IE7 and below fix
	// @see http://www.impressivewebs.com/ie7-ie8-css-hacks/
	analyzer.on('declaration', function(rule, property, value) {
		if (re.property.test(property)) {
			analyzer.incrMetric('oldIEFixes');
			analyzer.addOffender('oldIEFixes', format('%s {%s: %s}', rule.selectors.join(', '), property, value));
		}
	});
}

rule.description = 'Reports fixes for old versions of Internet Explorer';
module.exports = rule;
