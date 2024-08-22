import {
  OverheadExpense,
  ProfitMarginSettings,
  ProfitRangePoint,
  RawMaterial,
} from './types/product.schema';

import Decimal from 'decimal.js';
import memoize from 'lodash/memoize';
import {
  calculateTotalOverheadCost,
  calculateTotalRawMaterialCost,
} from './lib/get-total';

export function calculateManufacturingCostPerUnit(
  rawMaterials: RawMaterial[],
  overheadExpenses: OverheadExpense[],
  desiredProductionQuantity: number
): number {
  const rawMaterialCost = new Decimal(
    calculateTotalRawMaterialCost(rawMaterials)
  );
  const overheadCost = new Decimal(
    calculateTotalOverheadCost(overheadExpenses)
  );
  const totalCost = rawMaterialCost.plus(overheadCost);
  return totalCost
    .dividedBy(desiredProductionQuantity)
    .toDecimalPlaces(2)
    .toNumber();
}

export function calculateRecommendedSalesPrice(
  manufacturingCost: number,
  profitMarginSettings: ProfitMarginSettings
): number {
  const {calculationType, profitValue} = profitMarginSettings;
  const cost = new Decimal(manufacturingCost);
  const profit = new Decimal(profitValue);

  const price =
    calculationType === 'fixed-markup'
      ? cost.plus(profit)
      : cost.times(Decimal.sum(1, profit.dividedBy(100)));

  return price.toDecimalPlaces(2).toNumber();
}

export function calculateBreakEvenPoint(
  overheadExpenses: OverheadExpense[],
  rawMaterials: RawMaterial[],
  recommendedRetailPrice: number,
  desiredProductionQuantity: number
): number {
  const fixedCosts = new Decimal(calculateTotalOverheadCost(overheadExpenses));
  const variableCostPerUnit = new Decimal(
    calculateTotalRawMaterialCost(rawMaterials)
  ).dividedBy(desiredProductionQuantity);
  const contributionMargin = new Decimal(recommendedRetailPrice).minus(
    variableCostPerUnit
  );

  return fixedCosts.dividedBy(contributionMargin).toDecimalPlaces(2).toNumber();
}

export function calculateProfitPerUnit(
  recommendedRetailPrice: number,
  manufacturingCostPerUnit: number
): number {
  return new Decimal(recommendedRetailPrice)
    .minus(manufacturingCostPerUnit)
    .toDecimalPlaces(2)
    .toNumber();
}

export function calculateTotalPotentialProfit(
  profitPerUnit: number,
  expectedSales: number
): number {
  return new Decimal(profitPerUnit)
    .times(expectedSales)
    .toDecimalPlaces(2)
    .toNumber();
}

export function calculateMarginOfSafety(
  expectedSales: number,
  breakEvenPoint: number
): number {
  if (expectedSales <= 0) {
    return 0;
  }
  return new Decimal(expectedSales)
    .minus(breakEvenPoint)
    .dividedBy(expectedSales)
    .times(100)
    .toDecimalPlaces(2)
    .toNumber();
}

export function calculateContributionMargin(
  recommendedRetailPrice: number,
  rawMaterials: RawMaterial[],
  desiredProductionQuantity: number
): number {
  const variableCostPerUnit = new Decimal(
    calculateTotalRawMaterialCost(rawMaterials)
  ).dividedBy(desiredProductionQuantity);
  return new Decimal(recommendedRetailPrice)
    .minus(variableCostPerUnit)
    .dividedBy(recommendedRetailPrice)
    .toDecimalPlaces(4)
    .toNumber();
}

export const calculateProfitRange = memoize(
  (
    fixedCosts: number,
    variableCostPerUnit: number,
    pricePerUnit: number,
    maxQuantity: number
  ): ProfitRangePoint[] => {
    const profitRange: ProfitRangePoint[] = [];
    const maxDataPoints = 100; // Limit the number of data points
    const step = Math.max(1, Math.floor(maxQuantity / maxDataPoints));

    for (let quantity = 0; quantity <= maxQuantity; quantity += step) {
      const totalRevenue = new Decimal(pricePerUnit).times(quantity);
      const totalCost = new Decimal(fixedCosts).plus(
        new Decimal(variableCostPerUnit).times(quantity)
      );
      const profit = totalRevenue.minus(totalCost);
      profitRange.push({quantity, profit: profit.toNumber()});
    }

    if (profitRange[profitRange.length - 1].quantity !== maxQuantity) {
      const totalRevenue = new Decimal(pricePerUnit).times(maxQuantity);
      const totalCost = new Decimal(fixedCosts).plus(
        new Decimal(variableCostPerUnit).times(maxQuantity)
      );
      const profit = totalRevenue.minus(totalCost);
      profitRange.push({quantity: maxQuantity, profit: profit.toNumber()});
    }

    return profitRange;
  },
  (...args: [number, number, number, number]) => JSON.stringify(args)
);
