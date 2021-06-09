/*global describe, it */
'use strict';

var analyzer = require('../'),
	assert = require('assert'),
	tests;

tests = [
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
	// issue #98
	{
		name: 'Invalid CSS selector',
		css: 'foo, bar, {color: red}',
		check: /Unable to parse "" selector. Rule position start @ 1:1, end @ 1:23/,
		code: analyzer.EXIT_PARSING_FAILED
	}
];

describe('Errors handling', function() {
	tests.forEach(function(test) {
		describe(test.name || '"' + test.css + '" CSS snippet', function() {
			it('should raise an error with correct error code', function(done) {
				new analyzer(test.css, function(err, res) {
					assert.equal(err instanceof Error, true, 'Error should be thrown');

					if (!test.check.test(err.toString())) {
						assert.fail(err.toString(), test.check);
					}

					assert.equal(err.code, test.code);
					assert.equal(res, null);
					done();
				});
			});
		});
	});
});
