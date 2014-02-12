'use strict';

var format = require('util').format;

/**
 * Rules below match ugly fixes for IE9 and below
 *
 * @see http://browserhacks.com/
 */
function rule(analyzer) {
	var re = {
		property: /^(\*|-ms-filter)/,
		selector: /^(\* html|html\s?>\s?body) /,
		value: /progid:DXImageTransform\.Microsoft|!ie$/
	};

	analyzer.setMetric('oldIEFixes');

	// * html // below IE7 fix
	// html>body // IE6 excluded fix
	// @see http://blogs.msdn.com/b/ie/archive/2005/09/02/460115.aspx
	analyzer.on('selector', function(rule, selector) {
		if (re.selector.test(selector)) {
			analyzer.incrMetric('oldIEFixes');
			analyzer.addOffender('oldIEFixes', selector);
		}
	});

	// *foo: bar // IE7 and below fix
	// -ms-filter // IE9 and below specific property
	// !ie // IE 7 and below equivalent of !important
	// @see http://www.impressivewebs.com/ie7-ie8-css-hacks/
	analyzer.on('declaration', function(rule, property, value) {
		if (re.property.test(property) || re.value.test(value)) {
			analyzer.incrMetric('oldIEFixes');
			analyzer.addOffender('oldIEFixes', format('%s {%s: %s}', rule.selectors.join(', '), property, value));
		}
	});
}

rule.description = 'Reports fixes for old versions of Internet Explorer (IE9 and below)';
module.exports = rule;
