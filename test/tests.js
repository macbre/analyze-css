var analyzer = require('../'),
	assert = require('assert'),
	tests,
	testSelector;

tests = [
	// comments
	{
		css: '.foo { background-image: url(data:image/gif;base64,R0lGODlhAQABAIABAAAAAP///yH5BAEAAAEALAAAAAABAAEAQAICTAEAOw%3D%3D) }', // blank 1x1 gif
		metrics: {
			base64Length: 64
		}
	},

	// comments
	{
		css: '.foo { color: red } /* test */',
		metrics: {
			comments: 1,
			commentsLength: 6
		}
	},
	{
		css: 'body { padding-bottom: 6em; min-width: 40em; /* for the tabs, mostly */ }',
		metrics: {
			comments: 1,
			commentsLength: 22
		}
	},

	// complex selectors
	{
		css: 'header ul li .foo { color: red }',
		metrics: {
			complexSelectors: 1
		}
	},

	// duplicated selectors
	{
		css: '.foo { } .bar { }',
		metrics: {
			duplicatedSelectors: 0
		}
	},
	{
		css: '.foo, #bar { } .foo { }',
		metrics: {
			duplicatedSelectors: 0
		}
	},
	{
		css: '.foo { } .foo { }',
		metrics: {
			duplicatedSelectors: 1
		}
	},
	{
		css: '.foo { } .bar .foo { } .foo { }',
		metrics: {
			duplicatedSelectors: 1
		}
	},
	{
		css: '.foo { } .foo { } .foo { }',
		metrics: {
			duplicatedSelectors: 1
		}
	},
	{
		css: '.foo { } .bar { } .foo { } .bar { } #foo { } .bar { }',
		metrics: {
			duplicatedSelectors: 2
		}
	},

	// empty rules
	{
		css: '.foo { } .bar { color: red } ',
		metrics: {
			emptyRules: 1
		}
	},
	{
		css: '.foo { /* a comment */ }',
		metrics: {
			emptyRules: 1
		}
	},

	{
		css: '.foo { color:red /* a comment */ }',
		metrics: {
			emptyRules: 0
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

	// outdated vendor prefixes
	{
		css: '.foo { -moz-border-radius: 2px }',
		metrics: {
			oldPropertyPrefixes: 1
		}
	},
	{
		css: '.foo { -webkit-animation: none }',
		metrics: {
			oldPropertyPrefixes: 0
		}
	},

	// qualified selectors
	{
		css: '.foo, #bar, header {}',
		metrics: {
			qualifiedSelectors: 0
		}
	},
	{
		css: 'header#nav {}',
		metrics: {
			qualifiedSelectors: 1
		}
	},
	{
		css: '.foo#bar {}',
		metrics: {
			qualifiedSelectors: 1
		}
	},
	{
		css: 'h1.title, a {}',
		metrics: {
			qualifiedSelectors: 1
		}
	},

	// specificty
	{
		css: '#foo {}',
		metrics: {
			specificityIdAvg: 1,
			specificityIdTotal: 1
		}
	},
	{
		css: '.foo {}',
		metrics: {
			specificityClassAvg: 1,
			specificityClassTotal: 1
		}
	},
	{
		css: 'a {}',
		metrics: {
			specificityTagAvg: 1,
			specificityTagTotal: 1
		}
	},
	{
		css: '.search-result figure.image:hover > .price {}',
		metrics: {
			specificityIdAvg: 0,
			specificityIdTotal: 0,
			specificityClassAvg: 4,
			specificityClassTotal: 4,
			specificityTagAvg: 1,
			specificityTagTotal: 1
		}
	},
	{
		css: '.search-result figure.image:hover > .price {} #slideshow > form input[type="text"] {}',
		metrics: {
			specificityIdAvg: 0.5,
			specificityIdTotal: 1,
			specificityClassAvg: 2.5,
			specificityClassTotal: 5,
			specificityTagAvg: 1.5,
			specificityTagTotal: 3
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
	},
	{
		css: '#foo {}',
		metrics: {
			selectorsById: 1
		}
	},
	{
		css: 'a {}',
		metrics: {
			selectorsByTag: 1
		}
	},
	{
		css: '* {}',
		metrics: {
			selectorsByTag: 0
		}
	},
	{
		css: '[href] {}',
		metrics: {
			selectorsByAttribute: 1,
		}
	},
	{
		css: '.bar {}',
		metrics: {
			selectorsByClass: 1,
		}
	},
	{
		css: 'a:hover {}',
		metrics: {
			selectorsByPseudo: 1,
		}
	},
	{
		css: '#foo, a.bar, li, a[href], a:hover {}',
		metrics: {
			selectorsByAttribute: 1,
			selectorsByClass: 1,
			selectorsById: 1,
			selectorsByPseudo: 1,
			selectorsByTag: 4
		}
	},

	// universal selectors
	{
		css: '* html .ui-autocomplete {}',
		metrics: {
			universalSelectors: 0
		}
	},
	{
		css: 'input[type="..."] {}',
		metrics: {
			universalSelectors: 0
		}
	},
	{
		css: '.foo[type="..."] {}',
		metrics: {
			universalSelectors: 0
		}
	},
	{
		css: '#id[type="..."] {}',
		metrics: {
			universalSelectors: 0
		}
	},
	{
		css: '[type="..."] {}',
		metrics: {
			universalSelectors: 1
		}
	},
	{
		css: 'ul :hover {}',
		metrics: {
			universalSelectors: 1
		}
	},
	{
		css: '.foo > * {}',
		metrics: {
			universalSelectors: 1
		}
	},
	{
		css: 'table.wikitable>*>tr>th {}',
		metrics: {
			universalSelectors: 1
		}
	},
	{
		css: '.foo * li {}',
		metrics: {
			universalSelectors: 1
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
					assert.strictEqual(expectedMetrics[metric], actualMetrics[metric], metric + ' should equal ' + expectedMetrics[metric] + ' (got ' + actualMetrics[metric]  + ')');
				});

				done();
			});
		});
	});
};

describe('Analyzer', function() {
	tests.forEach(testSelector);
});
