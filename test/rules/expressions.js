exports.tests = [
	{
		css: '.expression { color: red; }',
		metrics: {
			expressions: 0
		}
	},
	{
		css: 'p { width: expression( document.body.clientWidth > 600 ? "600px" : "auto" ); }',
		metrics: {
			expressions: 1
		}
	},
	{
		css: 'body { background-color: expression( (new Date()).getHours()%2 ? "#B8D4FF" : "#F08A00" ); }',
		metrics: {
			expressions: 1
		}
	}
];
