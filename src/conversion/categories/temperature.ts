import type { Category } from "../types";

// Absolute temperature (affine conversions). Base unit: Kelvin.
// K = °C + 273.15
// K = (°F + 459.67) / 1.8  →  toBase: multiplier=1/1.8=0.555..., offset=459.67/1.8=255.372...
// K = °R / 1.8             →  toBase: multiplier=1/1.8
// Source: NIST SP 811
export const temperatureCategory: Category = {
  id: "temperature",
  name: "Temperature",
  group: "common",
  baseUnitId: "kelvin",
  dimension: "Θ",
  units: [
    {
      id: "kelvin",
      name: "kelvin",
      symbol: "K",
      aliases: ["kelvin", "kelvins", "K"],
      system: "SI",
      kind: "affine",
      toBase: { multiplier: "1", offset: "0" },
      source: "BIPM_SI",
      exact: true,
    },
    {
      id: "celsius",
      name: "degree Celsius",
      symbol: "°C",
      aliases: ["celsius", "centigrade", "degc", "°c", "deg c", "c"],
      system: "SI",
      kind: "affine",
      toBase: { multiplier: "1", offset: "273.15" },
      source: "BIPM_SI",
      exact: true,
    },
    {
      id: "fahrenheit",
      name: "degree Fahrenheit",
      symbol: "°F",
      aliases: ["fahrenheit", "degf", "°f", "deg f", "f"],
      system: "USCustomary",
      kind: "affine",
      // K = (F + 459.67) / 1.8 = F * (5/9) + 459.67*(5/9)
      // multiplier = 5/9, offset = 459.67 * 5/9 = 255.37222...
      toBase: { multiplier: "0.5555555555555555555555555556", offset: "255.3722222222222222222222222" },
      source: "NIST_SP_811",
    },
    {
      id: "rankine",
      name: "degree Rankine",
      symbol: "°R",
      aliases: ["rankine", "degr", "°r", "deg r", "r"],
      system: "Engineering",
      kind: "affine",
      // K = R / 1.8 = R * 5/9
      toBase: { multiplier: "0.5555555555555555555555555556", offset: "0" },
      source: "NIST_SP_811",
    },
  ],
};
