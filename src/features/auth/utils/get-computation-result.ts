import {ComputationResult, ProductSchema} from '@/types/product.schema';
import {
  calculateBreakEvenPoint,
  calculateContributionMargin,
  calculateManufacturingCostPerUnit,
  calculateMarginOfSafety,
  calculateProfitPerUnit,
  calculateRecommendedRetailPrice,
  calculateTotalPotentialProfit,
} from './computation/product-computations';

export const getComputationResult = (
  product: ProductSchema
): ComputationResult => {
  const {rawMaterials, overheadExpenses, profitMarginSettings, expectedSales} =
    product;

  const manufacturingCostPerUnit = calculateManufacturingCostPerUnit(
    rawMaterials,
    overheadExpenses
  );
  const recommendedRetailPrice = calculateRecommendedRetailPrice(
    manufacturingCostPerUnit,
    profitMarginSettings
  );
  const breakEvenPoint = calculateBreakEvenPoint(
    overheadExpenses,
    rawMaterials,
    recommendedRetailPrice
  );
  const profitPerUnit = calculateProfitPerUnit(
    recommendedRetailPrice,
    manufacturingCostPerUnit
  );
  const marginOfSafety = calculateMarginOfSafety(expectedSales, breakEvenPoint);
  const totalPotentialProfit = calculateTotalPotentialProfit(
    profitPerUnit,
    expectedSales
  );
  const contributionMargin = calculateContributionMargin(
    recommendedRetailPrice,
    rawMaterials
  );

  return {
    manufacturingCostPerUnit,
    recommendedRetailPrice,
    breakEvenPoint,
    profitPerUnit,
    totalPotentialProfit,
    marginOfSafety,
    contributionMargin,
  };
};
