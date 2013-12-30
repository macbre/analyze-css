exports.tests = [
	{
		css: '.foo { background-image: url(data:image/gif;base64,R0lGODlhAQABAIABAAAAAP///yH5BAEAAAEALAAAAAABAAEAQAICTAEAOw%3D%3D) }', // blank 1x1 gif
		metrics: {
			base64Length: 64
		}
	}
];
