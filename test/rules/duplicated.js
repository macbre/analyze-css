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
	},
	// @font-face (see #52)
	{
		css: '@font-face { font-family: myFont; src: url(sansation.woff);} @font-face { font-family: myFont; src: url(sansation_bold.woff); font-weight: bold;} ',
		metrics: {
			duplicatedSelectors: 0
		}
	},
	{
		css: '@font-face { font-family: myFont; src: url(sansation_foo.woff);} @font-face { font-family: myFontFoo; src: url(sansation_foo.woff); font-weight: bold;} ',
		metrics: {
			duplicatedSelectors: 1
		}
	},
	// duplicated properties
	{
		css: '#foo { background: none; background-color: red;}',
		metrics: {
			duplicatedProperties: 0
		}
	},
	{
		css: '#foo { background: none; background-color: red; background: transparent}',
		metrics: {
			duplicatedProperties: 1
		}
	},
	{
		css: '#foo { color: #000; background: none; background-color: red; color: red; color: blue; background: none}',
		metrics: {
			duplicatedProperties: 3 // color x3, background x2
		}
	},
];
