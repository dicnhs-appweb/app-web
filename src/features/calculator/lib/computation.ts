import {
  CostInfo,
  DirectCost,
  FinancialAnalysisResult,
  IndirectCost,
  PricingStrategy,
  ProductPricingModel,
  ProfitScenario,
} from '../types/product.model';

import Decimal from 'decimal.js';
import memoize from 'lodash/memoize';

const calculateTotalCost = (costs: CostInfo[]): number => {
  return costs
    .reduce(
      (total, cost) =>
        total.plus(new Decimal(cost.quantity).times(cost.unitCost)),
      new Decimal(0)
    )
    .toNumber();
};

export function calculateUnitCost(
  directCosts: DirectCost[],
  indirectCosts: IndirectCost[],
  plannedProductionQuantity: number
): number {
  const totalDirectCost = calculateTotalCost(directCosts);
  const totalIndirectCost = calculateTotalCost(indirectCosts);
  const unitDirectCost = new Decimal(totalDirectCost)
    .dividedBy(plannedProductionQuantity)
    .toDecimalPlaces(2)
    .toNumber();
  const unitIndirectCost = new Decimal(totalIndirectCost)
    .dividedBy(plannedProductionQuantity)
    .toDecimalPlaces(2)
    .toNumber();
  const totalUnitCost = new Decimal(unitDirectCost)
    .plus(unitIndirectCost)
    .toDecimalPlaces(2)
    .toNumber();

  return totalUnitCost;
}

export function calculateRecommendedPrice(
  unitCost: number,
  pricingStrategy: PricingStrategy
): number {
  const cost = new Decimal(unitCost);
  const targetValue = new Decimal(pricingStrategy.targetValue);

  const price =
    pricingStrategy.method === 'cost-plus'
      ? cost.times(Decimal.sum(1, targetValue.dividedBy(100)))
      : cost.plus(targetValue);

  return price.toDecimalPlaces(2).toNumber();
}

export function calculateBreakEvenPoint(
  totalIndirectCost: number,
  unitPrice: number,
  unitVariableCost: number
): number {
  const contributionMarginPerUnit = new Decimal(unitPrice).minus(
    unitVariableCost
  );
  if (contributionMarginPerUnit.isZero()) {
    throw new Error('Contribution margin per unit cannot be zero');
  }
  return new Decimal(totalIndirectCost)
    .dividedBy(contributionMarginPerUnit)
    .ceil()
    .toNumber();
}

export function calculateContributionMargin(
  unitPrice: number,
  unitVariableCost: number
): number {
  return new Decimal(unitPrice)
    .minus(unitVariableCost)
    .toDecimalPlaces(2)
    .toNumber();
}

export function calculateContributionMarginRatio(
  contributionMargin: number,
  unitPrice: number
): number {
  return new Decimal(contributionMargin)
    .dividedBy(unitPrice)
    .toDecimalPlaces(4)
    .toNumber();
}

export function calculateOperatingLeverage(
  quantity: number,
  contributionMargin: number,
  fixedOperatingCosts: number
): number {
  const totalContributionMargin = new Decimal(quantity).times(
    contributionMargin
  );
  if (totalContributionMargin.equals(fixedOperatingCosts)) {
    return 0;
  }
  return totalContributionMargin
    .dividedBy(totalContributionMargin.minus(fixedOperatingCosts))
    .abs()
    .toDecimalPlaces(2)
    .toNumber();
}

export const calculateProfitScenarios = memoize(
  (
    fixedCosts: number,
    unitVariableCost: number,
    unitPrice: number,
    maxQuantity: number
  ): ProfitScenario[] => {
    const scenarios: ProfitScenario[] = [];
    const minStepSize = 1;
    const maxStepSize = Math.max(1, Math.floor(maxQuantity / 50));
    let stepSize = minStepSize;

    for (
      let salesVolume = 0;
      salesVolume <= maxQuantity;
      salesVolume += stepSize
    ) {
      const totalRevenue = new Decimal(unitPrice).times(salesVolume);
      const totalCost = new Decimal(fixedCosts).plus(
        new Decimal(unitVariableCost).times(salesVolume)
      );
      const profit = totalRevenue.minus(totalCost);
      scenarios.push({salesVolume, profit: profit.toNumber()});

      // Adjust step size dynamically
      if (scenarios.length > 50) {
        stepSize = Math.min(stepSize * 2, maxStepSize);
      }
    }

    // Ensure the last point is always included
    if (scenarios[scenarios.length - 1].salesVolume !== maxQuantity) {
      const totalRevenue = new Decimal(unitPrice).times(maxQuantity);
      const totalCost = new Decimal(fixedCosts).plus(
        new Decimal(unitVariableCost).times(maxQuantity)
      );
      const profit = totalRevenue.minus(totalCost);
      scenarios.push({salesVolume: maxQuantity, profit: profit.toNumber()});
    }

    return scenarios;
  },
  (...args: [number, number, number, number]) => JSON.stringify(args)
);

export function performFinancialAnalysis(
  product: ProductPricingModel
): FinancialAnalysisResult | undefined {
  const result = ProductPricingModel.safeParse(product);

  if (!result.success) {
    return undefined;
  }

  const unitCost = calculateUnitCost(
    product.directCosts || [],
    product.indirectCosts || [],
    product.plannedProductionQuantity
  );

  const recommendedPrice = calculateRecommendedPrice(
    unitCost,
    product.pricingStrategy
  );

  const totalDirectCost = calculateTotalCost(product.directCosts || []);
  const totalIndirectCost = calculateTotalCost(product.indirectCosts || []);

  const unitVariableCost = new Decimal(totalDirectCost)
    .dividedBy(product.plannedProductionQuantity)
    .toNumber();

  const breakEvenPoint = calculateBreakEvenPoint(
    totalIndirectCost,
    recommendedPrice,
    unitVariableCost
  );

  const contributionMargin = calculateContributionMargin(
    recommendedPrice,
    unitVariableCost
  );
  const contributionMarginRatio = calculateContributionMarginRatio(
    contributionMargin,
    recommendedPrice
  );

  const totalCost = new Decimal(totalIndirectCost)
    .plus(new Decimal(unitVariableCost).times(product.forecastedSalesQuantity))
    .toNumber();

  const operatingLeverage = calculateOperatingLeverage(
    product.forecastedSalesQuantity,
    contributionMargin,
    totalIndirectCost
  );

  const profitScenarios = calculateProfitScenarios(
    totalIndirectCost,
    unitVariableCost,
    recommendedPrice,
    Math.max(product.plannedProductionQuantity, product.forecastedSalesQuantity)
  );

  return {
    // cost-related metrics
    unitCost,
    totalCost,
    totalDirectCost,
    totalIndirectCost,
    // pricing metrics
    recommendedPrice,
    // break-even analysis
    breakEvenPoint,
    // profitability metrics
    contributionMargin,
    contributionMarginRatio,
    // risk and sensitivity metrics
    operatingLeverage,
    // scenario analysis
    profitScenarios,
  };
}
