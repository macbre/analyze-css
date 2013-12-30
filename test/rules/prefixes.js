exports.tests = [
	{
		css: '.foo { -moz-border-radius: 2px }',
		metrics: {
			oldPropertyPrefixes: 1
		}
	},
	{
		css: '.foo { -webkit-animation: none }',
		metrics: {
			oldPropertyPrefixes: 0
		}
	}
];
