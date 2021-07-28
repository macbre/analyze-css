#!/usr/bin/env node

/**
 * analyze-css entry point
 *
 * @see https://github.com/macbre/analyze-css
 */
"use strict";

const { program } = require("commander");

var analyzer = require("./../lib/index"),
  debug = require("debug")("analyze-css:bin"),
  runner = require("./../lib/runner"),
  runnerOpts = {};

// parse options
program
  .version(analyzer.version)
  .usage("--url <url> [options]")
  // https://www.npmjs.com/package/commander#common-option-types-boolean-and-value
  .option("--url <url>", "Set URL of CSS to analyze")
  .option("--file <file>", "Set local CSS file to analyze")
  .option(
    "--ignore-ssl-errors",
    "Ignores SSL errors, such as expired or self-signed certificate errors"
  )
  .option("-p, --pretty", "Causes JSON with the results to be pretty-printed")
  .option(
    "-N, --no-offenders",
    "Show only the metrics without the offenders part"
  )
  .option(
    "--auth-user <user>",
    "Sets the user name used for HTTP authentication"
  )
  .option(
    "--auth-pass <pass>",
    "Sets the password used for HTTP authentication"
  )
  .option("-x, --proxy <proxy>", "Sets the HTTP proxy");

// parse it
program.parse(process.argv);
const options = program.opts();

debug("analyze-css v%s", analyzer.version);
debug("argv %j", process.argv);
debug("opts %j", options);

// support stdin (issue #28)
if (process.argv.indexOf("-") > -1) {
  runnerOpts.stdin = true;
}
// --url
else if (options.url) {
  runnerOpts.url = options.url;
}
// --file
else if (options.file) {
  runnerOpts.file = options.file;
}
// either --url or --file or - (stdin) needs to be provided
else {
  console.log(program.helpInformation());
  process.exitCode = analyzer.EXIT_NEED_OPTIONS;
  return;
}

runnerOpts.ignoreSslErrors = options.ignoreSslErrors === true;
runnerOpts.noOffenders = program.offenders === false;
runnerOpts.authUser = program["auth-user"];
runnerOpts.authPass = program["auth-pass"];
runnerOpts.proxy = program.proxy;

debug("runner opts: %j", runnerOpts);

// run the analyzer
runner(runnerOpts, function (err, res) {
  var output, exitCode;

  // emit an error and die
  if (err) {
    exitCode = err.code || 1;
    debug("Exiting with exit code #%d", exitCode);

    console.error(err.toString());
    process.exitCode = exitCode;
    return;
  }

  // make offenders flat (and append position if possible - issue #25)
  if (typeof res.offenders !== "undefined") {
    Object.keys(res.offenders).forEach(function (metricName) {
      res.offenders[metricName] = res.offenders[metricName].map(function (
        offender
      ) {
        var position = offender.position && offender.position.start;
        return (
          offender.message +
          (position ? " @ " + position.line + ":" + position.column : "")
        );
      });
    });
  }

  // format the results
  if (options.pretty === true) {
    output = JSON.stringify(res, null, "  ");
  } else {
    output = JSON.stringify(res);
  }

  process.stdout.write(output);
});
