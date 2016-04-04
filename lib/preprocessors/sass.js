/**
 * SASS preprocessor
 *
 * @see https://www.npmjs.org/package/node-sass
 */
'use strict';

var debug = require('debug')('analyze-css:preprocessors:sass');

module.exports = {

	name: 'sass',
	matchesFileName: function(fileName) {
		return /\.(scss|sass)$/.test(fileName);
	},
	process: function(css, options) {
		var path = require('path'),
			sass,
			out;

		// check the presense of the optional "node-sass" module (#118)
		try {
			sass = require('node-sass');
		} catch (e) {
			throw new Error("Can't process SASS/SCSS, please run 'npm install node-sass'");
		}

		var includeDir = path.dirname(options.file);
		debug('Using "%s" include path', includeDir);

		try {
			// 1: try to parse using SCSS syntax (i.e. with brackets)
			debug('Parsing using SCSS syntax');

			out = sass.renderSync({
				data: css,
				indentedSyntax: false,
				includePaths: [
					includeDir
				]
			});
		} catch (e) {
			// 2: try to parse using SASS syntax (i.e. with indends) - issue #79
			debug('Exception: %s', e.toString().trim());
			debug('Parsing using SASS syntax as a fallback');

			out = sass.renderSync({
				data: css,
				indentedSyntax: true,
				includePaths: [
					includeDir
				]
			});
		}

		return out.css.toString();
	}
};
