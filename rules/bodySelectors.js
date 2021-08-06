"use strict";

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

    const firstTag = expressions[0].type == "tag" && expressions[0].name,
      firstHasClass =
        expressions[1].type == "attribute" && expressions[1].name == "class",
      isDescendantCombinator = expressions[1].combinator === ">",
      isShortExpression = noExpressions === 2;

    debug("selector: %s %j", selector, {
      firstTag,
      firstHasClass,
      isDescendantCombinator,
      isShortExpression,
    });

    let isRedundant = true; // always expect the worst ;)

    // first, let's find the body tag selector in the expression
    var bodyIndex = expressions
      .map(function (item) {
        return item.type == "tag" ? item.name : undefined;
      })
      .indexOf("body");

    // body selector not found - skip the rules that follow
    if (bodyIndex < 0) {
      return;
    }

    // matches "html > body"
    // {"type":"tag","name":"html","namespace":null},{"type":"child"},{"type":"tag","name":"body","namespace":null}
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
