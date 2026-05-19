import Decimal from "decimal.js";

export type Notation = "normal" | "scientific" | "engineering" | "auto";

export type FormatOptions = {
  sigFigs?: number;
  notation?: Notation;
  decimalSeparator?: string;
  groupThousands?: boolean;
};

const DEFAULT_SIG_FIGS = 6;
const AUTO_SWITCH_THRESHOLD_LARGE = new Decimal("1e10");
const AUTO_SWITCH_THRESHOLD_SMALL = new Decimal("1e-4");

export function formatValue(
  value: Decimal,
  options: FormatOptions = {}
): string {
  const {
    sigFigs = DEFAULT_SIG_FIGS,
    notation = "auto",
    decimalSeparator = ".",
    groupThousands = false,
  } = options;

  if (!value.isFinite()) return value.isNaN() ? "NaN" : value.isNegative() ? "-∞" : "∞";

  const abs = value.abs();
  const effectiveNotation = resolveNotation(abs, notation);

  let formatted: string;

  switch (effectiveNotation) {
    case "scientific":
      formatted = toScientific(value, sigFigs);
      break;
    case "engineering":
      formatted = toEngineering(value, sigFigs);
      break;
    default:
      formatted = toNormal(value, sigFigs);
  }

  if (decimalSeparator !== ".") {
    formatted = formatted.replace(".", decimalSeparator);
  }

  if (groupThousands) {
    formatted = applyGrouping(formatted, decimalSeparator);
  }

  return formatted;
}

function resolveNotation(abs: Decimal, notation: Notation): "normal" | "scientific" | "engineering" {
  if (notation === "auto") {
    if (!abs.isZero() && (abs.gte(AUTO_SWITCH_THRESHOLD_LARGE) || abs.lt(AUTO_SWITCH_THRESHOLD_SMALL))) {
      return "engineering";
    }
    return "normal";
  }
  return notation;
}

function toNormal(value: Decimal, sigFigs: number): string {
  if (value.isZero()) return "0";

  const rounded = value.toSignificantDigits(sigFigs);
  let str = rounded.toFixed();

  str = trimTrailingZeros(str);
  return str;
}

function toScientific(value: Decimal, sigFigs: number): string {
  if (value.isZero()) return "0";

  const exp = value.e;
  const mantissa = value.div(Decimal.pow(10, exp)).toSignificantDigits(sigFigs);
  const mantissaStr = trimTrailingZeros(mantissa.toFixed());
  return `${mantissaStr}e${exp >= 0 ? "+" : ""}${exp}`;
}

function toEngineering(value: Decimal, sigFigs: number): string {
  if (value.isZero()) return "0";

  const negative = value.isNegative();
  const abs = value.abs();

  const log10 = abs.log(10);
  const floorLog = log10.floor().toNumber();
  const engExp = Math.floor(floorLog / 3) * 3;

  const mantissa = abs.div(Decimal.pow(10, engExp)).toSignificantDigits(sigFigs);
  const mantissaStr = trimTrailingZeros(mantissa.toFixed());

  const sign = negative ? "-" : "";
  if (engExp === 0) return `${sign}${mantissaStr}`;
  return `${sign}${mantissaStr}e${engExp >= 0 ? "+" : ""}${engExp}`;
}

export function formatFraction(value: Decimal, denominator: number): string {
  if (!value.isFinite()) return value.isNaN() ? "NaN" : value.isNegative() ? "-∞" : "∞";
  if (value.isZero()) return "0";

  const negative = value.isNegative();
  const abs = value.abs();
  const whole = abs.floor();
  const frac = abs.minus(whole);

  const rawNum = frac.times(denominator).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();
  const num = Math.min(rawNum, denominator);

  if (num === 0) return sign(negative, whole.toFixed());
  if (num === denominator) return sign(negative, whole.plus(1).toFixed());

  const g = gcd(num, denominator);
  const fracStr = `${num / g}/${denominator / g}`;

  return sign(negative, whole.isZero() ? fracStr : `${whole.toFixed()} ${fracStr}`);
}

function sign(negative: boolean, s: string): string {
  return negative ? `-${s}` : s;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function trimTrailingZeros(str: string): string {
  if (!str.includes(".")) return str;
  return str.replace(/\.?0+$/, "");
}

function applyGrouping(formatted: string, decimalSep: string): string {
  const parts = formatted.split(decimalSep);
  const intPart = parts[0];
  const decPart = parts[1];

  const sign = intPart.startsWith("-") ? "-" : "";
  const digits = intPart.replace(/^-/, "");
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decPart !== undefined
    ? `${sign}${grouped}${decimalSep}${decPart}`
    : `${sign}${grouped}`;
}
