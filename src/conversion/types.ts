export type CategoryGroup =
  | "common"
  | "mechanical"
  | "fluids"
  | "thermal"
  | "electrical"
  | "dataTimeAngles"
  | "other";

export type UnitSystem =
  | "SI"
  | "Metric"
  | "USCustomary"
  | "Imperial"
  | "Engineering"
  | "Other";

export type ConversionKind =
  | "linear"
  | "affine"
  | "reciprocal"
  | "customFormula";

export type SourceId =
  | "NIST_SP_811"
  | "NIST_SP_330"
  | "BIPM_SI"
  | "CODATA"
  | "APP_DEFINED";

export type FormulaSpec = {
  multiplier?: string;
  offset?: string;
  expression?: string;
};

export type Unit = {
  id: string;
  name: string;
  symbol: string;
  aliases: string[];
  system: UnitSystem;
  kind: ConversionKind;
  toBase: FormulaSpec;
  fromBase?: FormulaSpec;
  source?: SourceId;
  exact?: boolean;
  legacy?: boolean;
  notes?: string;
};

export type Category = {
  id: string;
  name: string;
  group: CategoryGroup;
  baseUnitId: string;
  dimension: string;
  units: Unit[];
};

export type ConversionResult = {
  unit: Unit;
  value: string;
  error?: string;
};
