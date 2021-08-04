"use strict";

/**
 * @param { import("../lib/index").CSSAnalyzer } analyzer
 */
function rule(analyzer) {
  analyzer.on("css", function (css) {
    analyzer.setMetric("length", css.length);
  });
}

rule.description = "Length of CSS file";
module.exports = rule;
