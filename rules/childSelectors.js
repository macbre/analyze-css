'use strict';

function rule(analyzer) {
	// definition of redundant child nodes selectors (see #51 for the initial idea):
	// ul li
	// ol li
	// table tr
	// table th
	var redundantChildSelectors = {
		'ul': ['li'],
		'ol': ['li'],
		'select': ['option'],
		'table': ['tr', 'th'], // e.g. table can not be followed by any of tr / th
		'tr': ['td', 'th'],
	};

	analyzer.setMetric('redundantChildNodesSelectors');

	analyzer.on('selector', function(rule, selector, expressions) {
		var noExpressions = expressions.length;

		// check more complex selectors only
		if (noExpressions < 2) {
			return;
		}

		// converts "ul#foo > li.test" selector into ['ul', 'li'] list
		var selectorNodeNames = expressions.map(function(item) {
			return item.tag;
		});

		Object.keys(redundantChildSelectors).forEach(function(nodeName) {
			var nodeIndex = selectorNodeNames.indexOf(nodeName),
				nextNode,
				curExpression,
				combinator,
				redundantNodes = redundantChildSelectors[nodeName];

			if ((nodeIndex > -1) && (nodeIndex < noExpressions - 1)) {
				// skip cases like the following: "article > ul li"
				if (expressions[nodeIndex].combinator !== ' ') {
					return;
				}

				// we've found the possible offender, get the next node in the selector
				// and compare it against rules in redundantChildSelectors
				nextNode = selectorNodeNames[nodeIndex + 1];

				if (redundantNodes.indexOf(nextNode) > -1) {
					// skip selectors that match:
					// - by attributes - foo[class*=bar]
					// - by pseudo attributes - foo:lang(fo)
					curExpression = expressions[nodeIndex];

					if (curExpression.pseudos || curExpression.attributes) {
						return;
					}

					// only the following combinator can match:
					// ul li
					// ul > li
					combinator = expressions[nodeIndex + 1].combinator;

					if ((combinator === ' ') || (combinator === '>')) {
						analyzer.incrMetric('redundantChildNodesSelectors');
						analyzer.addOffender('redundantChildNodesSelectors', selector);
					}
				}
			}
		});
	});
}

rule.description = 'Reports redundant child nodes selectors';
module.exports = rule;
