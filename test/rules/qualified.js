exports.tests = [
	{
		css: '.foo, #bar, header {}',
		metrics: {
			qualifiedSelectors: 0
		}
	},
	{
		css: 'header#nav {}',
		metrics: {
			qualifiedSelectors: 1
		}
	},
	{
		css: '.foo#bar {}',
		metrics: {
			qualifiedSelectors: 1
		}
	},
	{
		css: 'h1.title, a {}',
		metrics: {
			qualifiedSelectors: 1
		}
	}
];
