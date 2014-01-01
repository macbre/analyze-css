/*global describe, it */
'use strict';

var analyzer = require('../'),
	assert = require('assert'),
	tests;

tests = [
	{
		name: 'Empty CSS',
		css: '',
		check: /Empty CSS was provided/
	},
	{
		name: 'CSS with whitespaces only',
		css: '   ',
		check: /Empty CSS was provided/
	},
	{
		name: 'Non-string value',
		css: false,
		check: /css parameter passed is not a string/
	},
	{
		css: 'foo bar',
		check: /CSS parsing failed/
	},
	{
		css: 'foo bar [abc]',
		check: /CSS parsing failed/
	}
];

describe('Errors handling', function() {
	tests.forEach(function(test) {
		describe(test.name || '"' + test.css + '" CSS snippet', function() {
			it('should raise an error', function(done) {
				new analyzer(test.css, function(err, res) {
					assert.equal(test.check.test(err && err.toString()), true, err);
					done();
				});
			});
		});
	});
});
