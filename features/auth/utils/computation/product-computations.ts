import {
  OverheadExpense,
  ProfitMarginSettings,
  RawMaterial,
} from "@/types/product.schema";
import { calculationType } from "@/types/product.type";
import {
  calculateTotalOverheadCost,
  calculateTotalRawMaterialCost,
} from "./sub-computations";

function calculateManufacturingCostPerUnit(
  rawMaterials: RawMaterial[],
  overheadExpenses: OverheadExpense[]
): number {
  const rawMaterialCost = calculateTotalRawMaterialCost(rawMaterials);
  const overheadCost = calculateTotalOverheadCost(overheadExpenses, 1);
  return Number((rawMaterialCost + overheadCost).toFixed(2));
}

function calculateRecommendedRetailPrice(
  manufacturingCostPerUnit: number,
  profitMarginSettings: ProfitMarginSettings
): number {
  const { calculationType, percentageValue } = profitMarginSettings;
  const price =
    calculationType === "percentage"
      ? manufacturingCostPerUnit * (1 + percentageValue / 100)
      : manufacturingCostPerUnit + percentageValue;
  return Number(price.toFixed(2));
}
function calculateMaximumUnitsProducible(rawMaterials: RawMaterial[]): number {
  return rawMaterials.reduce((minUnits, material) => {
    const materialUnits = Math.floor(
      material.stockOnHand / material.quantityNeededPerUnit
    );
    return Math.min(minUnits, materialUnits);
  }, Infinity);
}

function calculateProfitMargin(
  recommendedRetailPrice: number,
  manufacturingCostPerUnit: number
): ProfitMarginSettings {
  const profit = recommendedRetailPrice - manufacturingCostPerUnit;
  const percentageValue = (profit / manufacturingCostPerUnit) * 100;
  return {
    calculationType: "percentage" as calculationType,
    percentageValue: Number(percentageValue.toFixed(2)),
  };
}

export {
  calculateManufacturingCostPerUnit,
  calculateMaximumUnitsProducible,
  calculateProfitMargin,
  calculateRecommendedRetailPrice,
};
