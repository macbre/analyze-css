"use strict";

/**
 * Detect not minified CSS
 *
 * @param { import("../lib/css-analyzer") } analyzer
 */
function rule(analyzer) {
  analyzer.setMetric("notMinified");

  /**
   * A simple CSS minification detector
   *
   * @param {string} css
   * @return {boolean}
   */
  function isMinified(css) {
    // analyze the first 1024 characters
    css = css.trim().substring(0, 1024);

    // there should be no newline in minified file
    return /\n/.test(css) === false;
  }

  analyzer.on("css", (css) => {
    analyzer.setMetric("notMinified", isMinified(css) ? 0 : 1);
  });
}

rule.description = "Reports not minified CSS ";
module.exports = rule;
