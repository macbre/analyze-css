/*global describe, it */
'use strict';

var analyzer = require('../'),
	assert = require('assert'),
	css = '.foo { color: white }';

describe('CommonJS module API', function() {
	describe('noOffenders option', function() {
		it('should be respected', function(done) {
			var opts = {
				'noOffenders': true
			};

			new analyzer(css, opts, function(err, res) {
				assert.strictEqual(err, null);
				assert.equal(typeof res.offenders, 'undefined', 'Results should no contain offenders');
				done();
			});
		});

		it('should be void if not provided', function(done) {
			new analyzer(css, function(err, res) {
				assert.strictEqual(err, null);
				assert.equal(typeof res.offenders, 'object', 'Results should contain offenders');
				done();
			});
		});
	});
});
