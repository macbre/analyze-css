exports.tests = [
	{
		css: 'foo { color= red; } bar { color: blue; } baz {}} boo { display: none}',
		metrics: {
			parsingErrors: 1
		},
		offenders: {
			parsingErrors: [
				'Empty sub-selector'
			]
		}
	},
	{
		css: '.foo { /* a comment */ }',
		metrics: {
			parsingErrors: 0
		}
	},
];
