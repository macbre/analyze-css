exports.tests = [
	{
		css: '.foo { -moz-border-radius: 2px }',
		metrics: {
			oldPropertyPrefixes: 1
		}
	},
	{
		css: '.foo { -webkit-still-valid-prefix: blur(5px) }',
		metrics: {
			oldPropertyPrefixes: 0
		}
	}
];
