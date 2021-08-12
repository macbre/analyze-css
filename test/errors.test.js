const { describe, it } = require("@jest/globals");

const analyzer = require('../');
const assert = require('assert');

const tests = [
	{
		name: 'Empty CSS',
		css: '',
		check: /Empty CSS was provided/,
		code: analyzer.EXIT_EMPTY_CSS
	},
	{
		name: 'CSS with whitespaces only',
		css: '   ',
		check: /Empty CSS was provided/,
		code: analyzer.EXIT_EMPTY_CSS
	},
	{
		name: 'Non-string value',
		css: false,
		check: /css parameter passed is not a string/,
		code: analyzer.EXIT_CSS_PASSED_IS_NOT_STRING
	},
];

describe('Errors handling', () => {
	tests.forEach(test => {
		describe(test.name || '"' + test.css + '" CSS snippet', () => {
			it('should raise an error with correct error code', async () => {
				try {
					await analyzer(test.css);
					assert.fail("analyzer() is expected to fail");
				}
				catch(err) {
					assert.strictEqual(err instanceof Error, true, 'Error should be thrown');

					if (!test.check.test(err.toString())) {
						console.error('Got instead: ', err);
						assert.fail(`${test.name} case raised: ${err.message} (expected ${test.check})`);
					}

					assert.strictEqual(err.code, test.code);
				};
			});
		});
	});
});
