"use strict";
/**
 * @typedef { import("css-what").AttributeSelector[] } AttributeSelectors
 */

/**
 * @param { AttributeSelectors } expressions
 * @returns { number }
 */
function getBodyIndex(expressions) {
  let idx = 0;

  // body.foo h1 -> 0
  // .foo body -> 1
  // html.css body -> 1

  for (let i = 0; i < expressions.length; i++) {
    switch (expressions[i].type) {
      case "tag":
        if (expressions[i].name === "body") {
          return idx;
        }
        break;

      case "child":
      case "descendant":
        idx++;
    }
  }

  return -1;
}

/**
 * @param { AttributeSelectors } expressions
 * @returns {boolean}
 */
function firstSelectorHasClass(expressions) {
  // remove any non-class selectors
  return expressions[0].type === "tag"
    ? // h1.foo
      expressions[1].type === "attribute" && expressions[1].name === "class"
    : // .foo
      expressions[0].type === "attribute" && expressions[0].name === "class";
}

/**
 * @param { AttributeSelectors } expressions
 * @returns {number}
 */
function getDescendantCombinatorIndex(expressions) {
  // body > .foo
  // {"type":"child"}
  return expressions
    .filter((item) => {
      return !["tag", "attribute", "pseudo"].includes(item.type);
    })
    .map((item) => {
      return item.type;
    })
    .indexOf("child");
}

/**
 * @param { import("../lib/css-analyzer") } analyzer
 */
function rule(analyzer) {
  const debug = require("debug")("analyze-css:bodySelectors");

  analyzer.setMetric("redundantBodySelectors");

  analyzer.on("selector", function (_, selector, expressions) {
    const noExpressions = expressions.length;

    // check more complex selectors only
    if (noExpressions < 2) {
      return;
    }

    const firstTag = expressions[0].type === "tag" && expressions[0].name;

    const firstHasClass = firstSelectorHasClass(expressions);

    const isDescendantCombinator =
      getDescendantCombinatorIndex(expressions) === 0;

    // there only a single descendant / child selector
    // e.g. "body > foo" or "html h1"
    const isShortExpression =
      expressions.filter((item) => {
        return ["child", "descendant"].includes(item.type);
      }).length === 1;

    let isRedundant = true; // always expect the worst ;)

    // first, let's find the body tag selector in the expression
    const bodyIndex = getBodyIndex(expressions);

    debug("selector: %s %j", selector, {
      firstTag,
      firstHasClass,
      isDescendantCombinator,
      isShortExpression,
      bodyIndex,
    });

    // body selector not found - skip the rules that follow
    if (bodyIndex < 0) {
      return;
    }

    // matches "html > body"
    // {"type":"tag","name":"html","namespace":null}
    // {"type":"child"}
    // {"type":"tag","name":"body","namespace":null}
    //
    // matches "html.modal-popup-mode body" (issue #44)
    // {"type":"tag","name":"html","namespace":null}
    // {"type":"attribute","name":"class","action":"element","value":"modal-popup-mode","namespace":null,"ignoreCase":false}
    // {"type":"descendant"}
    // {"type":"tag","name":"body","namespace":null}
    if (
      firstTag === "html" &&
      bodyIndex === 1 &&
      (isDescendantCombinator || isShortExpression)
    ) {
      isRedundant = false;
    }
    // matches "body > .bar" (issue #82)
    else if (bodyIndex === 0 && isDescendantCombinator) {
      isRedundant = false;
    }
    // matches "body.foo ul li a"
    else if (bodyIndex === 0 && firstHasClass) {
      isRedundant = false;
    }
    // matches ".has-modal > body" (issue #49)
    else if (firstHasClass && bodyIndex === 1 && isDescendantCombinator) {
      isRedundant = false;
    }

    // report he redundant body selector
    if (isRedundant) {
      debug("selector %s - is redundant", selector);

      analyzer.incrMetric("redundantBodySelectors");
      analyzer.addOffender("redundantBodySelectors", selector);
    }
  });
}

rule.description = "Reports redundant body selectors";
module.exports = rule;
