import Decimal from "decimal.js";
import type { Category, Unit, ConversionResult } from "./types";

Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_UP });

export function convertValue(
  input: Decimal,
  sourceUnit: Unit,
  targetUnit: Unit,
  category: Category
): Decimal {
  assertSameCategory(sourceUnit, targetUnit, category);
  const base = toBase(input, sourceUnit);
  return fromBase(base, targetUnit);
}

export function convertAll(
  input: Decimal,
  sourceUnit: Unit,
  category: Category
): ConversionResult[] {
  const base = toBase(input, sourceUnit);
  return category.units.map((unit) => {
    try {
      const value = fromBase(base, unit);
      return { unit, value: value.toFixed() };
    } catch (err) {
      return { unit, value: "", error: String(err) };
    }
  });
}

export function toBase(input: Decimal, unit: Unit): Decimal {
  if (unit.kind === "linear") {
    const m = new Decimal(unit.toBase.multiplier ?? "1");
    return input.mul(m);
  }

  if (unit.kind === "affine") {
    const m = new Decimal(unit.toBase.multiplier ?? "1");
    const b = new Decimal(unit.toBase.offset ?? "0");
    return input.mul(m).plus(b);
  }

  if (unit.kind === "reciprocal") {
    const m = new Decimal(unit.toBase.multiplier ?? "1");
    if (input.isZero()) throw new Error("Cannot convert zero with reciprocal unit");
    return m.div(input);
  }

  throw new Error(`Unsupported conversion kind: ${unit.kind}`);
}

export function fromBase(base: Decimal, unit: Unit): Decimal {
  if (unit.fromBase) {
    const m = new Decimal(unit.fromBase.multiplier ?? "1");
    const b = new Decimal(unit.fromBase.offset ?? "0");
    if (unit.kind === "affine") {
      return base.minus(b).div(m);
    }
    return base.mul(m).plus(b);
  }

  if (unit.kind === "linear") {
    const m = new Decimal(unit.toBase.multiplier ?? "1");
    return base.div(m);
  }

  if (unit.kind === "affine") {
    const m = new Decimal(unit.toBase.multiplier ?? "1");
    const b = new Decimal(unit.toBase.offset ?? "0");
    return base.minus(b).div(m);
  }

  if (unit.kind === "reciprocal") {
    const m = new Decimal(unit.toBase.multiplier ?? "1");
    if (base.isZero()) throw new Error("Cannot convert zero with reciprocal unit");
    return m.div(base);
  }

  throw new Error(`Unsupported conversion kind: ${unit.kind}`);
}

function assertSameCategory(a: Unit, b: Unit, category: Category): void {
  const ids = new Set(category.units.map((u) => u.id));
  if (!ids.has(a.id) || !ids.has(b.id)) {
    throw new Error(
      `Units "${a.id}" and "${b.id}" must both belong to category "${category.id}"`
    );
  }
}

export function findUnit(category: Category, id: string): Unit | undefined {
  return category.units.find((u) => u.id === id);
}

export function findUnitByAlias(
  category: Category,
  query: string
): Unit | undefined {
  const q = query.toLowerCase();
  return category.units.find(
    (u) =>
      u.id === q ||
      u.symbol.toLowerCase() === q ||
      u.aliases.some((a) => a.toLowerCase() === q)
  );
}
