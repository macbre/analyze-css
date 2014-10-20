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
	{
		css: 'foo bar',
		check: /CSS parsing failed/,
		code: analyzer.EXIT_CSS_PARSE_ERROR
	},
	{
		css: 'foo bar [abc]',
		check: /CSS parsing failed/,
		code: analyzer.EXIT_CSS_PARSE_ERROR
	}
];

describe('Errors handling', function() {
	tests.forEach(function(test) {
		describe(test.name || '"' + test.css + '" CSS snippet', function() {
			it('should raise an error with correct error code', function(done) {
				new analyzer(test.css, function(err, res) {
					assert.equal(test.check.test(err && err.toString()), true, err);
					assert.equal(err.code, test.code);
					done();
				});
			});
		});
	});
});
