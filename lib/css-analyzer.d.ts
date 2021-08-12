/**
 * analyzer instance passed to the rules code
 *
 * See https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
 */

import { StyleRules, Stylesheet, Position } from "css";
import { Selector } from "css-what";
import {
  EventsNames,
  MetricsNames,
  Metrics,
  Offenders,
  CSSRule,
} from "./types";

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
    position: Position | undefined
  ): void;
  public setCurrentPosition(position: Position): void;

  // types based on the event
  public on(ev: EventsNames, fn: any): void;

  public on(ev: "comment", fn: (comment: string) => void): void;
  public on(ev: "css", fn: (css: string) => void): void;
  public on(
    ev: "declaration",
    fn: (rule: CSSRule, property: string, value: string) => void
  ): void;
  public on(ev: "error", fn: (err: Error) => void): void;
  public on(
    ev: "expression",
    fn: (selector: string, expression: Selector) => void
  ): void;
  public on(ev: "font-face", fn: (rule: CSSRule) => void): void;
  public on(ev: "import", fn: (url: string) => void): void;
  public on(
    ev: "media",
    fn: (query: string, rules: Array<CSSRule>) => void
  ): void;
  public on(
    ev: "mediaEnd",
    fn: (query: string, rules: Array<CSSRule>) => void
  ): void;
  public on(ev: "report", fn: () => void): void;
  public on(ev: "rule", fn: (rule: CSSRule) => void): void;
  public on(
    ev: "selector",
    fn: (rule: CSSRule, selector: string, expressions: Selector[]) => void
  ): void;
  public on(ev: "stylesheet", fn: (stylesheet: StyleRules) => void): void;

  public analyze(css: string): boolean | Error;
  public parseRules(rules: Array<CSSRule>): void;

  public metrics: Metrics;
  public offenders: Offenders;

  public tree: Stylesheet;
}

export = CSSAnalyzer;
