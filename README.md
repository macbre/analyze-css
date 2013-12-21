analyze-css
===========

[![NPM version](https://badge.fury.io/js/analyze-css.png)](http://badge.fury.io/js/analyze-css)
[![Build Status](https://api.travis-ci.org/macbre/analyze-css.png)](http://travis-ci.org/macbre/analyze-css)

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
  console.log(results);
});

```

### Results

```json
{
  "generator": "analyze-css v0.0.0",
  "metrics": {
    "comments": 1,
    "commentsLength": 68,
    "complexSelectors": 32,
    "emptyRules": 0,
    "oldIEFixes": 51,
    "importants": 3,
    "qualifiedSelectors": 28,
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

* comments: number of comments in CSS source
* commentsLength: length of comments content in CSS source
* complexSelectors: number of complex selectors (consisting of more than three expressions, e.g. ``header ul li .foo``)
* emptyRules: number of rules with no properties (e.g. ``.foo { }``)
* oldIEFixes: number of fixes for old versions of Internet Explorer (e.g. ``* html .foo {}`` and ``.foo { *zoom: 1 }``, [read](http://blogs.msdn.com/b/ie/archive/2005/09/02/460115.aspx) [more](http://www.impressivewebs.com/ie7-ie8-css-hacks/))
* importants: number of properties with value forced by ``!important``
* qualifiedSelectors: number of [qualified selectors](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Writing_efficient_CSS) (e.g. ``header#nav``, ``.foo#bar``, ``h1.title``)
* selectorsByAttribute: number of selectors by attribute (e.g. ``.foo[value=bar]``)
* selectorsByClass: number of selectors by class
* selectorsById: number of selectors by ID
* selectorsByPseudo: number of pseudo-selectors (e,g. ``:hover``)
* selectorsByTag: number of selectors by tag name
* universalSelectors: number of selectors trying to match every element (e.g. ``.foo > *``)
* length: length of CSS source (in bytes)
* rules: number of rules (e.g. ``.foo, .bar { color: red }`` is counted as one rule)
* selectors: number of selectors (e.g. ``.foo, .bar { color: red }`` is counted as two selectors - ``.foo`` and ``.bar``)
* declarations: number of declarations (e.g. ``.foo, .bar { color: red }`` is counted as one declaration - ``color: red``)

## Read more

* [Writing Efficient CSS](http://developer.mozilla.org/en/Writing_Efficient_CSS) (by Mozilla)
* [Optimize browser rendering](https://developers.google.com/speed/docs/best-practices/rendering) (by Google)
* [Profiling CSS for fun and profit. Optimization notes.](http://perfectionkills.com/profiling-css-for-fun-and-profit-optimization-notes/)
* [CSS specificity](http://css-tricks.com/specifics-on-css-specificity/)
