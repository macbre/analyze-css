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

describe('SASS preprocessor [' + (isSassInstalled ? 'node-sass installed' : 'node-sass missing') + ']', () => {
	it('should be chosen for SCSS files', () => {
		var preprocessors = new(require('../lib/preprocessors.js'))();

		assert.strictEqual(preprocessors.findMatchingByFileName('test/foo.scss'), 'sass');
		assert.strictEqual(preprocessors.findMatchingByFileName('test/foo.sass'), 'sass');
		assert.strictEqual(preprocessors.findMatchingByFileName('test/foo.css'), false);
	});

	it('should report parsing error (if not selected)', done => {
		new analyzer(scss, function(err, res) {
			assert.strictEqual(err, null);
			assert.strictEqual(res.metrics.parsingErrors, 3);
			done();
		});
	});

	if (isSassInstalled === false) {
		return;
	}

	it('should generate CSS from SCSS correctly', done => {
		try {
			new analyzer(scss, {
				preprocessor: 'sass'
			}, done);
		} catch (e) {
			assert.ok(e instanceof Error);
			assert.strictEqual(e.message, 'Preprocessing failed: Error: Can\'t process SASS/SCSS, please run \'npm install node-sass\'');
			done();
		}
	});

	it('should generate CSS from SASS correctly', done => {
		try {
			new analyzer(sass, {
				preprocessor: 'sass'
			}, done);
		} catch (e) {
			assert.ok(e instanceof Error);
			assert.strictEqual(e.message, 'Preprocessing failed: Error: Can\'t process SASS/SCSS, please run \'npm install node-sass\'');
			done();
		}
	});
});
