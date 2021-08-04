#!/usr/bin/env node
const analyze = require('..');

(async() => {
  const results = await analyze('.foo {margin: 0 !important}');
  console.log(results); // example? see below
})();
