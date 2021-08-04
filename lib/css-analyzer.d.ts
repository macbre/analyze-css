/**
 * analyzer instance passed to the rules code
 *
 * See https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
 */

import { MetricsNames, Metrics, Offenders } from "./helpers.d";

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
  public on(ev: string, fn: any): void;
  public analyze(css: string): boolean | Error;

  public metrics: Metrics;
  public offenders: Offenders;
}

export = CSSAnalyzer;
