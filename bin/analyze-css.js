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
	.describe('no-offenders', 'Show only the metrics without the offenders part').boolean('no-offenders').alias('no-offenders', 'N')
	.describe('auth-user', 'Sets the user name used for HTTP authentication').string('auth-user')
	.describe('auth-pass', 'Sets the password used for HTTP authentication').string('auth-pass')
	.describe('proxy', 'Sets the HTTP proxy').string('proxy').alias('proxy', 'x')
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
else if (argv.url) {
	runnerOpts.url = argv.url;
}
// --file
else if (argv.file) {
	runnerOpts.file = argv.file;
}
// either --url or --file or - (stdin) needs to be provided
else {
	program.showHelp();
	process.exit(analyzer.EXIT_NEED_OPTIONS);
}

runnerOpts.ignoreSslErrors = argv['ignore-ssl-errors'];
runnerOpts.noOffenders = argv['no-offenders'] || (argv.offenders === false);
runnerOpts.authUser = argv['auth-user'];
runnerOpts.authPass = argv['auth-pass'];
runnerOpts.proxy = argv.proxy;

debug('opts: %j', runnerOpts);

// run the analyzer
runner(runnerOpts, function(err, res) {
	var output, exitCode;

	// emit an error and die
	if (err) {
		exitCode = err.code || 1;
		debug('Exiting with exit code #%d', exitCode);

		console.error(err.toString());
		process.exit(exitCode);
	}

	// make offenders flat (and append position if possible - issue #25)
	if (typeof res.offenders !== 'undefined') {
		Object.keys(res.offenders).forEach(function(metricName) {
			res.offenders[metricName] = res.offenders[metricName].map(function(offender) {
				var position = offender.position && offender.position.start;
				return offender.message + (position ? ' @ ' + position.line + ':' + position.column : '');
			});
		});
	}

	// format the results
	if (argv.pretty === true) {
		output = JSON.stringify(res, null, '  ');
	} else {
		output = JSON.stringify(res);
	}

	process.stdout.write(output);
});
