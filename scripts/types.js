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
      ";",
  );

  // list of all available events
  // https://nodejs.org/api/events.html#events_class_eventemitter
  const eventsEmitter = instance.emitter;
  const events = eventsEmitter.eventNames().sort();

  console.log(
    "export type EventsNames = " +
      events
        .map((event) => {
          return `"${event}"`;
        })
        .join(" |\n\t") +
      ";",
  );

  console.log("// on() overloaded methods via event-specific callbacks");
  console.log(
    events
      .map((event) => {
        const listeners = eventsEmitter.listeners(event);
        const sourceCode = listeners[0].toString();
        const signature = sourceCode
          .split("\n")[0]
          .toString()
          .replace(/function\s?| {/g, "")
          .replace(/, /g, ": any, ")
          .replace(/([a-z])\)/, "$1: any)");

        return `public on(ev: "${event}", fn: ${signature} => void): void;`;
      })
      .join("\n"),
  );
})();
