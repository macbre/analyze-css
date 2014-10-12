'use strict';

var collection = require('../lib/collection'),
	debug = require('debug')('analyze-css:duplicated'),
	format = require('util').format;

function rule(analyzer) {
	var selectors = new collection(),
		mediaQueryStack = [];

	analyzer.setMetric('duplicatedSelectors');

	// handle nested media queries
	analyzer.on('media', function(query) {
		mediaQueryStack.push(query);
		debug('push: %j', mediaQueryStack);
	});

	analyzer.on('mediaEnd', function(query) {
		mediaQueryStack.pop(query);
		debug('pop: %j', mediaQueryStack);
	});

	// register each rule's selectors
	analyzer.on('rule', function(rule) {
		selectors.push(
			// @media foo
			(mediaQueryStack.length > 0 ? '@media ' + mediaQueryStack.join(' @media ') + ' ' : '') +
			// #foo
			rule.selectors.join(', ')
		);
	});

	// special handling for @font-face (#52)
	// include URL when detecting duplicates
	analyzer.on('font-face', function(rule) {
		rule.declarations.forEach(function(declaration) {
			if (declaration.property === 'src') {
				selectors.push('@font-face src: ' + declaration.value);

				debug('special handling for @font-face, provided src: %s', declaration.value);
				return false;
			}
		});
	});

	analyzer.on('report', function() {
		analyzer.setCurrentPosition(undefined);

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
