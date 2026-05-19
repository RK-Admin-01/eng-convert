import type { Category } from "../types";

// Thermal conductivity. Base: watt per meter kelvin (W/(m·K)).
export const thermalConductivityCategory: Category = {
  id: "thermal_conductivity",
  name: "Thermal Conductivity",
  group: "thermal",
  baseUnitId: "watt_per_meter_kelvin",
  dimension: "M·L/(T³·Θ)",
  units: [
    {
      id: "watt_per_meter_kelvin",
      name: "watt per meter kelvin",
      symbol: "W/(m·K)",
      aliases: ["W/(m·K)", "W/mK", "W/m-K", "watt per meter kelvin"],
      system: "SI",
      kind: "linear",
      toBase: { multiplier: "1" },
      source: "BIPM_SI",
      exact: true,
    },
    {
      id: "btu_per_hour_foot_fahrenheit",
      name: "Btu per hour foot degree Fahrenheit",
      symbol: "Btu/(h·ft·°F)",
      aliases: ["Btu/(h·ft·°F)", "btu/h-ft-f", "btu/hr-ft-f"],
      system: "USCustomary",
      kind: "linear",
      toBase: { multiplier: "1.7307346920028" },
      source: "NIST_SP_811",
    },
  ],
};

// Heat transfer coefficient. Base: watt per square meter kelvin (W/(m²·K)).
export const heatTransferCoefficientCategory: Category = {
  id: "heat_transfer_coefficient",
  name: "Heat Transfer Coefficient",
  group: "thermal",
  baseUnitId: "watt_per_square_meter_kelvin",
  dimension: "M/(T³·Θ)",
  units: [
    {
      id: "watt_per_square_meter_kelvin",
      name: "watt per square meter kelvin",
      symbol: "W/(m²·K)",
      aliases: ["W/(m²·K)", "W/m2K", "W/m²K"],
      system: "SI",
      kind: "linear",
      toBase: { multiplier: "1" },
      source: "BIPM_SI",
      exact: true,
    },
    {
      id: "btu_per_hour_square_foot_fahrenheit",
      name: "Btu per hour square foot degree Fahrenheit",
      symbol: "Btu/(h·ft²·°F)",
      aliases: ["Btu/(h·ft²·°F)", "btu/h-ft2-f"],
      system: "USCustomary",
      kind: "linear",
      toBase: { multiplier: "5.6782633411065" },
      source: "NIST_SP_811",
    },
  ],
};

// Specific heat capacity. Base: joule per kilogram kelvin (J/(kg·K)).
export const specificHeatCategory: Category = {
  id: "specific_heat",
  name: "Specific Heat Capacity",
  group: "thermal",
  baseUnitId: "joule_per_kilogram_kelvin",
  dimension: "L²/(T²·Θ)",
  units: [
    {
      id: "joule_per_kilogram_kelvin",
      name: "joule per kilogram kelvin",
      symbol: "J/(kg·K)",
      aliases: ["J/(kg·K)", "J/kg-K", "J/kgK"],
      system: "SI",
      kind: "linear",
      toBase: { multiplier: "1" },
      source: "BIPM_SI",
      exact: true,
    },
    {
      id: "kilojoule_per_kilogram_kelvin",
      name: "kilojoule per kilogram kelvin",
      symbol: "kJ/(kg·K)",
      aliases: ["kJ/(kg·K)", "kJ/kg-K", "kJ/kgK"],
      system: "SI",
      kind: "linear",
      toBase: { multiplier: "1000" },
      source: "BIPM_SI",
      exact: true,
    },
    {
      id: "btu_per_pound_fahrenheit",
      name: "Btu per pound degree Fahrenheit",
      symbol: "Btu/(lb·°F)",
      aliases: ["Btu/(lb·°F)", "btu/lb-f"],
      system: "USCustomary",
      kind: "linear",
      toBase: { multiplier: "4186.8" },
      source: "NIST_SP_811",
    },
  ],
};

// Thermal resistance. Base: kelvin per watt (K/W).
export const thermalResistanceCategory: Category = {
  id: "thermal_resistance",
  name: "Thermal Resistance",
  group: "thermal",
  baseUnitId: "kelvin_per_watt",
  dimension: "T³·Θ/M·L²",
  units: [
    {
      id: "kelvin_per_watt",
      name: "kelvin per watt",
      symbol: "K/W",
      aliases: ["K/W", "kelvin per watt"],
      system: "SI",
      kind: "linear",
      toBase: { multiplier: "1" },
      source: "BIPM_SI",
      exact: true,
    },
    {
      id: "degree_fahrenheit_per_btu_hour",
      name: "degree Fahrenheit per Btu per hour",
      symbol: "°F·h/Btu",
      aliases: ["°F·h/Btu", "f-h/btu", "fahrenheit hour per btu"],
      system: "USCustomary",
      kind: "linear",
      toBase: { multiplier: "0.52752792631" },
      source: "NIST_SP_811",
    },
  ],
};

// Heat flux. Base: watt per square meter (W/m²).
export const heatFluxCategory: Category = {
  id: "heat_flux",
  name: "Heat Flux",
  group: "thermal",
  baseUnitId: "watt_per_square_meter",
  dimension: "M/T³",
  units: [
    {
      id: "watt_per_square_meter",
      name: "watt per square meter",
      symbol: "W/m²",
      aliases: ["W/m²", "W/m2", "watt per square meter"],
      system: "SI",
      kind: "linear",
      toBase: { multiplier: "1" },
      source: "BIPM_SI",
      exact: true,
    },
    {
      id: "btu_per_hour_square_foot",
      name: "Btu per hour square foot",
      symbol: "Btu/(h·ft²)",
      aliases: ["Btu/(h·ft²)", "btu/h-ft2", "btu/hr-ft2"],
      system: "USCustomary",
      kind: "linear",
      toBase: { multiplier: "3.1545907643" },
      source: "NIST_SP_811",
    },
    {
      id: "kilowatt_per_square_meter",
      name: "kilowatt per square meter",
      symbol: "kW/m²",
      aliases: ["kW/m²", "kW/m2"],
      system: "SI",
      kind: "linear",
      toBase: { multiplier: "1000" },
      source: "BIPM_SI",
      exact: true,
    },
  ],
};
