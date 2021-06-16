"use strict";

var format = require("util").format;

function rule(analyzer) {
  analyzer.setMetric("mediaQueries");

  analyzer.on("media", function (query, rules) {
    analyzer.incrMetric("mediaQueries");
    analyzer.addOffender(
      "mediaQueries",
      format("@media %s (%d rules)", query, rules.length)
    );
  });
}

rule.description = "Reports media queries";
module.exports = rule;
