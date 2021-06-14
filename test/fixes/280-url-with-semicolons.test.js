const { describe, it } = require("@jest/globals");
const assert = require('assert');

describe('@import rule with url containing semicolon', () => {
	it('is properly parsed', () => {
        const analyzer = require('../..'),
            css = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');

body {

}
            `.trim();

        new analyzer(css, (err, res) => {
            assert.ok(err === null, err);
        });
	});
});
