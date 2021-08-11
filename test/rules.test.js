/**
 * You can test a specific rule only by providing TEST_RULE env variable.
 *
 * e.g. $ TEST_RULE=stats npx jest test/rules.test.js
 */
const { describe, it } = require("@jest/globals");
const process = require('process');

const analyzer = require('../'),
	assert = require('assert'),
	glob = require('glob');

function testCase(test, testId, testName) {

	it(`case #${testId + 1}`, async () => {
		const res = await analyzer(test.css);

		const metricsExpected = test.metrics || {},
			offendersExpected = test.offenders || {},
			metricsActual = res && res.metrics,
			offendersActual = res && res.offenders;

		function it(name, fn) {
			// console.debug(name + "\n");
			fn();
		}

		Object.keys(metricsExpected).forEach(function(metric) {
			it(
				'should emit "' + metric + '" metric with a valid value - #' + (testId + 1),
				() => {
					assert.strictEqual(metricsActual[metric], metricsExpected[metric], `${testName}: testing ${metric} metric against: ${test.css}`);
				}
			);
		});

		Object.keys(offendersExpected).forEach(function(metric) {
			it(
				'should emit offender for "' + metric + '" metric with a valid value - #' + (testId + 1),
				() => {
					assert.deepStrictEqual(offendersActual[metric].map(item => item.message), offendersExpected[metric], `${testName}: testing ${metric} offender against: ${test.css}`);
				}
			);
		});
	});
}

/**
 * Read all files in rules/ subdirectory and perform tests defined there
 */
describe('Rules', () => {
	const files = glob.sync(__dirname + "/rules/*.js"),
		nameRe = /([^/]+)\.js$/,
		selectedRule = process.env.TEST_RULE;

	files.forEach(function(file) {
		var name = file.match(nameRe)[1],
			testDef = require(file).tests || [];

		if (selectedRule && selectedRule !== name) {
			return;
		}

		describe(name, () => {
			testDef.forEach((testItem, testId) => {
				testCase(testItem, testId, name);
			});
		});
	});
});
