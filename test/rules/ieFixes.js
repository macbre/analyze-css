exports.tests = [
	{
		css: '* html .foo { color: red } .bar { color: blue }',
		metrics: {
			oldIEFixes: 1
		}
	},
	{
		css: '.foo { *color: red; border: blue }',
		metrics: {
			oldIEFixes: 1
		}
	},
	{
		css: 'html>body #tres { color: red }',
		metrics: {
			oldIEFixes: 1
		}
	},
	{
		css: 'html > body #tres { color: red }',
		metrics: {
			oldIEFixes: 1
		}
	},
	{
		css: '.foo { filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=70)" }',
		metrics: {
			oldIEFixes: 1
		}
	},
	{
		css: '.foo { border: blue !ie }',
		metrics: {
			oldIEFixes: 1
		}
	}
];
