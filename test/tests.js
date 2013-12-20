var analyzer = require('../'),
	assert = require('assert'),
	tests,
	testSelector;

tests = [
	// comments
	{
		css: '.foo { color: red } /* test */',
		metrics: {
			comments: 1,
			commentsLength: 6
		}
	},

	// empty rules
	{
		css: '.foo { } .bar { color: red } ',
		metrics: {
			emptyRules: 1
		}
	},

	// IE fixes
	{
		css: '* html .foo { color: red } .bar { color: blue }',
		metrics: {
			oldIEFixes: 1
		}
	},
	{
		css: '.foo { *color: red; border: blue }',
		metrics: {
			oldIEFixes: 1
		}
	},

	// importants
	{
		css: '.important { color: red !important }',
		metrics: {
			importants: 1
		}
	},

	// length
	{
		css: '.important { color: red !important }',
		metrics: {
			length: 36
		}
	},

	// stats
	{
		css: '.foo, .bar { color: red; border: blue }',
		metrics: {
			rules: 1,
			selectors: 2,
			declarations: 2
		}
	}
];

testSelector = function(test) {
	describe('should return proper metrics', function() {
		it('for "' + test.css + '"', function(done) {
			new analyzer(test.css, function(err, res) {
				var actualMetrics = res.metrics,
					expectedMetrics = test.metrics;

				Object.keys(expectedMetrics).forEach(function(metric) {
					assert.equal(expectedMetrics[metric], actualMetrics[metric], metric + ' should equal ' + expectedMetrics[metric] + ' (was ' + actualMetrics[metric]  + ')');
				});

				done();
			});
		});
	});
};

describe('Analyzer', function() {
	tests.forEach(testSelector);
});
