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
		return /\.scss$/.test(fileName);
	},
	process: function(css, options) {
		var path = require('path'),
			sass = require('node-sass');

		var includeDir = path.dirname(options.file);
		debug('Using "%s" include path', includeDir);

		return sass.renderSync({
			data: css,
			includePaths: [
				includeDir
			]
		});
	}
};
