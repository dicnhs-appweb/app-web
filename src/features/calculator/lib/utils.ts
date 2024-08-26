import {FinancialAnalysisResult} from '../types/product.model';

export function calculateFixedCosts(
  result: FinancialAnalysisResult | null
): number {
  if (!result) return 0;
  return Math.max(0, result.totalIndirectCost);
}

export function calculateMaxQuantity(
  forecastedSalesQuantity: number | undefined,
  plannedProductionQuantity: number | undefined
): number {
  const maxValue = Math.max(
    forecastedSalesQuantity ?? 0,
    plannedProductionQuantity ?? 0
  );
  return Math.max(1, maxValue * 1.5); // Ensure it's always at least 1
}

export const metricColors = {
  unitCost: (value: number) => {
    if (value <= 0.8) return 'text-green-600'; // Very Good
    if (value <= 1.0) return 'text-green-600'; // Good
    if (value <= 1.2) return 'text-yellow-600'; // Neutral
    if (value <= 1.4) return 'text-orange-600'; // Concerning
    return 'text-red-600'; // Bad
  },

  recommendedPrice: (value: number, unitCost: number) => {
    const markup = (value - unitCost) / unitCost;
    if (markup >= 0.3) return 'text-green-600';
    if (markup >= 0.2) return 'text-green-600';
    if (markup >= 0.1) return 'text-yellow-600';
    if (markup >= 0.05) return 'text-orange-600';
    return 'text-red-600';
  },

  breakEvenPoint: (value: number, forecastedSalesQuantity: number) => {
    const ratio = value / forecastedSalesQuantity;
    if (ratio <= 0.5) return 'text-green-600';
    if (ratio <= 0.7) return 'text-green-600';
    if (ratio <= 0.9) return 'text-yellow-600';
    if (ratio <= 1) return 'text-orange-600';
    return 'text-red-600';
  },

  contributionMargin: (value: number, recommendedPrice: number) => {
    const ratio = value / recommendedPrice;
    if (ratio >= 0.4) return 'text-green-600';
    if (ratio >= 0.3) return 'text-green-600';
    if (ratio >= 0.2) return 'text-yellow-600';
    if (ratio >= 0.1) return 'text-orange-600';
    return 'text-red-600';
  },

  contributionMarginRatio: (value: number) => {
    if (value >= 0.4) return 'text-green-600';
    if (value >= 0.3) return 'text-green-600';
    if (value >= 0.2) return 'text-yellow-600';
    if (value >= 0.1) return 'text-orange-600';
    return 'text-red-600';
  },

  operatingLeverage: (value: number) => {
    if (value <= 1.5) return 'text-green-600';
    if (value <= 2.0) return 'text-green-600';
    if (value <= 2.5) return 'text-yellow-600';
    if (value <= 3.0) return 'text-orange-600';
    return 'text-red-600';
  },
};
