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
