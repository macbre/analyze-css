/*global describe, it */
'use strict';

const analyzer = require('../'),
	assert = require('assert'),
	glob = require('glob');

function runTest(tests) {
	tests.forEach(function(test, testId) {
		new analyzer(test.css, function(err, res) {
			const metricsExpected = test.metrics || {},
				offendersExpected = test.offenders || {},
				metricsActual = res && res.metrics,
				offendersActual = res && res.offenders;

			if (err) {
				throw err;
			}

			Object.keys(metricsExpected).forEach(function(metric) {
				it(
                    'should emit "' + metric + '" metric with a valid value - #' + (testId + 1),
                    () => {
                        assert.strictEqual(metricsActual[metric], metricsExpected[metric], "Testing metric against: " + test.css);
                    }
                );
			});

			Object.keys(offendersExpected).forEach(function(metric) {
				it(
                    'should emit offender for "' + metric + '" metric with a valid value - #' + (testId + 1),
                    () => {
                        assert.deepStrictEqual(offendersActual[metric].map(item => item.message), offendersExpected[metric], "Testing offender against: " + test.css);
                    }
                );
			});
		});
	});
}

/**
 * Read all files in rules/ subdirectory and perform tests defined there
 */
describe('Rules', () => {
	const files = glob.sync(__dirname + "/rules/*.js"),
		nameRe = /([^/]+)\.js$/;

	files.forEach(function(file) {
		var name = file.match(nameRe)[1],
			testDef = require(file);

		describe(name, () => {
			runTest(testDef.tests || []);
		});
	});
});
