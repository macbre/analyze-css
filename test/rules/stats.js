exports.tests = [
	{
		css: '.foo, .bar { color: red; border: blue }',
		metrics: {
			rules: 1,
			selectors: 2,
			selectorLengthAvg: 1,
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
		css: 'ul li, a.foo.bar {}',
		metrics: {
			selectorsByClass: 1,
			selectorsByTag: 3,
			selectorLengthAvg: 1.5
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
			selectorLengthAvg: 1
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
	{
		css: 'div .foo, div .bar, div .foo .bar, div#foo .bar span.test {}',
		metrics: {
			selectors: 4,
			selectorLengthAvg: 2.5
		}
	}
];
