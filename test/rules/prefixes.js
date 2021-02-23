exports.tests = [
	{
		css: '.foo { -moz-border-radius: 2px }',
		metrics: {
			oldPropertyPrefixes: 1
		}
	},
	{
		css: '.foo { -webkit-backdrop-filter: blur(5px) }',
		metrics: {
			oldPropertyPrefixes: 0
		}
	}
];
