import Decimal from 'decimal.js';
import {
  calculateTotalOverheadCost,
  calculateTotalRawMaterialCost,
} from './lib/get-total';
import {
  calculateBreakEvenPoint,
  calculateContributionMargin,
  calculateManufacturingCostPerUnit,
  calculateMarginOfSafety,
  calculateProfitPerUnit,
  calculateProfitRange,
  calculateRecommendedSalesPrice,
  calculateTotalPotentialProfit,
} from './product-formula';
import {ComputationResult, ProductSchema} from './types/product.schema';

export const getComputationResult = (
  product: ProductSchema
): ComputationResult => {
  const {
    rawMaterials,
    overheadExpenses,
    profitMarginSettings,
    expectedSales,
    quantityProduced,
  } = product;
  const manufacturingCostPerUnit = calculateManufacturingCostPerUnit(
    rawMaterials ?? [],
    overheadExpenses ?? [],
    quantityProduced
  );
  const recommendedSalesPrice = calculateRecommendedSalesPrice(
    manufacturingCostPerUnit,
    profitMarginSettings
  );
  const breakEvenPoint = calculateBreakEvenPoint(
    overheadExpenses ?? [],
    rawMaterials ?? [],
    recommendedSalesPrice,
    quantityProduced
  );
  const profitPerUnit = calculateProfitPerUnit(
    recommendedSalesPrice,
    manufacturingCostPerUnit
  );
  const marginOfSafety = calculateMarginOfSafety(expectedSales, breakEvenPoint);
  const totalPotentialProfit = calculateTotalPotentialProfit(
    profitPerUnit,
    expectedSales
  );
  const contributionMargin = calculateContributionMargin(
    recommendedSalesPrice,
    rawMaterials ?? [],
    quantityProduced
  );

  const fixedCosts = calculateTotalOverheadCost(overheadExpenses ?? []);
  const variableCostPerUnit = new Decimal(
    calculateTotalRawMaterialCost(rawMaterials ?? [])
  )
    .dividedBy(quantityProduced)
    .toNumber();
  const profitRange = calculateProfitRange(
    fixedCosts,
    variableCostPerUnit,
    recommendedSalesPrice,
    quantityProduced
  );

  const totalManufacturingCost = new Decimal(manufacturingCostPerUnit)
    .times(quantityProduced)
    .toNumber();

  return {
    manufacturingCostPerUnit,
    recommendedSalesPrice,
    breakEvenPoint,
    profitPerUnit,
    totalPotentialProfit,
    marginOfSafety,
    contributionMargin,
    profitRange,
    totalManufacturingCost,
  };
};
