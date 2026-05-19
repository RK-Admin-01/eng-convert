import type { Category } from "../types";

// Temperature interval / difference (linear, NOT affine).
// 1 K interval = 1 °C interval.
// 1 °F interval = 5/9 K interval.
// 1 °R interval = 5/9 K interval.
// Base unit: kelvin interval (same magnitude as Celsius degree interval).
export const temperatureIntervalCategory: Category = {
  id: "temperature_interval",
  name: "Temperature Interval",
  group: "common",
  baseUnitId: "kelvin_interval",
  dimension: "ΔΘ",
  units: [
    {
      id: "kelvin_interval",
      name: "kelvin (interval)",
      symbol: "ΔK",
      aliases: ["kelvin interval", "delta k", "dk", "ΔK"],
      system: "SI",
      kind: "linear",
      toBase: { multiplier: "1" },
      source: "BIPM_SI",
      exact: true,
    },
    {
      id: "celsius_interval",
      name: "Celsius degree (interval)",
      symbol: "Δ°C",
      aliases: ["celsius interval", "delta celsius", "delta c", "°c interval", "Δ°C"],
      system: "SI",
      kind: "linear",
      toBase: { multiplier: "1" },
      source: "BIPM_SI",
      exact: true,
    },
    {
      id: "fahrenheit_interval",
      name: "Fahrenheit degree (interval)",
      symbol: "Δ°F",
      aliases: ["fahrenheit interval", "delta fahrenheit", "delta f", "°f interval", "Δ°F"],
      system: "USCustomary",
      kind: "linear",
      toBase: { multiplier: "0.5555555555555555555555555556" },
      source: "NIST_SP_811",
    },
    {
      id: "rankine_interval",
      name: "Rankine degree (interval)",
      symbol: "Δ°R",
      aliases: ["rankine interval", "delta rankine", "delta r", "°r interval", "Δ°R"],
      system: "Engineering",
      kind: "linear",
      toBase: { multiplier: "0.5555555555555555555555555556" },
      source: "NIST_SP_811",
    },
  ],
};
