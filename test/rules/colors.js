exports.tests = [
	{
		css: '.foo { background-image: url(data:image/gif;base64,R0lGODlhAQABAIABAAAAAP///yH5BAEAAAEALAAAAAABAAEAQAICTAEAOw%3D%3D) }', // blank 1x1 gif
		metrics: {
			colors: 0
		}
	},
	{
		css: '.foo { border-color: #c6c3c0 #c6c3c0 transparent transparent; }',
		metrics: {
			colors: 1
		}
	},
	{
		css: '.foo { border-color: #FF8C00; /* foo */}',
		metrics: {
			colors: 1
		}
	},
	{
		css: '.foo {background-image: -moz-linear-gradient(top, rgba(240, 231, 223, 0) 50%, #f0e7df 100%);background-image: -webkit-gradient(linear, 0% 0%, 0% 100%, color-stop(50%, #f8f4f0), color-stop(100%, #f0e7df));}',
		metrics: {
			colors: 3
		}
	},
	// invalid colors
	{
		css: '.foo { border-color: #xyz; color: #00; background: #0000 }',
		metrics: {
			colors: 0
		}
	},
	// different colors notations should be "casted" to either hex or rgba
	{
		css: '.foo { border-color: #000 #000000 rgb(0,0,0) rgba(0,0,0,1) }',
		metrics: {
			colors: 1
		}
	},
];
