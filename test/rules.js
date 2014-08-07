/*global describe, it */
'use strict';

var analyzer = require('../'),
	assert = require('assert'),
	glob = require('glob');

function runTest(tests) {
	tests.forEach(function(test, testId) {
		new analyzer(test.css, function(err, res) {
			var metricsExpected = test.metrics,
				metricsActual = res && res.metrics;

			if (err) {
				throw err;
			}

			Object.keys(metricsExpected).forEach(function(metric) {
				it('should emit "' + metric + '" metric with a valid value - #' + (testId + 1), function() {
					assert.strictEqual(metricsActual[metric], metricsExpected[metric], "Testing metric against: " + test.css);
				});
			});
		});
	});
}

/**
 * Read all files in rules/ subdirectory and perform tests defined there
 */
describe('Rules', function() {
	var files = glob.sync(__dirname + "/rules/*.js"),
		nameRe = /([^\/]+)\.js$/;

	files.forEach(function(file) {
		var name = file.match(nameRe)[1],
			testDef = require(file);

		describe(name, function() {
			runTest(testDef.tests || []);
		});
	});
});
