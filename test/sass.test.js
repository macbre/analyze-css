const { describe, it } = require("@jest/globals");

var analyzer = require('../'),
	fs = require('fs'),
	isSassInstalled = true,
	assert = require('assert'),
	scss = 'nav {\nul{ color: white }\n}',
	sass = 'nav\n\tul\n\t\tcolor: white\n',
	nodeSassInfo;

try {
	nodeSassInfo  = require('sass').info;
	console.log(`Using ${nodeSassInfo.replace(/[\n\t]/g, " ")}`);
} catch (e) {
	isSassInstalled = false;
}

describe('SASS preprocessor [' + (isSassInstalled ? 'sass installed' : 'sass missing') + ']', () => {
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

	it('should parse SCSS file correctly', done => {
		const file = __dirname + '/../examples/base.scss',
			source = fs.readFileSync(file).toString();

		new analyzer(source, {
			file: file,
			preprocessor: 'sass'
		}, done);
	});

	it('should report parsing error when provided an incorrect syntax', done => {
		try {
			new analyzer("bar {foo--}", {
				preprocessor: 'sass'
			}, done);
		 }
		 catch (err) {
			assert.ok(err instanceof Error);
			assert.ok(err.message.indexOf("Preprocessing failed:") === 0);
			done();
		}
	});

});
