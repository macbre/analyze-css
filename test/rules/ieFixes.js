exports.tests = [
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
	}
];
