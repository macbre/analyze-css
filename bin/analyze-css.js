#!/usr/bin/env node
/**
 * analyze-css entry point
 *
 * @see https://github.com/macbre/analyze-css
 */
'use strict';

var analyzer = require('./../lib/index'),
	debug = require('debug')('analyze-css:bin'),
	program = require('optimist'),
	runner = require('./../lib/runner'),
	cssString = '',
	argv = {},
	runnerOpts = {};

// parse options
program
	.usage('analyze-css --url <url> [options]')

	// mandatory
	.describe('url', 'Set URL of CSS to analyze').string('url')
	.describe('file', 'Set local CSS file to analyze').string('file')

	.describe('ignore-ssl-errors', 'Ignores SSL errors, such as expired or self-signed certificate errors').boolean('ignore-ssl-errors')
	.describe('pretty', 'Causes JSON with the results to be pretty-printed').boolean('pretty').alias('pretty', 'p')

	// version / help
	.describe('version', 'Show version number and quit').boolean('version').alias('version', 'V')
	.describe('help', 'This help text').boolean('help').alias('help', 'h');

// parse it
argv = program.parse(process.argv);

debug('analyze-css v%s', analyzer.version);
debug('argv: %j', argv);

// show version number
if (argv.version === true) {
	console.log('analyze-css v%s', analyzer.version);
	process.exit(0);
}

// show help
if (argv.help === true) {
	program.showHelp();
	process.exit(0);
}

// support stdin (issue #28)
if (argv._ && argv._.indexOf('-') > -1) {
	runnerOpts.stdin = true;
}
// --url
else if (typeof argv.url === 'string') {
	runnerOpts.url = argv.url;
}
// --file
else if (typeof argv.file === 'string') {
	runnerOpts.file = argv.file;
}
// either --url or --file or - (stdin) needs to be provided
else {
	program.showHelp();
	process.exit(255);
}

runnerOpts.ignoreSslErrors = argv['ignore-ssl-errors'];

debug('opts: %j', runnerOpts);

// run the analyzer
runner(runnerOpts, function(err, res) {
	var output;

	// emit an error and die
	if (err) {
		console.error(err.toString());
		process.exit(255);
	}

	// format the results
	if (argv.pretty === true) {
		output = JSON.stringify(res, null, '  ');
	}
	else {
		output = JSON.stringify(res);
	}

	console.log(output);

	// done
	process.exit(0);
});
