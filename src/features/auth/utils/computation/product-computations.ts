import {
  OverheadExpense,
  ProfitMarginSettings,
  RawMaterial,
} from '@/types/product.schema';
import Decimal from 'decimal.js';
import {
  calculateTotalOverheadCost,
  calculateTotalRawMaterialCost,
} from './sub-computations';

function calculateManufacturingCostPerUnit(
  rawMaterials: RawMaterial[],
  overheadExpenses: OverheadExpense[]
): number {
  const rawMaterialCost = new Decimal(
    calculateTotalRawMaterialCost(rawMaterials)
  );
  const overheadCost = new Decimal(
    calculateTotalOverheadCost(overheadExpenses)
  );
  return rawMaterialCost.plus(overheadCost).toDecimalPlaces(2).toNumber();
}

function calculateRecommendedRetailPrice(
  manufacturingCostPerUnit: number,
  profitMarginSettings: ProfitMarginSettings
): number {
  const {calculationType, profitValue} = profitMarginSettings;
  const cost = new Decimal(manufacturingCostPerUnit);
  const profit = new Decimal(profitValue);

  const price =
    calculationType === 'fixed-markup'
      ? cost.plus(profit)
      : cost.times(Decimal.sum(1, profit.dividedBy(100)));

  return price.toDecimalPlaces(2).toNumber();
}

function calculateBreakEvenPoint(
  overheadExpenses: OverheadExpense[],
  rawMaterials: RawMaterial[],
  recommendedRetailPrice: number
): number {
  const fixedCosts = new Decimal(calculateTotalOverheadCost(overheadExpenses));
  const variableCostPerUnit = new Decimal(
    calculateTotalRawMaterialCost(rawMaterials)
  );
  const contributionMargin = new Decimal(recommendedRetailPrice).minus(
    variableCostPerUnit
  );

  return fixedCosts.dividedBy(contributionMargin).toDecimalPlaces(2).toNumber();
}

function calculateProfitPerUnit(
  recommendedRetailPrice: number,
  manufacturingCostPerUnit: number
): number {
  return new Decimal(recommendedRetailPrice)
    .minus(manufacturingCostPerUnit)
    .toDecimalPlaces(2)
    .toNumber();
}

function calculateTotalPotentialProfit(
  profitPerUnit: number,
  desiredProductionQuantity: number
): number {
  return new Decimal(profitPerUnit)
    .times(desiredProductionQuantity)
    .toDecimalPlaces(2)
    .toNumber();
}

function calculateMarginOfSafety(
  expectedSalesQuantity: number,
  breakEvenPoint: number
): number {
  if (expectedSalesQuantity <= 0) {
    return 0;
  }
  return new Decimal(expectedSalesQuantity)
    .minus(breakEvenPoint)
    .dividedBy(expectedSalesQuantity)
    .times(100)
    .toDecimalPlaces(2)
    .toNumber();
}

function calculateContributionMargin(
  recommendedRetailPrice: number,
  rawMaterials: RawMaterial[]
): number {
  const variableCostPerUnit = new Decimal(
    calculateTotalRawMaterialCost(rawMaterials)
  );
  return new Decimal(recommendedRetailPrice)
    .minus(variableCostPerUnit)
    .toDecimalPlaces(2)
    .toNumber();
}

export {
  calculateBreakEvenPoint,
  calculateContributionMargin,
  calculateManufacturingCostPerUnit,
  calculateMarginOfSafety,
  calculateProfitPerUnit,
  calculateRecommendedRetailPrice,
  calculateTotalPotentialProfit,
};
