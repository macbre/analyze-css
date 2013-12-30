exports.tests = [
	{
		css: '#foo {}',
		metrics: {
			specificityIdAvg: 1,
			specificityIdTotal: 1
		}
	},
	{
		css: '.foo {}',
		metrics: {
			specificityClassAvg: 1,
			specificityClassTotal: 1
		}
	},
	{
		css: 'a {}',
		metrics: {
			specificityTagAvg: 1,
			specificityTagTotal: 1
		}
	},
	{
		css: '.search-result figure.image:hover > .price {}',
		metrics: {
			specificityIdAvg: 0,
			specificityIdTotal: 0,
			specificityClassAvg: 4,
			specificityClassTotal: 4,
			specificityTagAvg: 1,
			specificityTagTotal: 1
		}
	},
	{
		css: '.search-result figure.image:hover > .price {} #slideshow > form input[type="text"] {}',
		metrics: {
			specificityIdAvg: 0.5,
			specificityIdTotal: 1,
			specificityClassAvg: 2.5,
			specificityClassTotal: 5,
			specificityTagAvg: 1.5,
			specificityTagTotal: 3
		}
	}
];
