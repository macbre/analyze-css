exports.tests = [
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
	}
];
