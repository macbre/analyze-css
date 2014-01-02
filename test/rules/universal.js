exports.tests = [
	{
		css: '* html .ui-autocomplete {}',
		metrics: {
			universalSelectors: 0
		}
	},
	{
		css: 'input[type="..."] {}',
		metrics: {
			universalSelectors: 0
		}
	},
	{
		css: '.foo[type="..."] {}',
		metrics: {
			universalSelectors: 0
		}
	},
	{
		css: '#id[type="..."] {}',
		metrics: {
			universalSelectors: 0
		}
	},
	{
		css: '[type="..."] {}',
		metrics: {
			universalSelectors: 1
		}
	},
	{
		css: 'ul :hover {}',
		metrics: {
			universalSelectors: 1
		}
	},
	{
		css: '.foo > * {}',
		metrics: {
			universalSelectors: 1
		}
	},
	{
		css: 'table.wikitable>*>tr>th {}',
		metrics: {
			universalSelectors: 1
		}
	},
	{
		css: '.foo * li {}',
		metrics: {
			universalSelectors: 1
		}
	},
	{
		css: '* {}',
		metrics: {
			universalSelectors: 1
		}
	},
	{
		css: '@media screen { * {} }',
		metrics: {
			universalSelectors: 1
		}
	}
];
