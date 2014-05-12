exports.tests = [
	{
		css: 'header ul li .foo { color: red }',
		metrics: {
			complexSelectors: 1
		}
	},
	{
		css: 'input[class$="span"] {}',
		metrics: {
			complexSelectorsByAttribute: 1
		}
	},
	{
		css: '[class*="span"] {}',
		metrics: {
			complexSelectorsByAttribute: 1
		}
	},
	{
		css: '[class="span"] {}',
		metrics: {
			complexSelectorsByAttribute: 0
		}
	}
];
