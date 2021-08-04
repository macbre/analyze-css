#!/usr/bin/env node
const analyze = require('../').analyze;

(async() => {
  const results = await analyze('.foo {margin: 0 !important}');

  console.log(results.generator);
  console.dir(results.metrics);
  console.dir(results.offenders);

  // list of all available metrics
  console.log(
      'All available metrics (for type hinting):\n',
      'type MetricsNames = ' +
      Object.keys(results.metrics)
        .sort()
        .map(metric => {
            return `"${metric}"`;
        })
        .join(' |\n\t') + ';'
  )
})();
