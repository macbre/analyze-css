exports.tests = [
	{
		css: '.foo body > h2 {}',
		metrics: {
			redundantChildNodesSelectors: 0
		}
	},
	// ul li
	{
		css: 'ul li a {}',
		metrics: {
			redundantChildNodesSelectors: 1
		}
	},
	{
		css: 'ul > li a {}',
		metrics: {
			redundantChildNodesSelectors: 1
		}
	},
	{
		css: 'ul + li a {}',
		metrics: {
			redundantChildNodesSelectors: 0
		}
	},
	{
		css: 'ul a {}',
		metrics: {
			redundantChildNodesSelectors: 0
		}
	},
	{
		css: '.box ul {}',
		metrics: {
			redundantChildNodesSelectors: 0
		}
	},
	{
		css: 'li a {}',
		metrics: {
			redundantChildNodesSelectors: 0
		}
	},
	{
		css: 'article > ul li {}',
		metrics: {
			redundantChildNodesSelectors: 0
		}
	},
	// table tr
	{
		css: '.foo table.test tr.row {}',
		metrics: {
			redundantChildNodesSelectors: 1
		}
	},
	{
		css: '.foo table th {}',
		metrics: {
			redundantChildNodesSelectors: 1
		}
	},
	{
		css: '.foo table td {}',
		metrics: {
			redundantChildNodesSelectors: 0
		}
	},
	{
		css: 'table[class*="infobox"] tr {}',
		metrics: {
			redundantChildNodesSelectors: 0
		}
	},
	{
		css: 'table[class*="infobox"] tr p {}',
		metrics: {
			redundantChildNodesSelectors: 0
		}
	},
	{
		css: 'ol:lang(or) li {}',
		metrics: {
			redundantChildNodesSelectors: 0
		}
	},
	// select option
	{
		css: '.form select option {}',
		metrics: {
			redundantChildNodesSelectors: 1
		}
	},
	// tr + td
	{
		css: '.foo tr td {}',
		metrics: {
			redundantChildNodesSelectors: 1
		}
	},
	{
		css: '.foo tr th {}',
		metrics: {
			redundantChildNodesSelectors: 1
		}
	},
	// table + tr & tr + td
	{
		css: 'table.recommended tr td {}',
		metrics: {
			redundantChildNodesSelectors: 2
		}
	},
	{
		css: 'table.tableborder tr.first td {}',
		metrics: {
			redundantChildNodesSelectors: 2
		}
	},
	{
		css: 'table tr th.first {}',
		metrics: {
			redundantChildNodesSelectors: 2
		}
	},
];
