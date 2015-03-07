/*global describe, it */
'use strict';

var analyzer = require('../'),
	assert = require('assert'),
	scss = 'nav {\nul{ color: white }\n}',
	sass = 'nav\n\tul\n\t\tcolor: white\n';

describe('SASS preprocessor', function() {
	it('should be chosen for SCSS files', function() {
		var preprocessors = new(require('../lib/preprocessors.js'))();

		assert.equal(preprocessors.findMatchingByFileName('test/foo.scss'), 'sass');
		assert.equal(preprocessors.findMatchingByFileName('test/foo.sass'), 'sass');
		assert.equal(preprocessors.findMatchingByFileName('test/foo.css'), false);
	});

	it('should report parsing error (if not selected)', function(done) {
		new analyzer(scss, function(err, res) {
			assert.strictEqual(err, null);
			assert.equal(res.metrics.parsingErrors, 3);
			done();
		});
	});

	it('should generate CSS from SCSS correctly', function(done) {
		new analyzer(scss, {
			preprocessor: 'sass'
		}, function(err, res) {
			assert.strictEqual(err, null);
			assert.equal(res.metrics.selectors, 1);
			done();
		});
	});

	it('should generate CSS from SASS correctly', function(done) {
		new analyzer(sass, {
			preprocessor: 'sass'
		}, function(err, res) {
			assert.strictEqual(err, null);
			assert.equal(res.metrics.selectors, 1);
			done();
		});
	});
});
