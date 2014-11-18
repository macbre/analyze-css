/*global describe, it */
'use strict';

var extractColors = require('../rules/colors').extractColors,
	assert = require('assert');

describe('Colors', function() {
	it('should be properly extracted from CSS properties', function() {
		var testCases = [
			[
				'-moz-linear-gradient(top, rgba(240, 231, 223, 0) 50%, #f0e7df 100%)',
				['rgba(240, 231, 223, 0)', '#f0e7df']
			],
			[
				'#c6c3c0 #c6c3c0 transparent transparent',
				['#c6c3c0', '#c6c3c0']
			],
			[
				'1px solid #5dc9f4',
				['#5dc9f4']
			],
			[
				'#dfd',
				['#dfd']
			],
			[
				'rgb(0,0,0)',
				['rgb(0,0,0)']
			],
			[
				'-webkit-gradient(linear, 0% 0%, 0% 100%, color-stop(50%, #f8f4f0), color-stop(100%, #f0e7df))',
				['#f8f4f0', '#f0e7df']
			],
			[
				'none',
				false
			],
		];

		testCases.forEach(function(testCase) {
			var colors = extractColors(testCase[0]);
			assert.deepEqual(colors, testCase[1]);
		});
	});
});
