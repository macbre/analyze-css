const { describe, it } = require("@jest/globals");

var analyzer = require('../').analyze,
	assert = require('assert'),
	css = '.foo { color: white }';

describe('CommonJS module API', () => {
	describe('noOffenders option', () => {
		it('should be respected', async () => {
			var opts = {
				'noOffenders': true
			};

			const res = await analyzer(css, opts);
			assert.strictEqual(typeof res.offenders, 'undefined', 'Results should no contain offenders');
		});

		it('should be void if not provided', async () => {
			const res = await analyzer(css);
			assert.strictEqual(typeof res.offenders, 'object', 'Results should contain offenders');
		});
	});
});
