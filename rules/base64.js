var format = require('util').format,
	MAX_LENGTH = 4 * 1024;

function rule(analyzer) {
	// @see http://stackoverflow.com/a/11335500
	var re = /data:.+\/(.+);base64,(.*)\)/;
	analyzer.setMetric('base64Length');

	analyzer.on('declaration', function(rule, property, value) {
		var base64,
			buf,
			matches;

		if (re.test(value)) {
			// parse data URI
			matches = value.match(re);
			base64 = matches[2];
			buf = new Buffer(base64, 'base64');

			analyzer.incrMetric('base64Length', base64.length);

			if (base64.length > MAX_LENGTH) {
				analyzer.addOffender('base64Length', format('%s { %s: ... } // base64: %s kB, raw: %s kB', rule.selectors.join(', '), property, (base64.length/1024).toFixed(2), (buf.length/1024).toFixed(2)));
			}
		}
	});
}

rule.description = 'Reports on base64-encoded images';
module.exports = rule;
