exports.tests = [
	// @see https://css-tricks.com/accidental-css-resets/
	{
		css: '.foo { margin: 0; margin-top: 3px }',
		metrics: {
			propertyResets: 0
		}
	},
	{
		css: '.foo { margin-top: 3px; margin: 0 }',
		metrics: {
			propertyResets: 1
		}
	},
	{
		css: '.foo { color: red; margin-top: 3px; padding: 0; margin: 0 }',
		metrics: {
			propertyResets: 1
		}
	},
	{
		css: '.foo { color: red; font-family: Sans-Serif; margin-top: 3px; padding: 0; margin: 0; font: 16px Serif }',
		metrics: {
			propertyResets: 2
		}
	},
	// @see https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties
	{
		css: '.foo { background-color: red; background: url(images/bg.gif) no-repeat top right }',
		metrics: {
			propertyResets: 1
		}
	},
];
