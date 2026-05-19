import type { Category } from "../types";

export const electricCurrentCategory: Category = {
  id: "electric_current",
  name: "Electric Current",
  group: "electrical",
  baseUnitId: "ampere",
  dimension: "I",
  units: [
    { id: "ampere", name: "ampere", symbol: "A", aliases: ["ampere", "amperes", "amp", "amps", "A"], system: "SI", kind: "linear", toBase: { multiplier: "1" }, source: "BIPM_SI", exact: true },
    { id: "milliampere", name: "milliampere", symbol: "mA", aliases: ["milliampere", "milliamp", "mA"], system: "SI", kind: "linear", toBase: { multiplier: "0.001" }, source: "BIPM_SI", exact: true },
    { id: "microampere", name: "microampere", symbol: "µA", aliases: ["microampere", "microamp", "µA", "uA"], system: "SI", kind: "linear", toBase: { multiplier: "0.000001" }, source: "BIPM_SI", exact: true },
    { id: "kiloampere", name: "kiloampere", symbol: "kA", aliases: ["kiloampere", "kiloamp", "kA"], system: "SI", kind: "linear", toBase: { multiplier: "1000" }, source: "BIPM_SI", exact: true },
  ],
};

export const voltageCategory: Category = {
  id: "voltage",
  name: "Voltage",
  group: "electrical",
  baseUnitId: "volt",
  dimension: "M·L²/(T³·I)",
  units: [
    { id: "volt", name: "volt", symbol: "V", aliases: ["volt", "volts", "V"], system: "SI", kind: "linear", toBase: { multiplier: "1" }, source: "BIPM_SI", exact: true },
    { id: "millivolt", name: "millivolt", symbol: "mV", aliases: ["millivolt", "millivolts", "mV"], system: "SI", kind: "linear", toBase: { multiplier: "0.001" }, source: "BIPM_SI", exact: true },
    { id: "microvolt", name: "microvolt", symbol: "µV", aliases: ["microvolt", "microvolts", "µV", "uV"], system: "SI", kind: "linear", toBase: { multiplier: "0.000001" }, source: "BIPM_SI", exact: true },
    { id: "kilovolt", name: "kilovolt", symbol: "kV", aliases: ["kilovolt", "kilovolts", "kV"], system: "SI", kind: "linear", toBase: { multiplier: "1000" }, source: "BIPM_SI", exact: true },
  ],
};

export const resistanceCategory: Category = {
  id: "resistance",
  name: "Resistance",
  group: "electrical",
  baseUnitId: "ohm",
  dimension: "M·L²/(T³·I²)",
  units: [
    { id: "ohm", name: "ohm", symbol: "Ω", aliases: ["ohm", "ohms", "Ω"], system: "SI", kind: "linear", toBase: { multiplier: "1" }, source: "BIPM_SI", exact: true },
    { id: "milliohm", name: "milliohm", symbol: "mΩ", aliases: ["milliohm", "milliohms", "mΩ"], system: "SI", kind: "linear", toBase: { multiplier: "0.001" }, source: "BIPM_SI", exact: true },
    { id: "kiloohm", name: "kiloohm", symbol: "kΩ", aliases: ["kiloohm", "kiloohms", "kΩ", "kilohm"], system: "SI", kind: "linear", toBase: { multiplier: "1000" }, source: "BIPM_SI", exact: true },
    { id: "megaohm", name: "megaohm", symbol: "MΩ", aliases: ["megaohm", "megaohms", "MΩ", "megohm"], system: "SI", kind: "linear", toBase: { multiplier: "1000000" }, source: "BIPM_SI", exact: true },
  ],
};

export const conductanceCategory: Category = {
  id: "conductance",
  name: "Conductance",
  group: "electrical",
  baseUnitId: "siemens",
  dimension: "T³·I²/(M·L²)",
  units: [
    { id: "siemens", name: "siemens", symbol: "S", aliases: ["siemens", "S", "mho"], system: "SI", kind: "linear", toBase: { multiplier: "1" }, source: "BIPM_SI", exact: true },
    { id: "millisiemens", name: "millisiemens", symbol: "mS", aliases: ["millisiemens", "mS"], system: "SI", kind: "linear", toBase: { multiplier: "0.001" }, source: "BIPM_SI", exact: true },
    { id: "microsiemens", name: "microsiemens", symbol: "µS", aliases: ["microsiemens", "µS", "uS"], system: "SI", kind: "linear", toBase: { multiplier: "0.000001" }, source: "BIPM_SI", exact: true },
  ],
};

export const capacitanceCategory: Category = {
  id: "capacitance",
  name: "Capacitance",
  group: "electrical",
  baseUnitId: "farad",
  dimension: "T⁴·I²/(M·L²)",
  units: [
    { id: "farad", name: "farad", symbol: "F", aliases: ["farad", "farads", "F"], system: "SI", kind: "linear", toBase: { multiplier: "1" }, source: "BIPM_SI", exact: true },
    { id: "microfarad", name: "microfarad", symbol: "µF", aliases: ["microfarad", "microfarads", "µF", "uF"], system: "SI", kind: "linear", toBase: { multiplier: "0.000001" }, source: "BIPM_SI", exact: true },
    { id: "nanofarad", name: "nanofarad", symbol: "nF", aliases: ["nanofarad", "nanofarads", "nF"], system: "SI", kind: "linear", toBase: { multiplier: "0.000000001" }, source: "BIPM_SI", exact: true },
    { id: "picofarad", name: "picofarad", symbol: "pF", aliases: ["picofarad", "picofarads", "pF"], system: "SI", kind: "linear", toBase: { multiplier: "0.000000000001" }, source: "BIPM_SI", exact: true },
  ],
};

export const inductanceCategory: Category = {
  id: "inductance",
  name: "Inductance",
  group: "electrical",
  baseUnitId: "henry",
  dimension: "M·L²/(T²·I²)",
  units: [
    { id: "henry", name: "henry", symbol: "H", aliases: ["henry", "henries", "H"], system: "SI", kind: "linear", toBase: { multiplier: "1" }, source: "BIPM_SI", exact: true },
    { id: "millihenry", name: "millihenry", symbol: "mH", aliases: ["millihenry", "millihenries", "mH"], system: "SI", kind: "linear", toBase: { multiplier: "0.001" }, source: "BIPM_SI", exact: true },
    { id: "microhenry", name: "microhenry", symbol: "µH", aliases: ["microhenry", "microhenries", "µH", "uH"], system: "SI", kind: "linear", toBase: { multiplier: "0.000001" }, source: "BIPM_SI", exact: true },
  ],
};

export const electricChargeCategory: Category = {
  id: "electric_charge",
  name: "Electric Charge",
  group: "electrical",
  baseUnitId: "coulomb",
  dimension: "T·I",
  units: [
    { id: "coulomb", name: "coulomb", symbol: "C", aliases: ["coulomb", "coulombs", "C"], system: "SI", kind: "linear", toBase: { multiplier: "1" }, source: "BIPM_SI", exact: true },
    { id: "ampere_hour", name: "ampere hour", symbol: "Ah", aliases: ["ampere hour", "amp hour", "Ah"], system: "Other", kind: "linear", toBase: { multiplier: "3600" }, source: "APP_DEFINED", exact: true },
    { id: "milliampere_hour", name: "milliampere hour", symbol: "mAh", aliases: ["milliampere hour", "milliamp hour", "mAh"], system: "Other", kind: "linear", toBase: { multiplier: "3.6" }, source: "APP_DEFINED", exact: true },
  ],
};

export const frequencyCategory: Category = {
  id: "frequency",
  name: "Frequency",
  group: "electrical",
  baseUnitId: "hertz",
  dimension: "1/T",
  units: [
    { id: "hertz", name: "hertz", symbol: "Hz", aliases: ["hertz", "Hz"], system: "SI", kind: "linear", toBase: { multiplier: "1" }, source: "BIPM_SI", exact: true },
    { id: "kilohertz", name: "kilohertz", symbol: "kHz", aliases: ["kilohertz", "kHz"], system: "SI", kind: "linear", toBase: { multiplier: "1000" }, source: "BIPM_SI", exact: true },
    { id: "megahertz", name: "megahertz", symbol: "MHz", aliases: ["megahertz", "MHz"], system: "SI", kind: "linear", toBase: { multiplier: "1000000" }, source: "BIPM_SI", exact: true },
    { id: "gigahertz", name: "gigahertz", symbol: "GHz", aliases: ["gigahertz", "GHz"], system: "SI", kind: "linear", toBase: { multiplier: "1000000000" }, source: "BIPM_SI", exact: true },
    { id: "rpm", name: "revolutions per minute", symbol: "rpm", aliases: ["rpm", "revolutions per minute", "rev/min"], system: "Other", kind: "linear", toBase: { multiplier: "0.016666666666666666667" }, source: "APP_DEFINED" },
  ],
};
