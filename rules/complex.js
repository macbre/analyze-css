"use strict";

var COMPLEX_SELECTOR_THRESHOLD = 3;

/**
 * @param { import("../lib/css-analyzer") } analyzer
 */
function rule(analyzer) {
  analyzer.setMetric("complexSelectors");

  // #foo .bar ul li a
  analyzer.on("selector", function (rule, selector, expressions) {
    var filteredExpr = expressions.filter((item) => {
      return ! ["adjacent", "parent", "child", "descendant", "sibling", "column-combinator"].includes(item.type);
    });
    if (filteredExpr.length > COMPLEX_SELECTOR_THRESHOLD) {
      analyzer.incrMetric("complexSelectors");
      analyzer.addOffender("complexSelectors", selector);
    }
  });
}

rule.description = "Reports too complex CSS selectors";
module.exports = rule;
