"use strict";

/**
 * @param { import("../lib/css-analyzer") } analyzer
 */
function rule(analyzer) {
  analyzer.on("css", function (css) {
    analyzer.setMetric("length", css.length);
  });
}

rule.description = "Length of CSS file";
module.exports = rule;
