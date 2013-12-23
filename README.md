analyze-css
===========

[![NPM version](https://badge.fury.io/js/analyze-css.png)](http://badge.fury.io/js/analyze-css)
[![Build Status](https://api.travis-ci.org/macbre/analyze-css.png)](http://travis-ci.org/macbre/analyze-css)
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/macbre/analyze-css/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

CSS selectors complexity and performance analyzer. analyze-css is built as a set of rules bound to events fired by CSS parser. Each rule can generate metrics and add "offenders" with more detailed information (see Usage section for an example).

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
analyze-css --url http://jigsaw.w3.org/css-validator/style/base.css
```

This will emit JSON formatted results on ``stdin``. Use ``--pretty`` option to make the output more readable.

### CommonJS module

```js
var analyzer = require('analyze-css');

new analyzer('.foo {margin: 0 !important}', function(err, results) {
  console.error(err);
  console.log(results); // example? see below
});

```

### Results

```json
{
  "generator": "analyze-css v0.0.0",
  "metrics": {
    "base64Length": 9308,
    "comments": 1,
    "commentsLength": 68,
    "complexSelectors": 32,
    "duplicatedSelectors": 7,
    "emptyRules": 0,
    "oldIEFixes": 51,
    "importants": 3,
    "oldPropertyPrefixes": 65,
    "qualifiedSelectors": 28,
    "specificityIdAvg": 0.05,
    "specificityIdTotal": 35,
    "specificityClassAvg": 1.25,
    "specificityClassTotal": 872,
    "specificityTagAvg": 0.78,
    "specificityTagTotal": 548,
    "selectorsByAttribute": 93,
    "selectorsByClass": 568,
    "selectorsById": 35,
    "selectorsByPseudo": 166,
    "selectorsByTag": 519,
    "universalSelectors": 4,
    "length": 51665,
    "rules": 422,
    "selectors": 699,
    "declarations": 1240
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
* **comments**: number of comments in CSS source
* **commentsLength**: length of comments content in CSS source
* **complexSelectors**: number of complex selectors (consisting of more than three expressions, e.g. ``header ul li .foo``)
* **duplicatedSelectors**: number of CSS selectors defined more than once in CSS source
* **emptyRules**: number of rules with no properties (e.g. ``.foo { }``)
* **oldIEFixes**: number of fixes for old versions of Internet Explorer (e.g. ``* html .foo {}`` and ``.foo { *zoom: 1 }``, [read](http://blogs.msdn.com/b/ie/archive/2005/09/02/460115.aspx) [more](http://www.impressivewebs.com/ie7-ie8-css-hacks/))
* **importants**: number of properties with value forced by ``!important``
* **oldPropertyPrefixes**: number of properties with no longer needed vendor prefix, powered by data provided by [autoprefixer](https://github.com/ai/autoprefixer) (e.g. ``--moz-border-radius``)
* **qualifiedSelectors**: number of [qualified selectors](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Writing_efficient_CSS) (e.g. ``header#nav``, ``.foo#bar``, ``h1.title``)
* **specificityIdAvg**: average [specificity](http://css-tricks.com/specifics-on-css-specificity/) for ID
* **specificityIdTotal**: total [specificity](http://css-tricks.com/specifics-on-css-specificity/) for ID
* **specificityClassAvg**: average [specificity](http://css-tricks.com/specifics-on-css-specificity/) for class, pseudo-class or attribute
* **specificityClassTotal**: total [specificity](http://css-tricks.com/specifics-on-css-specificity/) for class, pseudo-class or attribute
* **specificityTagAvg**: average [specificity](http://css-tricks.com/specifics-on-css-specificity/) for element
* **specificityTagTotal**: total [specificity](http://css-tricks.com/specifics-on-css-specificity/) for element
* **selectorsByAttribute**: number of selectors by attribute (e.g. ``.foo[value=bar]``)
* **selectorsByClass**: number of selectors by class
* **selectorsById**: number of selectors by ID
* **selectorsByPseudo**: number of pseudo-selectors (e,g. ``:hover``)
* **selectorsByTag**: number of selectors by tag name
* **universalSelectors**: number of selectors trying to match every element (e.g. ``.foo > *``)
* **length**: length of CSS source (in bytes)
* **rules**: number of rules (e.g. ``.foo, .bar { color: red }`` is counted as one rule)
* **selectors**: number of selectors (e.g. ``.foo, .bar { color: red }`` is counted as two selectors - ``.foo`` and ``.bar``)
* **declarations**: number of declarations (e.g. ``.foo, .bar { color: red }`` is counted as one declaration - ``color: red``)

## Read more

* [Writing Efficient CSS](http://developer.mozilla.org/en/Writing_Efficient_CSS) (by Mozilla)
* [Optimize browser rendering](https://developers.google.com/speed/docs/best-practices/rendering) (by Google)
* [Profiling CSS for fun and profit. Optimization notes.](http://perfectionkills.com/profiling-css-for-fun-and-profit-optimization-notes/)
* [CSS specificity](http://css-tricks.com/specifics-on-css-specificity/)

## Dev hints

Running tests and linting the code:

```
npm test && npm run-script lint
```

Turning on debug mode (i.e. verbose logging to stderr via [debug module](https://npmjs.org/package/debug)):

```
DEBUG=analyze-css* analyze-css ...
```
