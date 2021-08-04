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
export type Metrics = { [metric in MetricsNames]: number };

/**
 * Encapsulates a set of offenders
 */
export type Offenders = { [metric in MetricsNames]: Array<Object> };
