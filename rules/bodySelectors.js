'use strict';

function rule(analyzer) {
	analyzer.setMetric('redundantBodySelectors');

	analyzer.on('selector', function(rule, selector, expressions) {
		// check more complex selectors only
		if (expressions.length < 2) {
			return;
		}

		var firstTag = expressions[0].tag,
			isDescendantCombinator = (expressions[1].combinator === '>'),
			isRedundant = false;

		// matches "html > body" fixes
		if (firstTag === 'html' && isDescendantCombinator && expressions[1].tag === 'body') {
			isRedundant = false;
		}
		// matches "body .foo", but not "body > .bar' nor "body.foo .bar"
		else if (firstTag === 'body' && !isDescendantCombinator && !expressions[0].classList) {
			isRedundant = true;
		}
		// matches ".foo body > h2"
		else {
			expressions.slice(1).forEach(function(expr) {
				if (expr.tag === 'body') {
					isRedundant = true;
				}
			});
		}

		if (isRedundant) {
			analyzer.incrMetric('redundantBodySelectors');
			analyzer.addOffender('redundantBodySelectors', selector);
		}
	});
}

rule.description = 'Reports redundant body selectors';
module.exports = rule;
