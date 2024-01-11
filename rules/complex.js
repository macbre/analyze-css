"use strict";

var COMPLEX_SELECTOR_THRESHOLD = 3;

/**
 * @param { import("../lib/css-analyzer") } analyzer
 */
function rule(analyzer) {
  analyzer.setMetric("complexSelectors");

  // #foo .bar ul li a
  analyzer.on("selector", function (rule, selector, expressions) {
    const isComplexSelector = expressions.filter(expression => {
      return expression.type !== 'descendant'
    }).length > COMPLEX_SELECTOR_THRESHOLD;

    if (isComplexSelector) {
      analyzer.incrMetric("complexSelectors");
      analyzer.addOffender("complexSelectors", selector);
    }
  });
}

rule.description = "Reports too complex CSS selectors";
module.exports = rule;
