/*global describe, it */
'use strict';

var analyzer = require('../'),
	assert = require('assert'),
	css = 'nav {\nul{ color: white }\n}';

describe('SASS preprocessor', function() {
	it('should be chosen for SCSS files', function() {
		var preprocessors = new (require('../lib/preprocessors.js'))();

		assert.equal(preprocessors.findMatchingByFileName('test/foo.scss'), 'sass');
		assert.equal(preprocessors.findMatchingByFileName('test/foo.sass'), false);
		assert.equal(preprocessors.findMatchingByFileName('test/foo.css'), false);
	});

	it('should raise an error (if not selected)', function(done) {
		new analyzer(css, function(err, res) {
			assert.equal(err && /CSS parsing failed/.test(err), true);
			done();
		});
	});

	it('should generate CSS correctly', function(done) {
		new analyzer(css, {preprocessor: 'sass'}, function(err, res) {
			assert.strictEqual(err, null);
			assert.equal(res.metrics.selectors, 1);
			done();
		});
	});
});
