exports.tests = [
	{
		css: '#foo {}',
		metrics: {
			mediaQueries: 0
		}
	},
	{
		css: '@media screen { * {} }',
		metrics: {
			mediaQueries: 1
		}
	},
	{
		css: '@media screen { * {} } @media print { * {} }',
		metrics: {
			mediaQueries: 2
		}
	},
	{
		css: '@media screen { @media screen { * {}  } }',
		metrics: {
			mediaQueries: 2
		}
	}
];
