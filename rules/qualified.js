"use strict";

/**
 * @param { import("../lib/css-analyzer") } analyzer
 */
function rule(analyzer) {
  analyzer.setMetric("qualifiedSelectors");

  // @see https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Writing_efficient_CSS
  analyzer.on("selector", (_, selector, expressions) => {
    var hasId = expressions.some((expr) => expr.name === "id"),
      hasTag = expressions.some((expr) => expr.type === "tag"),
      hasClass = expressions.some((expr) => expr.name === "class");

    // console.log(selector, expressions, {hasId, hasTag, hasClass});

    if (
      // tag#id
      (hasId && hasTag) ||
      // .class#id
      (hasId && hasClass) ||
      // tag.class
      (hasClass && hasTag)
    ) {
      analyzer.incrMetric("qualifiedSelectors");
      analyzer.addOffender("qualifiedSelectors", selector);
    }
  });
}

rule.description = "Reports qualified selectors";
module.exports = rule;
