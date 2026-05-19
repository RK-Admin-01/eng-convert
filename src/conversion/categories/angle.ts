import type { Category } from "../types";

export const angleCategory: Category = {
  id: "angle",
  name: "Angle",
  group: "dataTimeAngles",
  baseUnitId: "radian",
  dimension: "dimensionless",
  units: [
    {
      id: "radian",
      name: "radian",
      symbol: "rad",
      aliases: ["radian", "radians", "rad"],
      system: "SI",
      kind: "linear",
      toBase: { multiplier: "1" },
      source: "BIPM_SI",
      exact: true,
    },
    {
      id: "degree",
      name: "degree",
      symbol: "°",
      aliases: ["degree", "degrees", "deg", "°"],
      system: "Other",
      kind: "linear",
      // pi / 180
      toBase: { multiplier: "0.017453292519943295769236907685" },
      source: "NIST_SP_811",
    },
    {
      id: "gradian",
      name: "gradian",
      symbol: "grad",
      aliases: ["gradian", "gradians", "grad", "gon"],
      system: "Other",
      kind: "linear",
      // pi / 200
      toBase: { multiplier: "0.015707963267948966192313216916" },
      source: "NIST_SP_811",
    },
    {
      id: "arcminute",
      name: "arcminute",
      symbol: "′",
      aliases: ["arcminute", "arcminutes", "arcmin", "′", "minute of arc"],
      system: "Other",
      kind: "linear",
      // pi / 10800
      toBase: { multiplier: "0.00029088820866572159615394845618" },
      source: "NIST_SP_811",
    },
    {
      id: "arcsecond",
      name: "arcsecond",
      symbol: "″",
      aliases: ["arcsecond", "arcseconds", "arcsec", "″", "second of arc"],
      system: "Other",
      kind: "linear",
      // pi / 648000
      toBase: { multiplier: "0.0000048481368110953599358992645103" },
      source: "NIST_SP_811",
    },
    {
      id: "revolution",
      name: "revolution",
      symbol: "rev",
      aliases: ["revolution", "revolutions", "rev", "turn", "turns", "cycle"],
      system: "Other",
      kind: "linear",
      // 2*pi
      toBase: { multiplier: "6.2831853071795864769252867666" },
      source: "APP_DEFINED",
    },
  ],
};
