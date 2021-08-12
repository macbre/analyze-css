"use strict";

/**
 * @param { import("css-what").Selector[] } expressions
 * @returns { number }
 */
function getExpressionsLength(expressions) {
  // body -> 1
  // ul li -> 2
  // ol:lang(or) li -> 2
  // .class + foo a -> 3
  return (
    expressions.filter((item) => {
      return ["child", "descendant", "adjacent"].includes(item.type);
    }).length + 1
  );
}

/**
 * Report redundant child selectors, e.g.:
 *
 * ul li
 * ul > li
 * table > tr
 * tr td
 *
 * @param { import("../lib/css-analyzer") } analyzer
 */
function rule(analyzer) {
  // definition of redundant child nodes selectors (see #51 for the initial idea):
  // ul li
  // ol li
  // table tr
  // table th
  const redundantChildSelectors = {
    ul: ["li"],
    ol: ["li"],
    select: ["option"],
    table: ["tr", "th"], // e.g. table can not be followed by any of tr / th
    tr: ["td", "th"],
  };

  analyzer.setMetric("redundantChildNodesSelectors");

  analyzer.on("selector", (_, selector, expressions) => {
    // there only a single descendant / child selector
    // e.g. "body > foo" or "html h1"
    //
    // check more complex selectors only
    if (getExpressionsLength(expressions) < 3) {
      return;
    }

    Object.keys(redundantChildSelectors).forEach((tagName) => {
      // find the tagName in our selector
      const tagInSelectorIndex = expressions
        .map((expr) => expr.type == "tag" && expr.name)
        .indexOf(tagName);

      // tag not found in the selector
      if (tagInSelectorIndex < 0) {
        return;
      }

      // converts "ul#foo > li.test" selector into [{tag: 'ul'}, {combinator:'child'}, {tag: 'li'}] list
      const selectorNodeNames = expressions
        .filter((expr) =>
          [
            "tag",
            "descendant" /* */,
            "child" /* > */,
            "adjacent" /* + */,
          ].includes(expr.type)
        )
        .map((expr) =>
          expr.name ? { tag: expr.name } : { combinator: expr.type }
        );

      // console.log(selector, expressions, selectorNodeNames);

      const tagIndex = selectorNodeNames
        .map((item) => item.tag)
        .indexOf(tagName);

      const nextTagInSelector = selectorNodeNames[tagIndex + 2]?.tag;
      const nextCombinator = selectorNodeNames[tagIndex + 1]?.combinator;
      const previousCombinator = selectorNodeNames[tagIndex - 1]?.combinator;

      // our tag is not followed by the tag listed in redundantChildSelectors
      const followedByRedundantTag =
        redundantChildSelectors[tagName].includes(nextTagInSelector);
      if (!followedByRedundantTag) {
        return;
      }

      // ignore cases like "article > ul li"
      if (previousCombinator === "child") {
        return;
      }

      // console.log(
      //   tagName, {selector, expressions}, selectorNodeNames,
      //   {tagIndex, prreviousTagInSelector, previousCombinator, nextTagInSelector, nextCombinator, followedByRedundantTag}
      // );

      // only the following combinator can match:
      // ul li
      // ul > li
      if (
        followedByRedundantTag &&
        ["descendant", "child"].includes(nextCombinator)
      ) {
        analyzer.incrMetric("redundantChildNodesSelectors");
        analyzer.addOffender("redundantChildNodesSelectors", selector);
      }
    });
  });
}

rule.description = "Reports redundant child nodes selectors";
module.exports = rule;
