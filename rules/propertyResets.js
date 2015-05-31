'use strict';

var debug = require('debug')('analyze-css:propertyResets'),
	format = require('util').format,
	shorthandProperties = require('css-shorthand-properties');

/**
 * Detect accidental property resets
 *
 * @see http://css-tricks.com/accidental-css-resets/
 */
function rule(analyzer) {
	var debug = require('debug');

	analyzer.setMetric('propertyResets');

	analyzer.on('selector', function(rule, selector) {
		var declarations = rule.declarations || [],
			properties;

		// prepare the list of properties used in this selector
		properties = declarations.
		map(function(declaration) {
			return (declaration.type === 'declaration') ? declaration.property : false;
		}).
		filter(function(item) {
			return item !== false;
		});

		debug('%s: %j', selector, properties);

		// iterate through all properties, expand shorthand properties and
		// check if there's no expanded version of it earlier in the array
		properties.forEach(function(property, idx) {
			var expanded;

			// skip if the current property is not the shorthand version
			if (typeof shorthandProperties.shorthandProperties[property] === 'undefined') {
				return;
			}

			// property = 'margin'
			// expanded = [ 'margin-top', 'margin-right', 'margin-bottom', 'margin-left' ]
			expanded = shorthandProperties.expand(property);
			debug('%s: %s', property, expanded.join(', '));

			expanded.forEach(function(expandedProperty) {
				var propertyPos = properties.indexOf(expandedProperty);

				if (propertyPos > -1 && propertyPos < idx) {
					analyzer.incrMetric('propertyResets');
					analyzer.addOffender('propertyResets', format('%s: "%s" resets "%s" property set earlier', selector, property, expandedProperty));
				}
			});
		});
	});
}

rule.description = 'Reports accidental property resets';
module.exports = rule;
