/*global describe, it */
'use strict';

var analyzer = require('../'),
	isSassInstalled = true,
	assert = require('assert'),
	scss = 'nav {\nul{ color: white }\n}',
	sass = 'nav\n\tul\n\t\tcolor: white\n';

try {
	require('node-sass');
} catch (e) {
	isSassInstalled = false;
}

/**
 * TODO: install and test node-sass
 */
function testSassInstalled(done) {
	new analyzer(sass, {
		preprocessor: 'sass'
	}, function(err, res) {
		assert.strictEqual(err, null);
		assert.equal(res.metrics.selectors, 1);
		done();
	});
}

/**
 * node-sass is not installed by default (see #118)
 */
function testSassNotInstalled(done) {
	try {
		new analyzer(scss, {
			preprocessor: 'sass'
		}, function(err, res) {});
	} catch (e) {
		assert.ok(e instanceof Error);
		assert.equal(e.message, 'Preprocessing failed: Error: Can\'t process SASS/SCSS, please run \'npm install node-sass\'');
		done();
	}
}

describe('SASS preprocessor [' + (isSassInstalled ? 'node-sass installed' : 'node-sass missing') + ']', function() {
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

	it('should generate CSS from SCSS correctly', !isSassInstalled ? testSassNotInstalled : testSassInstalled);

	it('should generate CSS from SASS correctly', !isSassInstalled ? testSassNotInstalled : testSassInstalled);
});
