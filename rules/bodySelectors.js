'use strict';

function rule(analyzer) {
	analyzer.setMetric('redundantBodySelectors');

	analyzer.on('selector', function(rule, selector, expressions) {
		var noExpressions = expressions.length;

		// check more complex selectors only
		if (noExpressions < 2) {
			return;
		}

		var firstTag = expressions[0].tag,
			firstHasClass = !!expressions[0].classList,
			isDescendantCombinator = (expressions[1].combinator === '>'),
			isShortExpression = (noExpressions === 2),
			isRedundant = true; // always expect the worst ;)

		// first, let's find the body tag selector in the expression
		var bodyIndex = expressions.
		map(function(item) {
			return item.tag;
		}).
		indexOf('body');

		// body selector not found - skip the rules that follow
		if (bodyIndex < 0) {
			return;
		}

		// matches "html > body"
		// matches "html.modal-popup-mode body" (issue #44)
		if ((firstTag === 'html') && (bodyIndex === 1) && (isDescendantCombinator || isShortExpression)) {
			isRedundant = false;
		}
		// matches "body > .bar" (issue #82)
		else if ((bodyIndex === 0) && isDescendantCombinator) {
			isRedundant = false;
		}
		// matches "body.foo ul li a"
		else if ((bodyIndex === 0) && firstHasClass) {
			isRedundant = false;
		}
		// matches ".has-modal > body" (issue #49)
		else if (firstHasClass && (bodyIndex === 1) && isDescendantCombinator) {
			isRedundant = false;
		}

		// report he redundant body selector
		if (isRedundant) {
			analyzer.incrMetric('redundantBodySelectors');
			analyzer.addOffender('redundantBodySelectors', selector);
		}
	});
}

rule.description = 'Reports redundant body selectors';
module.exports = rule;
