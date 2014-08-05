exports.tests = [
	{
		css: '.import { color: red !important }',
		metrics: {
			imports: 0
		}
	},
	{
		css: '@import url(\'/css/styles.css\');\n.import { color: red !important }',
		metrics: {
			imports: 1
		}
	},
	{
		css: '@import url(/css/styles.css);\n.import { color: red !important }',
		metrics: {
			imports: 1
		}
	}
];
