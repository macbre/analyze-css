analyze-css
===========

[![NPM version](https://badge.fury.io/js/analyze-css.png)](http://badge.fury.io/js/analyze-css)
[![Build Status](https://api.travis-ci.org/macbre/analyze-css.png)](http://travis-ci.org/macbre/analyze-css)
[![Known Vulnerabilities](https://snyk.io/test/github/macbre/analyze-css/badge.svg)](https://snyk.io/test/github/macbre/analyze-css)

[![Download stats](https://nodei.co/npm/analyze-css.png?downloads=true&downloadRank=true)](https://nodei.co/npm/analyze-css/)

CSS selectors complexity and performance analyzer. analyze-css is built as a set of rules bound to events fired by CSS parser. Each rule can generate metrics and add "offenders" with more detailed information (see Usage section for an example).

- [Analyze CSS Demo](http://www.testmycss.com/)

## Install

analyze-css comes as a "binary" for command-line and as CommonJS module. Run the following to install them globally:

```
npm install --global analyze-css
```

## Usage

### Command line tool

You can use analyze-css "binary" to analyze local CSS files or remote CSS assets:

```
analyze-css --file examples/elecena.css

analyze-css --url http://s3.macbre.net/analyze-css/propertyResets.css
analyze-css --url https://s3.macbre.net/analyze-css/propertyResets.css --ignore-ssl-errors
```

You can provide CSS via stdin as well (notice the dash: ``-``):

```
echo ".foo {margin: 0 \!important}" | analyze-css -
```

This will emit JSON formatted results on ``stdout``. Use ``--pretty`` (or ``-p`` shortcut) option to make the output readable for human beings.

Basic HTTP authentication can be provided through the options `--auth-user` and `--auth-pass`.

HTTP proxy (e.g. `http://localhost:8080`) can be provided via:

* `--proxy` or `-x` option
* `HTTP_PROXY` env variable

### CommonJS module

```js
var analyzer = require('analyze-css');

new analyzer('.foo {margin: 0 !important}', function(err, results) {
  console.error(err);
  console.log(results); // example? see below
});
```

```js
// options can be provided
var opts = {
  'noOffenders': true
};

new analyzer('.foo {margin: 0 !important}', opts, function(err, results) {
  console.error(err);
  console.log(results); // example? see below
});```
```

### [grunt task](https://www.npmjs.org/package/grunt-contrib-analyze-css)

> Created by @DeuxHuitHuit

```
npm i grunt-contrib-analyze-css
```

It uses configurable threshold and compares the analyze-css result with it.

### Results

```json
{
  "generator": "analyze-css v0.10.2",
  "metrics": {
    "base64Length": 11332,
    "redundantBodySelectors": 0,
    "redundantChildNodesSelectors": 1,
    "colors": 106,
    "comments": 1,
    "commentsLength": 68,
    "complexSelectors": 37,
    "duplicatedSelectors": 7,
    "duplicatedProperties": 24,
    "emptyRules": 0,
    "expressions": 0,
    "oldIEFixes": 51,
    "imports": 0,
    "importants": 3,
    "mediaQueries": 0,
    "notMinified": 0,
    "multiClassesSelectors": 74,
    "parsingErrors": 0,
    "oldPropertyPrefixes": 79,
    "propertyResets": 0,
    "qualifiedSelectors": 28,
    "specificityIdAvg": 0.04,
    "specificityIdTotal": 25,
    "specificityClassAvg": 1.27,
    "specificityClassTotal": 904,
    "specificityTagAvg": 0.79,
    "specificityTagTotal": 562,
    "selectors": 712,
    "selectorLengthAvg": 1.5722460658082975,
    "selectorsByAttribute": 92,
    "selectorsByClass": 600,
    "selectorsById": 25,
    "selectorsByPseudo": 167,
    "selectorsByTag": 533,
    "length": 55173,
    "rules": 433,
    "declarations": 1288
  },
  "offenders": {
    "importants": [
      ".foo {margin: 0 !important}"
    ]
  }
}
```

## Metrics

* **base64Length**: total length of base64-encoded data in CSS source (will warn about base64-encoded data bigger than 4 kB)
* **redundantBodySelectors**: number of redundant body selectors (e.g. ``body .foo``, ``section body h2``, but not ``body > h1``)
* **redundantChildNodesSelectors**: number of redundant child nodes selectors (e.g. ``ul li``, ``table tr``)
* **colors**: number of unique colors used in CSS
* **comments**: number of comments in CSS source
* **commentsLength**: length of comments content in CSS source
* **complexSelectors**: number of complex selectors (consisting of more than three expressions, e.g. ``header ul li .foo``)
* **duplicatedSelectors**: number of CSS selectors defined more than once in CSS source
* **duplicatedProperties**: number of CSS property definitions duplicated within a selector
* **emptyRules**: number of rules with no properties (e.g. ``.foo { }``)
* **expressions**: number of rules with CSS expressions (e.g. ``expression( document.body.clientWidth > 600 ? "600px" : "auto" )``)
* **oldIEFixes**: number of fixes for old versions of Internet Explorer (e.g. ``* html .foo {}`` and ``.foo { *zoom: 1 }``, [read](http://blogs.msdn.com/b/ie/archive/2005/09/02/460115.aspx) [more](http://www.impressivewebs.com/ie7-ie8-css-hacks/))
* **imports** number of ``@import`` rules
* **importants**: number of properties with value forced by ``!important``
* **mediaQueries**: number of media queries (e.g. ``@media screen and (min-width: 1370px)``)
* **notMinified**: set to 1 if the provided CSS is not minified
* **multiClassesSelectors**: reports selectors with multiple classes (e.g. ``span.foo.bar``)
* **parsingErrors**: number of CSS parsing errors
* **oldPropertyPrefixes**: number of properties with no longer needed vendor prefix, powered by data provided by [autoprefixer](https://github.com/ai/autoprefixer) (e.g. ``--moz-border-radius``)
* **propertyResets**: number of [accidental property resets](http://css-tricks.com/accidental-css-resets/)
* **qualifiedSelectors**: number of [qualified selectors](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Writing_efficient_CSS) (e.g. ``header#nav``, ``.foo#bar``, ``h1.title``)
* **specificityIdAvg**: average [specificity](http://css-tricks.com/specifics-on-css-specificity/) for ID
* **specificityIdTotal**: total [specificity](http://css-tricks.com/specifics-on-css-specificity/) for ID
* **specificityClassAvg**: average [specificity](http://css-tricks.com/specifics-on-css-specificity/) for class, pseudo-class or attribute
* **specificityClassTotal**: total [specificity](http://css-tricks.com/specifics-on-css-specificity/) for class, pseudo-class or attribute
* **specificityTagAvg**: average [specificity](http://css-tricks.com/specifics-on-css-specificity/) for element
* **specificityTagTotal**: total [specificity](http://css-tricks.com/specifics-on-css-specificity/) for element
* **selectors**: number of selectors (e.g. ``.foo, .bar { color: red }`` is counted as two selectors - ``.foo`` and ``.bar``)
* **selectorLengthAvg**: average length of selector (e.g. for ``.foo .bar, #test div > span { color: red }`` will be set as 2.5)
* **selectorsByAttribute**: number of selectors by attribute (e.g. ``.foo[value=bar]``)
* **selectorsByClass**: number of selectors by class
* **selectorsById**: number of selectors by ID
* **selectorsByPseudo**: number of pseudo-selectors (e,g. ``:hover``)
* **selectorsByTag**: number of selectors by tag name
* **length**: length of CSS source (in bytes)
* **rules**: number of rules (e.g. ``.foo, .bar { color: red }`` is counted as one rule)
* **declarations**: number of declarations (e.g. ``.foo, .bar { color: red }`` is counted as one declaration - ``color: red``)

## Read more

* [Writing Efficient CSS](http://developer.mozilla.org/en/Writing_Efficient_CSS) (by Mozilla)
* [Optimize browser rendering](https://developers.google.com/speed/docs/best-practices/rendering) (by Google)
* [Profiling CSS for fun and profit. Optimization notes.](http://perfectionkills.com/profiling-css-for-fun-and-profit-optimization-notes/)
* [CSS specificity](http://css-tricks.com/specifics-on-css-specificity/)
* [CSS Selector Performance has changed! (For the better)](http://calendar.perfplanet.com/2011/css-selector-performance-has-changed-for-the-better/) (by Nicole Sullivan)
* [CSS Performance](http://dl.dropboxusercontent.com/u/39519/talks/cssperf/index.html) (by Paul Irish)
* [GitHub's CSS Performance](https://speakerdeck.com/jonrohan/githubs-css-performance) (by Joh Rohan)

## Dev hints

Running tests and linting the code:

```
npm test && npm run-script lint
```

Turning on debug mode (i.e. verbose logging to stderr via [debug module](https://npmjs.org/package/debug)):

```
DEBUG=analyze-css* analyze-css ...
```
