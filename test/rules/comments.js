exports.tests = [
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
	{
		css: 'body { padding-bottom: 6em; min-width: 40em }' +
		'/* really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really really long comment */',
		metrics: {
			comments: 1,
			commentsLength: 273
		}
	}
];
