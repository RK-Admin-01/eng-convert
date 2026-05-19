import type { Category } from "./types";
import { lengthCategory } from "./categories/length";
import { areaCategory } from "./categories/area";
import { volumeCategory } from "./categories/volume";
import { massCategory } from "./categories/mass";
import { temperatureCategory } from "./categories/temperature";
import { temperatureIntervalCategory } from "./categories/temperatureInterval";
import { timeCategory } from "./categories/time";
import { speedCategory } from "./categories/speed";
import { angleCategory } from "./categories/angle";
import { forceCategory } from "./categories/force";
import { pressureCategory } from "./categories/pressure";
import { torqueCategory } from "./categories/torque";
import { energyCategory } from "./categories/energy";
import { powerCategory } from "./categories/power";
import { densityCategory } from "./categories/density";
import { flowCategory, massFlowCategory } from "./categories/flow";
import { dynamicViscosityCategory, kinematicViscosityCategory } from "./categories/viscosity";
import {
  thermalConductivityCategory,
  heatTransferCoefficientCategory,
  specificHeatCategory,
  thermalResistanceCategory,
  heatFluxCategory,
} from "./categories/thermal";
import {
  electricCurrentCategory,
  voltageCategory,
  resistanceCategory,
  conductanceCategory,
  capacitanceCategory,
  inductanceCategory,
  electricChargeCategory,
  frequencyCategory,
} from "./categories/electrical";
import { dataStorageCategory } from "./categories/dataStorage";

export const ALL_CATEGORIES: Category[] = [
  // Common
  lengthCategory,
  areaCategory,
  volumeCategory,
  massCategory,
  temperatureCategory,
  temperatureIntervalCategory,
  timeCategory,
  speedCategory,
  angleCategory,
  // Mechanical
  forceCategory,
  pressureCategory,
  torqueCategory,
  energyCategory,
  powerCategory,
  densityCategory,
  // Fluids
  flowCategory,
  massFlowCategory,
  dynamicViscosityCategory,
  kinematicViscosityCategory,
  // Thermal
  thermalConductivityCategory,
  heatTransferCoefficientCategory,
  specificHeatCategory,
  thermalResistanceCategory,
  heatFluxCategory,
  // Electrical
  electricCurrentCategory,
  voltageCategory,
  resistanceCategory,
  conductanceCategory,
  capacitanceCategory,
  inductanceCategory,
  electricChargeCategory,
  frequencyCategory,
  // Data / Time / Angles
  dataStorageCategory,
];

export const CATEGORY_MAP: Map<string, Category> = new Map(
  ALL_CATEGORIES.map((c) => [c.id, c])
);

export function getCategoryById(id: string): Category | undefined {
  return CATEGORY_MAP.get(id);
}

export type SearchHit = {
  category: Category;
  matchedUnit?: { id: string; name: string; symbol: string };
  score: number;
};

export function searchCategories(query: string): SearchHit[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  const hits: SearchHit[] = [];

  for (const category of ALL_CATEGORIES) {
    const catNameMatch = category.name.toLowerCase().includes(q);
    const catIdMatch = category.id.toLowerCase().includes(q);

    if (catNameMatch || catIdMatch) {
      hits.push({ category, score: catNameMatch ? 10 : 8 });
      continue;
    }

    let bestUnitScore = 0;
    let bestUnit: SearchHit["matchedUnit"] | undefined;

    for (const unit of category.units) {
      let score = 0;
      if (unit.symbol.toLowerCase() === q) score = 9;
      else if (unit.id === q) score = 8;
      else if (unit.aliases.some((a) => a.toLowerCase() === q)) score = 7;
      else if (unit.name.toLowerCase().includes(q)) score = 5;
      else if (unit.symbol.toLowerCase().includes(q)) score = 4;
      else if (unit.aliases.some((a) => a.toLowerCase().includes(q))) score = 3;

      if (score > bestUnitScore) {
        bestUnitScore = score;
        bestUnit = { id: unit.id, name: unit.name, symbol: unit.symbol };
      }
    }

    if (bestUnitScore > 0) {
      hits.push({ category, matchedUnit: bestUnit, score: bestUnitScore });
    }
  }

  return hits.sort((a, b) => b.score - a.score);
}
