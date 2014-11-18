/**
 * A wrapper for preprocessors
 */
'use strict';

var debug = require('debug')('analyze-css:preprocessors'),
	glob = require('glob');

var preprocessors = function() {

};

preprocessors.prototype = {

	get: function(name) {
		return require(__dirname + '/preprocessors/' + name + '.js');
	},

	// return instances of all available preprocessors
	getAll: function() {
		var files,
			res = [];

		files = glob.sync(__dirname + '/preprocessors/*.js');
		debug('Initializing...');

		if (Array.isArray(files)) {
			files.forEach(function(file) {
				res.push(require(file));
			});
		}

		return res;
	},

	// get name of matching preprocessor
	findMatchingByFileName: function(fileName) {
		var matching = false;

		this.getAll().forEach(function(preprocessor) {
			if (preprocessor.matchesFileName(fileName)) {
				matching = preprocessor.name;

				debug('%s matches "%s" preprocessor', fileName, matching);
				return false;
			}
		});

		return matching;
	}
};

module.exports = preprocessors;
