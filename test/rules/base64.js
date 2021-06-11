exports.tests = [
	{
		css: '.foo { background-image: url(data:image/gif;base64,R0lGODlhAQABAIABAAAAAP///yH5BAEAAAEALAAAAAABAAEAQAICTAEAOw%3D%3D) }', // blank 1x1 gif
		metrics: {
			base64Length: 64
		},
		css: '.foo { background-image: url(data:image/gif;base64,' + 'FFFFFF'.repeat(1024) + ') }', // to big base64-encoded asset
		metrics: {
			base64Length: 6144
		},
		offenders: {
			base64Length: [
				".foo { background-image: ... } // base64: 6.00 kB, raw: 4.50 kB"
			]
		}
	}
];
