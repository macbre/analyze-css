"use strict";

/**
 * @param { import("../lib/css-analyzer") } analyzer
 */
function rule(analyzer) {
  analyzer.setMetric("parsingErrors");

  analyzer.on("error", (err) => {
    analyzer.incrMetric("parsingErrors");
    analyzer.addOffender("parsingErrors", err.message);
  });
}

rule.description = "CSS parsing errors";
module.exports = rule;
