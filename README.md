analyze-css
===========

CSS selectors complexity and performance analyzer. analyze-css is built as a set of rules bound to events fired by CSS parser. Each rule can generate metrics and add "offenders" with more detailed information (see Usage section for an example).

## Install

analyze-css comes as a "binary" for command-line and as CommonJS module.

```
npm install --global analyze-css
```

## Usage

```
git clone git@github.com:macbre/analyze-css.git
cd analyze-css
./bin/analyze-css.js --file examples/elecena.css
```

```json
{
  "generator": "analyze-css v0.0.0",
  "metrics": {
    "comments": 1,
    "commentsLength": 68,
    "emptyRules": 0,
    "importants": 3,
    "length": 51665,
    "rules": 422,
    "selectors": 699,
    "declarations": 1240
  },
  "offenders": {
    "importants": [
      "header .ui-autocomplete {left: -75px !important}",
      ".ui-helper-hidden-accessible {position: absolute !important}",
      ".ui-state-disabled {cursor: default !important}"
    ]
  }
}
```

## Read more

* [Writing Efficient CSS](http://developer.mozilla.org/en/Writing_Efficient_CSS) (by Mozilla)
* [Profiling CSS for fun and profit. Optimization notes.](http://perfectionkills.com/profiling-css-for-fun-and-profit-optimization-notes/)
