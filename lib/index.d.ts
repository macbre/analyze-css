/**
 * This file brings type hinting for index.js file.
 *
 * While this package is not written in TypeScript, this file will allow your IDE to provide you with auto-completion.
 */

import { Metrics, Offenders } from "./types";

/**
 * Encapsulates results from analyze()
 */
declare interface Results {
  generator: string;
  metrics: Metrics;
  offenders: Offenders;
}

/**
 * The main entry-point to analyze a given css
 */
declare function analyze(css: string, options?: object): Promise<Results>;

export = analyze;
