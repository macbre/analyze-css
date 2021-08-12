"use strict";

/**
 * @param { import("../lib/css-analyzer") } analyzer
 */
function rule(analyzer) {
  analyzer.setMetric("multiClassesSelectors");

  analyzer.on("selector", (_, selector, expressions) => {
    const expressionsWithClass = expressions.filter(
      (expr) => expr.name === "class"
    );

    // console.log(selector, expressions, {expressionsWithClass});

    if (expressionsWithClass.length > 1) {
      analyzer.incrMetric("multiClassesSelectors");
      analyzer.addOffender(
        "multiClassesSelectors",
        "." + expressionsWithClass.map((expr) => expr.value).join(".")
      );
    }
  });
}

rule.description = "Reports selectors with multiple classes";
module.exports = rule;
