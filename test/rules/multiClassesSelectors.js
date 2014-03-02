exports.tests = [
	{
		css: '.test, .foo, #bar, header {}',
		metrics: {
			multiClassesSelectors: 0
		}
	},
	{
		css: 'header#nav.test {}',
		metrics: {
			multiClassesSelectors: 0
		}
	},
	{
		css: '.foo.test#bar {}',
		metrics: {
			multiClassesSelectors: 1
		}
	},
	{
		css: 'h1.title.big, a {}',
		metrics: {
			multiClassesSelectors: 1
		}
	}
];
