/**
 * SASS preprocessor
 *
 * @see https://github.com/sass/dart-sass#javascript-api
 */
"use strict";

var debug = require("debug")("analyze-css:preprocessors:sass");

module.exports = {
  name: "sass",
  matchesFileName: function (fileName) {
    return /\.(scss|sass)$/.test(fileName);
  },
  process: function (css, options) {
    var path = require("path"),
      sass,
      out;

    // check the presense of the optional "sass" module (#318)
    try {
      sass = require("sass");
      debug("Using: %s", sass.info.replace(/[\n\t]/g, " "));
    } catch (e) /* istanbul ignore next */ {
      throw new Error("Can't process SASS/SCSS, please run 'npm install sass'");
    }

    var includeDir = options.file ? path.dirname(options.file) : undefined;
    debug('Using "%s" include path', includeDir);

    try {
      // 1: try to parse using SCSS syntax (i.e. with brackets)
      debug("Parsing using SCSS syntax");

      out = sass.renderSync({
        data: css,
        indentedSyntax: false,
        includePaths: [includeDir],
      });
    } catch (e) {
      // 2: try to parse using SASS syntax (i.e. with indends) - issue #79
      debug("Exception: %s", e.toString().trim());
      debug("Parsing using SASS syntax as a fallback");

      out = sass.renderSync({
        data: css,
        indentedSyntax: true,
        includePaths: [includeDir],
      });
    }

    return out.css.toString();
  },
};
