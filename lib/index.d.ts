/**
 * This file brings type hinting for index.js file.
 *
 * While this package is not written in TypeScript, this file will allow your IDE to provide you with auto-completion.
 */

declare type MetricsNames =
  | "base64Length"
  | "colors"
  | "comments"
  | "commentsLength"
  | "complexSelectors"
  | "declarations"
  | "duplicatedProperties"
  | "duplicatedSelectors"
  | "emptyRules"
  | "expressions"
  | "importants"
  | "imports"
  | "length"
  | "mediaQueries"
  | "multiClassesSelectors"
  | "notMinified"
  | "oldIEFixes"
  | "oldPropertyPrefixes"
  | "parsingErrors"
  | "propertyResets"
  | "qualifiedSelectors"
  | "redundantBodySelectors"
  | "redundantChildNodesSelectors"
  | "rules"
  | "selectorLengthAvg"
  | "selectors"
  | "selectorsByAttribute"
  | "selectorsByClass"
  | "selectorsById"
  | "selectorsByPseudo"
  | "selectorsByTag"
  | "specificityClassAvg"
  | "specificityClassTotal"
  | "specificityIdAvg"
  | "specificityIdTotal"
  | "specificityTagAvg"
  | "specificityTagTotal";

/**
 * Encapsulates a set of metrics
 */
declare type Metrics = { [metric in MetricsNames]: number };

/**
 * Encapsulates a set of offenders
 */
declare type Offenders = { [metric in MetricsNames]: Array<Object> };

/**
 * Encapsulates results from analyze()
 */
declare interface Results {
  generator: string;
  metrics: Metrics;
  offenders: Offenders;
}

/**
 * analyzer instance passed to the rules code
 *
 * @see https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
 */
export interface CSSAnalyzer {
  public setMetric(name: MetricsNames, value: ?number = 0): void;
  public incrMetric(name: MetricsNames, incr: ?number = 1): void;
  public addOffender(
    metricName: MetricsNames,
    msg: string,
    position: ?any
  ): void;
  public setCurrentPosition(position: any): void;
  public on(ev: string, fn: Function<?any>): void;
}

/**
 * The main entry-point to analyze a given css
 */
declare function analyze(css: string, options?: object): Promise<Results>;

export = analyze;
