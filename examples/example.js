#!/usr/bin/env node
const analyze = require('../');

(async() => {
  const results = await analyze('.foo {margin: 0 !important}');

  console.log(results.generator);
  console.dir(results.metrics);
  console.dir(results.metrics.length); // please note that this metric is well typed

  console.dir(results.offenders);
  console.dir(results.offenders.importants); // and this one is too
})();
