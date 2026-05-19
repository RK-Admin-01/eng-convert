import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import { convertValue, toBase, fromBase } from "../conversion/engine";
import { lengthCategory } from "../conversion/categories/length";
import { areaCategory } from "../conversion/categories/area";
import { volumeCategory } from "../conversion/categories/volume";
import { massCategory } from "../conversion/categories/mass";
import { temperatureCategory } from "../conversion/categories/temperature";
import { temperatureIntervalCategory } from "../conversion/categories/temperatureInterval";
import { forceCategory } from "../conversion/categories/force";
import { pressureCategory } from "../conversion/categories/pressure";
import { torqueCategory } from "../conversion/categories/torque";
import { energyCategory } from "../conversion/categories/energy";
import { powerCategory } from "../conversion/categories/power";
import { flowCategory } from "../conversion/categories/flow";
import { ALL_CATEGORIES } from "../conversion/registry";
import type { Category, Unit } from "../conversion/types";

const TOLERANCE = new Decimal("1e-6");

function getUnit(category: Category, id: string): Unit {
  const u = category.units.find((u) => u.id === id);
  if (!u) throw new Error(`Unit "${id}" not found in category "${category.id}"`);
  return u;
}

function conv(value: number, fromId: string, toId: string, category: Category): Decimal {
  const src = getUnit(category, fromId);
  const tgt = getUnit(category, toId);
  return convertValue(new Decimal(value), src, tgt, category);
}

function expectClose(actual: Decimal, expected: number, tol = TOLERANCE): void {
  const diff = actual.minus(expected).abs();
  const relTol = new Decimal(expected).abs().mul(tol);
  const absTol = tol;
  const pass = diff.lte(relTol.gt(absTol) ? relTol : absTol);
  expect(pass, `Expected ${actual.toFixed()} ≈ ${expected} (diff=${diff.toFixed()})`).toBe(true);
}

// ─── Length ────────────────────────────────────────────────────────────────────

describe("Length", () => {
  it("1 in = 25.4 mm", () => {
    const r = conv(1, "inch", "millimeter", lengthCategory);
    expect(r.toFixed()).toBe("25.4");
  });

  it("1 ft = 0.3048 m", () => {
    const r = conv(1, "foot", "meter", lengthCategory);
    expect(r.toFixed()).toBe("0.3048");
  });

  it("1 yd = 0.9144 m", () => {
    const r = conv(1, "yard", "meter", lengthCategory);
    expect(r.toFixed()).toBe("0.9144");
  });

  it("1 mi = 1609.344 m", () => {
    const r = conv(1, "mile", "meter", lengthCategory);
    expect(r.toFixed()).toBe("1609.344");
  });

  it("1 nautical mile = 1852 m", () => {
    const r = conv(1, "nautical_mile", "meter", lengthCategory);
    expect(r.toFixed()).toBe("1852");
  });

  it("round-trip: m → km → m", () => {
    const start = new Decimal("123.456");
    const km = conv(123.456, "meter", "kilometer", lengthCategory);
    const back = convertValue(km, getUnit(lengthCategory, "kilometer"), getUnit(lengthCategory, "meter"), lengthCategory);
    expectClose(back, 123.456, new Decimal("1e-10"));
  });
});

// ─── Area ──────────────────────────────────────────────────────────────────────

describe("Area", () => {
  it("1 in² = 6.4516 cm²", () => {
    const r = conv(1, "square_inch", "square_centimeter", areaCategory);
    expect(r.toFixed()).toBe("6.4516");
  });

  it("1 ft² = 0.09290304 m²", () => {
    const r = conv(1, "square_foot", "square_meter", areaCategory);
    expect(r.toFixed()).toBe("0.09290304");
  });

  it("1 acre = 43560 ft²", () => {
    const r = conv(1, "acre", "square_foot", areaCategory);
    expectClose(r, 43560, new Decimal("1e-6"));
  });

  it("1 hectare = 10000 m²", () => {
    const r = conv(1, "hectare", "square_meter", areaCategory);
    expect(r.toFixed()).toBe("10000");
  });
});

// ─── Volume ────────────────────────────────────────────────────────────────────

describe("Volume", () => {
  it("1 US gal = 3.785412 L", () => {
    const r = conv(1, "us_gallon", "liter", volumeCategory);
    expectClose(r, 3.785412, new Decimal("1e-5"));
  });

  it("1 Imperial gal = 4.54609 L", () => {
    const r = conv(1, "imperial_gallon", "liter", volumeCategory);
    expectClose(r, 4.54609, new Decimal("1e-4"));
  });

  it("1 ft³ = 0.02831685 m³", () => {
    const r = conv(1, "cubic_foot", "cubic_meter", volumeCategory);
    expectClose(r, 0.02831685, new Decimal("1e-6"));
  });

  it("1 in³ = 16.387064 cm³", () => {
    const r = conv(1, "cubic_inch", "cubic_centimeter", volumeCategory);
    expectClose(r, 16.387064, new Decimal("1e-5"));
  });

  it("US gallon ≠ Imperial gallon", () => {
    const us = conv(1, "us_gallon", "liter", volumeCategory);
    const imp = conv(1, "imperial_gallon", "liter", volumeCategory);
    expect(us.equals(imp)).toBe(false);
  });
});

// ─── Mass ──────────────────────────────────────────────────────────────────────

describe("Mass", () => {
  it("1 lbm = 0.4535924 kg", () => {
    const r = conv(1, "pound_mass", "kilogram", massCategory);
    expectClose(r, 0.4535924, new Decimal("1e-6"));
  });

  it("1 oz = 1/16 lbm", () => {
    const r = conv(1, "ounce_mass", "pound_mass", massCategory);
    expectClose(r, 1 / 16, new Decimal("1e-10"));
  });

  it("1 short ton = 2000 lbm", () => {
    const r = conv(1, "short_ton", "pound_mass", massCategory);
    expectClose(r, 2000, new Decimal("1e-8"));
  });

  it("1 long ton = 2240 lbm", () => {
    const r = conv(1, "long_ton", "pound_mass", massCategory);
    expectClose(r, 2240, new Decimal("1e-8"));
  });

  it("1 metric tonne = 1000 kg", () => {
    const r = conv(1, "metric_tonne", "kilogram", massCategory);
    expect(r.toFixed()).toBe("1000");
  });
});

// ─── Temperature ───────────────────────────────────────────────────────────────

describe("Temperature", () => {
  it("32°F = 0°C", () => {
    const r = conv(32, "fahrenheit", "celsius", temperatureCategory);
    expectClose(r, 0, new Decimal("1e-10"));
  });

  it("212°F = 100°C", () => {
    const r = conv(212, "fahrenheit", "celsius", temperatureCategory);
    expectClose(r, 100, new Decimal("1e-8"));
  });

  it("0 K = -273.15°C", () => {
    const r = conv(0, "kelvin", "celsius", temperatureCategory);
    expectClose(r, -273.15, new Decimal("1e-10"));
  });

  it("0°C = 273.15 K", () => {
    const r = conv(0, "celsius", "kelvin", temperatureCategory);
    expect(r.toFixed()).toBe("273.15");
  });

  it("491.67°R ≈ 32°F", () => {
    const r = conv(491.67, "rankine", "fahrenheit", temperatureCategory);
    expectClose(r, 32, new Decimal("1e-4"));
  });

  it("round-trip F→C→F", () => {
    const f0 = 98.6;
    const c = conv(f0, "fahrenheit", "celsius", temperatureCategory);
    const back = convertValue(c, getUnit(temperatureCategory, "celsius"), getUnit(temperatureCategory, "fahrenheit"), temperatureCategory);
    expectClose(back, f0, new Decimal("1e-10"));
  });
});

// ─── Temperature Interval ──────────────────────────────────────────────────────

describe("Temperature Interval", () => {
  it("9°F interval = 5°C interval", () => {
    const r = conv(9, "fahrenheit_interval", "celsius_interval", temperatureIntervalCategory);
    expectClose(r, 5, new Decimal("1e-10"));
  });

  it("1 K interval = 1°C interval", () => {
    const r = conv(1, "kelvin_interval", "celsius_interval", temperatureIntervalCategory);
    expect(r.toFixed()).toBe("1");
  });

  it("1°R interval = 1°F interval", () => {
    const r = conv(1, "rankine_interval", "fahrenheit_interval", temperatureIntervalCategory);
    expect(r.toFixed()).toBe("1");
  });
});

// ─── Force ─────────────────────────────────────────────────────────────────────

describe("Force", () => {
  it("1 lbf = 4.448222 N", () => {
    const r = conv(1, "pound_force", "newton", forceCategory);
    expectClose(r, 4.448222, new Decimal("1e-4"));
  });

  it("1 kgf = 9.80665 N", () => {
    const r = conv(1, "kilogram_force", "newton", forceCategory);
    expect(r.toFixed()).toBe("9.80665");
  });

  it("1 kip = 1000 lbf", () => {
    const r = conv(1, "kip", "pound_force", forceCategory);
    expectClose(r, 1000, new Decimal("1e-8"));
  });
});

// ─── Pressure ──────────────────────────────────────────────────────────────────

describe("Pressure", () => {
  it("1 psi = 6.894757 kPa", () => {
    const r = conv(1, "psi", "kilopascal", pressureCategory);
    expectClose(r, 6.894757, new Decimal("1e-4"));
  });

  it("1 atm = 101325 Pa", () => {
    const r = conv(1, "atmosphere", "pascal", pressureCategory);
    expect(r.toFixed()).toBe("101325");
  });

  it("1 bar = 100000 Pa", () => {
    const r = conv(1, "bar", "pascal", pressureCategory);
    expect(r.toFixed()).toBe("100000");
  });

  it("1 MPa = 1000 kPa", () => {
    const r = conv(1, "megapascal", "kilopascal", pressureCategory);
    expect(r.toFixed()).toBe("1000");
  });

  it("350 psi in kPa, MPa, bar, atm all non-zero", () => {
    const kPa = conv(350, "psi", "kilopascal", pressureCategory);
    const MPa = conv(350, "psi", "megapascal", pressureCategory);
    const bar = conv(350, "psi", "bar", pressureCategory);
    const atm = conv(350, "psi", "atmosphere", pressureCategory);
    expect(kPa.gt(0)).toBe(true);
    expect(MPa.gt(0)).toBe(true);
    expect(bar.gt(0)).toBe(true);
    expect(atm.gt(0)).toBe(true);
  });
});

// ─── Torque ────────────────────────────────────────────────────────────────────

describe("Torque", () => {
  it("1 lbf-ft = 1.355818 N-m", () => {
    const r = conv(1, "pound_force_foot", "newton_meter", torqueCategory);
    expectClose(r, 1.355818, new Decimal("1e-4"));
  });

  it("1 lbf-in = 0.1129848 N-m", () => {
    const r = conv(1, "pound_force_inch", "newton_meter", torqueCategory);
    expectClose(r, 0.1129848, new Decimal("1e-5"));
  });

  it("12 lbf-in = 1 lbf-ft", () => {
    const r = conv(12, "pound_force_inch", "pound_force_foot", torqueCategory);
    expectClose(r, 1, new Decimal("1e-8"));
  });
});

// ─── Energy ────────────────────────────────────────────────────────────────────

describe("Energy", () => {
  it("1 kWh = 3600000 J", () => {
    const r = conv(1, "kilowatt_hour", "joule", energyCategory);
    expect(r.toFixed()).toBe("3600000");
  });

  it("1 ft-lbf = 1.355818 J", () => {
    const r = conv(1, "foot_pound_force", "joule", energyCategory);
    expectClose(r, 1.355818, new Decimal("1e-4"));
  });

  it("1 Btu ≈ 1055.056 J", () => {
    const r = conv(1, "btu_it", "joule", energyCategory);
    expectClose(r, 1055.056, new Decimal("1e-2"));
  });
});

// ─── Power ─────────────────────────────────────────────────────────────────────

describe("Power", () => {
  it("1 hp = 745.7 W", () => {
    const r = conv(1, "horsepower_mech", "watt", powerCategory);
    expectClose(r, 745.7, new Decimal("1e-1"));
  });

  it("1 kW = 1000 W", () => {
    const r = conv(1, "kilowatt", "watt", powerCategory);
    expect(r.toFixed()).toBe("1000");
  });
});

// ─── Flow ──────────────────────────────────────────────────────────────────────

describe("Volumetric Flow", () => {
  it("1 US gal/min ≈ 0.0630902 L/s", () => {
    const r = conv(1, "us_gallon_per_minute", "liter_per_second", flowCategory);
    expectClose(r, 0.0630902, new Decimal("1e-4"));
  });
});

// ─── Registry validation ───────────────────────────────────────────────────────

describe("Registry integrity", () => {
  it("all category ids are unique", () => {
    const ids = ALL_CATEGORIES.map((c) => c.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("every category has a valid baseUnitId", () => {
    for (const cat of ALL_CATEGORIES) {
      const base = cat.units.find((u) => u.id === cat.baseUnitId);
      expect(base, `Category "${cat.id}" missing baseUnit "${cat.baseUnitId}"`).toBeDefined();
    }
  });

  it("every unit id is unique within its category", () => {
    for (const cat of ALL_CATEGORIES) {
      const ids = cat.units.map((u) => u.id);
      const unique = new Set(ids);
      expect(unique.size, `Category "${cat.id}" has duplicate unit ids`).toBe(ids.length);
    }
  });

  it("all linear units round-trip within tolerance", () => {
    for (const cat of ALL_CATEGORIES) {
      const linearUnits = cat.units.filter((u) => u.kind === "linear");
      if (linearUnits.length < 2) continue;

      const src = linearUnits[0];
      const tgt = linearUnits[1];
      const input = new Decimal("42.5");

      const base = toBase(input, src);
      const converted = fromBase(base, tgt);
      const baseBack = toBase(converted, tgt);
      const back = fromBase(baseBack, src);

      expectClose(back, 42.5, new Decimal("1e-8"));
    }
  });

  it("1+3/8 inches = 34.925 mm", () => {
    // This validates the common use case described in the spec
    const value = new Decimal("1.375"); // 1 + 3/8
    const src = getUnit(lengthCategory, "inch");
    const tgt = getUnit(lengthCategory, "millimeter");
    const result = convertValue(value, src, tgt, lengthCategory);
    expect(result.toFixed()).toBe("34.925");
  });
});
