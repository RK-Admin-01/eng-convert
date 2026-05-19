export type Constant = {
  id: string;
  symbol: string;
  name: string;
  value: string;
  unit: string;
  description: string;
  group: "physical" | "math" | "engineering";
};

export const CONSTANTS: Constant[] = [
  // ── Physical ────────────────────────────────────────────────────────────────
  { id: "c",       symbol: "c",      name: "Speed of light",           value: "299792458",          unit: "m/s",        description: "Exact, by definition (SI 2019)",    group: "physical" },
  { id: "g",       symbol: "g",      name: "Standard gravity",         value: "9.80665",            unit: "m/s²",       description: "Standard reference value",           group: "physical" },
  { id: "G",       symbol: "G",      name: "Gravitational constant",   value: "6.67430e-11",        unit: "m³/(kg·s²)", description: "CODATA 2018",                        group: "physical" },
  { id: "h",       symbol: "h",      name: "Planck constant",          value: "6.62607015e-34",     unit: "J·s",        description: "Exact, by definition (SI 2019)",    group: "physical" },
  { id: "hbar",    symbol: "ℏ",      name: "Reduced Planck constant",  value: "1.054571817e-34",    unit: "J·s",        description: "h / (2π)",                           group: "physical" },
  { id: "kB",      symbol: "k_B",    name: "Boltzmann constant",       value: "1.380649e-23",       unit: "J/K",        description: "Exact, by definition (SI 2019)",    group: "physical" },
  { id: "NA",      symbol: "N_A",    name: "Avogadro constant",        value: "6.02214076e23",      unit: "/mol",       description: "Exact, by definition (SI 2019)",    group: "physical" },
  { id: "R",       symbol: "R",      name: "Molar gas constant",       value: "8.314462618",        unit: "J/(mol·K)",  description: "R = N_A × k_B",                     group: "physical" },
  { id: "e_chg",   symbol: "e",      name: "Elementary charge",        value: "1.602176634e-19",    unit: "C",          description: "Exact, by definition (SI 2019)",    group: "physical" },
  { id: "sigma",   symbol: "σ",      name: "Stefan–Boltzmann constant","value": "5.670374419e-8",   unit: "W/(m²·K⁴)", description: "CODATA 2018",                        group: "physical" },
  { id: "eps0",    symbol: "ε₀",     name: "Vacuum permittivity",      value: "8.8541878128e-12",   unit: "F/m",        description: "Electric constant",                  group: "physical" },
  { id: "mu0",     symbol: "μ₀",     name: "Vacuum permeability",      value: "1.25663706212e-6",   unit: "H/m",        description: "Magnetic constant",                  group: "physical" },

  // ── Mathematical ────────────────────────────────────────────────────────────
  { id: "pi",      symbol: "π",      name: "Pi",                       value: "3.14159265358979324", unit: "",           description: "Circumference / diameter",           group: "math" },
  { id: "euler_e", symbol: "e",      name: "Euler's number",           value: "2.71828182845904524", unit: "",           description: "Base of natural logarithm",          group: "math" },
  { id: "phi",     symbol: "φ",      name: "Golden ratio",             value: "1.61803398874989485", unit: "",           description: "(1 + √5) / 2",                       group: "math" },
  { id: "sqrt2",   symbol: "√2",     name: "Square root of 2",         value: "1.41421356237309505", unit: "",           description: "Diagonal of unit square",            group: "math" },
  { id: "ln2",     symbol: "ln 2",   name: "Natural log of 2",         value: "0.693147180559945309", unit: "",          description: "Bits to nats conversion",            group: "math" },

  // ── Engineering ─────────────────────────────────────────────────────────────
  { id: "atm",     symbol: "atm",    name: "Standard atmosphere",      value: "101325",             unit: "Pa",         description: "Exact, by definition",               group: "engineering" },
  { id: "rho_w",   symbol: "ρ_w",    name: "Water density (4°C)",      value: "999.972",            unit: "kg/m³",      description: "Maximum density of liquid water",    group: "engineering" },
  { id: "rho_air", symbol: "ρ_air",  name: "Air density (15°C, 1 atm)","value": "1.225",            unit: "kg/m³",      description: "ISA standard sea level",             group: "engineering" },
  { id: "vs",      symbol: "v_s",    name: "Speed of sound (20°C)",    value: "343.2",              unit: "m/s",        description: "In dry air at 20°C, 1 atm",          group: "engineering" },
  { id: "mu_w",    symbol: "μ_w",    name: "Water viscosity (20°C)",   value: "1.002e-3",           unit: "Pa·s",       description: "Dynamic viscosity at 20°C",          group: "engineering" },
];

export const CONSTANT_GROUPS: { key: Constant["group"]; label: string }[] = [
  { key: "physical",    label: "Physical Constants" },
  { key: "math",        label: "Mathematical Constants" },
  { key: "engineering", label: "Engineering Reference" },
];
