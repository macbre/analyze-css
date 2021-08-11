"use strict";

/**
 * @param { import("../lib/css-analyzer") } analyzer
 */
function rule(analyzer) {
  let selectors = 0,
    selectorsLength = 0;

  analyzer.setMetric("selectors");
  analyzer.setMetric("selectorLengthAvg");

  analyzer.setMetric("selectorsByAttribute");
  analyzer.setMetric("selectorsByClass");
  analyzer.setMetric("selectorsById");
  analyzer.setMetric("selectorsByPseudo");
  analyzer.setMetric("selectorsByTag");

  analyzer.on("rule", () => {
    analyzer.incrMetric("rules");
  });

  analyzer.on("selector", (_, __, expressions) => {
    selectors += 1;
    selectorsLength +=
      expressions.filter((item) => {
        return ["child", "descendant"].includes(item.type);
      }).length + 1;
  });

  analyzer.on("declaration", () => {
    analyzer.incrMetric("declarations");
  });

  analyzer.on("expression", (selector, expression) => {
    // console.log(selector, expression);

    // a[href]
    if (["exists"].includes(expression.action)) {
      analyzer.incrMetric("selectorsByAttribute");
    }

    // .bar
    if (expression.name === "class") {
      analyzer.incrMetric("selectorsByClass");
    }

    // #foo
    if (expression.name === "id") {
      analyzer.incrMetric("selectorsById");
    }

    // a:hover
    if (expression.type === "pseudo") {
      analyzer.incrMetric("selectorsByPseudo");
    }

    // header
    if (expression.type === "tag") {
      analyzer.incrMetric("selectorsByTag");
    }
  });

  analyzer.on("report", () => {
    analyzer.setMetric("selectors", selectors);
    analyzer.setMetric("selectorLengthAvg", selectorsLength / selectors);
  });
}

rule.description = "Emit CSS stats";
module.exports = rule;
