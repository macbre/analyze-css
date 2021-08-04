const { describe, it } = require("@jest/globals");

var analyzer = require('../').analyze,
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

	it('should report parsing error (if not selected)', async () => {
		const res = await analyzer(scss);

		assert.strictEqual(res.metrics.parsingErrors, 3);
	});

	if (isSassInstalled === false) {
		return;
	}

	it('should generate CSS from SCSS correctly', async () => {
		try {
			await analyzer(scss, {
				preprocessor: 'sass'
			});
		} catch (e) {
			assert.ok(e instanceof Error);
			assert.strictEqual(e.message, 'Preprocessing failed: Error: Can\'t process SASS/SCSS, please run \'npm install node-sass\'');
		}
	});

	it('should generate CSS from SASS correctly', async () => {
		try {
			await analyzer(sass, {
				preprocessor: 'sass'
			});
		} catch (e) {
			assert.ok(e instanceof Error);
			assert.strictEqual(e.message, 'Preprocessing failed: Error: Can\'t process SASS/SCSS, please run \'npm install node-sass\'');
		}
	});

	it('should parse SCSS file correctly', async () => {
		const file = __dirname + '/../examples/base.scss',
			source = fs.readFileSync(file).toString();

		await analyzer(source, {
			file: file,
			preprocessor: 'sass'
		});
	});

	it('should report parsing error when provided an incorrect syntax', async () => {
		try {
			await analyzer("bar {foo--}", {
				preprocessor: 'sass'
			});
		 }
		 catch (err) {
			assert.ok(err instanceof Error);
			assert.ok(err.message.indexOf("Preprocessing failed:") === 0);
		}
	});

});
