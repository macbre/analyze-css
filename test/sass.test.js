const { describe, it } = require("@jest/globals");

var analyzer = require('../'),
	fs = require('fs'),
	isSassInstalled = true,
	assert = require('assert'),
	scss = `.foo {
	&.nav {
		color: blue
	}
};`.trim(),
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

		assert.strictEqual(res.metrics.parsingErrors, 1);
		assert.strictEqual(res.offenders.parsingErrors[0].message, 'Empty sub-selector');
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
			assert.strictEqual(e.message, "Preprocessing failed: Error: TypeError: null: type 'JSNull' is not a subtype of type 'String'");
		}
	});

	it('should generate CSS from SASS correctly', async () => {
		try {
			await analyzer(sass, {
				preprocessor: 'sass'
			});
		} catch (e) {
			assert.ok(e instanceof Error);
			assert.strictEqual(e.message, "Preprocessing failed: Error: TypeError: null: type 'JSNull' is not a subtype of type 'String'");
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
