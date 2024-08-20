import {
  OverheadExpense,
  ProfitMarginSettings,
  RawMaterial,
} from '@/types/product.schema';
import {calculationType} from '@/types/product.type';
import {
  calculateTotalOverheadCost,
  calculateTotalRawMaterialCost,
} from './sub-computations';

function calculateManufacturingCostPerUnit(
  rawMaterials: RawMaterial[],
  overheadExpenses: OverheadExpense[]
): number {
  /**
   * formula: manufacturingCostPerUnit = (totalRawMaterialCost + totalOverheadCost)
   * note: this is per unit, so we multiply by 1 in the totalOverheadCost calculation
   */
  const rawMaterialCost = calculateTotalRawMaterialCost(rawMaterials);
  const overheadCost = calculateTotalOverheadCost(overheadExpenses, 1);
  return Number((rawMaterialCost + overheadCost).toFixed(2));
}

function calculateRecommendedRetailPrice(
  manufacturingCostPerUnit: number,
  profitMarginSettings: ProfitMarginSettings
): number {
  const {calculationType, percentageValue} = profitMarginSettings;
  /**
   * if calculationType is percentage => recommendedRetailPrice = manufacturingCostPerUnit * (1 + profitMargin / 100)
   * if calculationType === "fixed" => recommendedRetailPrice = manufacturingCostPerUnit + percentageValue
   */
  const price =
    calculationType === 'percentage'
      ? manufacturingCostPerUnit * (1 + percentageValue / 100)
      : manufacturingCostPerUnit + percentageValue;
  return Number(price.toFixed(2));
}
function calculateMaximumUnitsProducible(rawMaterials: RawMaterial[]): number {
  return rawMaterials.reduce((minUnits, material) => {
    const materialUnits = Math.floor(
      material.stockOnHand / material.quantityNeededPerUnit
    ); // formula: materialUnits = stockOnHand / quantityNeededPerUnit
    return Math.min(minUnits, materialUnits); // formula: maximumUnitsProducible = min(minUnits, materialUnits)
  }, Infinity);
}

function calculateProfitMargin(
  recommendedRetailPrice: number,
  manufacturingCostPerUnit: number
): ProfitMarginSettings {
  // formula: profit = recommendedRetailPrice - manufacturingCostPerUnit
  const profit = recommendedRetailPrice - manufacturingCostPerUnit;
  // formula: profitMargin = (profit / manufacturingCostPerUnit) * 10
  const percentageValue = (profit / manufacturingCostPerUnit) * 100;
  return {
    calculationType: 'percentage' as calculationType,
    percentageValue: Number(percentageValue.toFixed(2)),
  };
}

export {
  calculateManufacturingCostPerUnit,
  calculateMaximumUnitsProducible,
  calculateProfitMargin,
  calculateRecommendedRetailPrice,
};
