exports.tests = [
	{
		css: '.foo body > h2 {}',
		metrics: {
			redundantBodySelectors: 1
		}
	},
	{
		css: 'body ul li a {}',
		metrics: {
			redundantBodySelectors: 1
		}
	},
	{
		css: 'body#foo ul li a {}',
		metrics: {
			redundantBodySelectors: 1
		}
	},
	{
		css: 'body > h1 {}',
		metrics: {
			redundantBodySelectors: 0
		}
	},
	{
		css: 'body > h1 .foo {}',
		metrics: {
			redundantBodySelectors: 0
		}
	},
	{
		css: 'html > body #foo .bar {}',
		metrics: {
			redundantBodySelectors: 0
		}
	},
	{
		css: 'body {}',
		metrics: {
			redundantBodySelectors: 0
		}
	},
	{
		css: 'body.mainpage {}',
		metrics: {
			redundantBodySelectors: 0
		}
	},
	{
		css: 'body.foo ul li a {}',
		metrics: {
			redundantBodySelectors: 0
		}
	},
	{
		css: 'html.modal-popup-mode body {}',
		metrics: {
			redundantBodySelectors: 0
		}
	},
	{
		css: '.has-modal > body {}',
		metrics: {
			redundantBodySelectors: 0
		}
	},
	{
		css: '.has-modal > body p {}',
		metrics: {
			redundantBodySelectors: 0
		}
	}

];
