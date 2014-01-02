exports.tests = [
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
	// media queries
	{
		css: '.foo { } @media screen { .foo { } }',
		metrics: {
			duplicatedSelectors: 0
		}
	},
	{
		css: '@media print { .foo { } } @media screen { .foo { } } .foo {}',
		metrics: {
			duplicatedSelectors: 0
		}
	},
	{
		css: '.foo { } @media screen { .foo { } } .foo { color: red }',
		metrics: {
			duplicatedSelectors: 1
		}
	},
	{
		css: '#foo { } @media screen { .foo { } } @media screen { .foo { color: red } }',
		metrics: {
			duplicatedSelectors: 1
		}
	},
	// duplicated selectors
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
	}
];
