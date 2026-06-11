exports.tests = [
	{
		css: 'foo { color= red; } bar { color: blue; } baz {}} boo { display: none}',
		metrics: {
			parsingErrors: 2
		},
		offenders: {
			parsingErrors: [
				"property missing ':'",
				"extra '}'"
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
