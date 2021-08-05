/**
 * analyzer instance passed to the rules code
 *
 * See https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
 */

import { EventsNames, MetricsNames, Metrics, Offenders } from "./types";

declare class CSSAnalyzer {
  public setMetric(
    name: MetricsNames,
    value: number | undefined /** = 0 */
  ): void;
  public incrMetric(
    name: MetricsNames,
    incr: number | undefined /** = 1 */
  ): void;
  public addOffender(
    metricName: MetricsNames,
    msg: string,
    position: any | undefined
  ): void;
  public setCurrentPosition(position: any): void;

  // types based on the event
  public on(ev: EventsNames, fn: any): void;

  public on(ev: "comment", fn: (comment: string) => void): void;
  public on(ev: "css", fn: (css: string) => void): void;
  public on(
    ev: "declaration",
    fn: (rule: any, property: any, value: any) => void
  ): void;
  public on(ev: "error", fn: (err: any) => void): void;
  public on(
    ev: "expression",
    fn: (selector: any, expression: any) => void
  ): void;
  public on(ev: "font-face", fn: (rule: any) => void): void;
  public on(ev: "import", fn: (url: any) => void): void;
  public on(ev: "media", fn: (query: any) => void): void;
  public on(ev: "mediaEnd", fn: (query: any) => void): void;
  public on(ev: "report", fn: () => void): void;
  public on(ev: "rule", fn: (rule: any) => void): void;
  public on(
    ev: "selector",
    fn: (rule: any, selector: any, expressions: any) => void
  ): void;

  public analyze(css: string): boolean | Error;

  public metrics: Metrics;
  public offenders: Offenders;
}

export = CSSAnalyzer;
