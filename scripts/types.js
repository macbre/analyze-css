#!/usr/bin/env node
const CSSAnalyzer = require("../lib/css-analyzer");

(async () => {
  const css = ".foo {margin: 0 !important}";

  const instance = new CSSAnalyzer({});
  instance.analyze(css);

  console.log("// Typing for metrics and events names.");

  // list of all available metrics
  console.log(
    "export type MetricsNames = " +
      Object.keys(instance.metrics)
        .sort()
        .map((metric) => {
          return `"${metric}"`;
        })
        .join(" |\n\t") +
      ";"
  );

  // list of all available events
  // https://nodejs.org/api/events.html#events_class_eventemitter
  const eventsEmitter = instance.emitter;

  console.log(
    "export type EventsNames = " +
      eventsEmitter
        .eventNames()
        .sort()
        .map((event) => {
          const listeners = eventsEmitter.listeners(event);
          const sourceCode = listeners[0].toString();
          const signature = sourceCode
            .split("\n")[0]
            .toString()
            .replace(/function\s?| {/g, "");

          return `"${event}" /* ${signature} */`;
        })
        .join(" |\n\t") +
      ";"
  );
})();
