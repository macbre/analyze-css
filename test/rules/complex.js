exports.tests = [
	{
		css: 'header ul li { color: red }',
		metrics: {
			complexSelectors: 0
		}
	},
	{
		css: 'header > ul li { color: red }',
		metrics: {
			complexSelectors: 0
		}
	},
	{
		css: 'header ~ ul li { color: red }',
		metrics: {
			complexSelectors: 0
		}
	},
	{
		css: 'header + ul li { color: red }',
		metrics: {
			complexSelectors: 0
		}
	},
	{
		css: 'header || ul li { color: red }',
		metrics: {
			complexSelectors: 0
		}
	},
	{
		css: 'header & ul li { color: red }',
		metrics: {
			complexSelectors: 0
		}
	},
	{
		css: 'header ul li .foo { color: red }',
		metrics: {
			complexSelectors: 1
		}
	},
	{
		css: '#foo .bar ul li a { color: red }',
		metrics: {
			complexSelectors: 1
		}
	},
	{
		css: '.someclass:not([ng-show="gcdmShowSystemNotAvailableMessage()"]){display:none}',
		metrics: {
			complexSelectors: 0
		}
	}
];
