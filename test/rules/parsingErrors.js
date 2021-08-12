exports.tests = [
	{
		css: 'foo { color= red; } bar { color: blue; } baz {}} boo { display: none}',
		metrics: {
			parsingErrors: 1
		},
		offenders: {
			parsingErrors: [
				'Unmatched selector: = red; } bar'
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
