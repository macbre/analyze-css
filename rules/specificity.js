"use strict";

var debug = require("debug")("analyze-css:specificity"),
  specificity = require("specificity"),
  stats = require("fast-stats").Stats;

/**
 * @param { import("../lib/css-analyzer") } analyzer
 */
function rule(analyzer) {
  var types = ["Id", "Class", "Tag"],
    values = [];

  // prepare metrics and stacks for values
  types.forEach(function (type) {
    analyzer.setMetric("specificity" + type + "Avg");
    analyzer.setMetric("specificity" + type + "Total");

    values.push(new stats());
  });

  analyzer.on("selector", function (rule, selector) {
    let selectorSpecificity;
    try {
      selectorSpecificity = specificity.calculate(selector);
    } catch (ex) {
      return;
    }

    /* istanbul ignore if */
    if (!selectorSpecificity) {
      debug("not counted for %s!", selector);
      return;
    }

    // parse the results
    const parts = [
      selectorSpecificity["A"],
      selectorSpecificity["B"],
      selectorSpecificity["C"],
    ];

    debug("%s: %s", selector, parts.join(","));

    // add each piece to a separate stack
    parts.forEach(function (val, idx) {
      values[idx].push(val);
    });
  });

  analyzer.on("report", function () {
    debug("Gathering stats...");

    types.forEach(function (type, idx) {
      analyzer.setMetric(
        "specificity" + type + "Avg",
        parseFloat(values[idx].amean().toFixed(2)),
      );
      analyzer.setMetric("specificity" + type + "Total", values[idx].Σ());
    });

    debug("Done");
  });
}

// @see http://www.w3.org/TR/css3-selectors/#specificity
// @see http://css-tricks.com/specifics-on-css-specificity/
rule.description = "Reports rules specificity";
module.exports = rule;
