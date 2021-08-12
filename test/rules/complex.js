exports.tests = [
	{
		css: 'header ul li .foo { color: red }',
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
