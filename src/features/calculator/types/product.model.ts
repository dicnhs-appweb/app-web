import * as z from 'zod';

// Cost Schemas
export const CostInfo = z.object({
  name: z.string().min(1, 'Item name is required'),
  quantity: z.number().min(0, 'Quantity must be a non-negative number'),
  unitCost: z.number().min(0, 'Unit cost must be a non-negative number'),
  unitType: z.string().min(1, 'Unit type is required'),
});

// Pricing Strategy Schema
export const PricingStrategy = z.object({
  method: z.enum(['cost-plus', 'fixed-price']),
  targetValue: z.number().min(0, 'Target value must be a non-negative number'),
});

// Profit Scenario Schema
export const ProfitScenario = z.object({
  salesVolume: z.number().min(0),
  profit: z.number(),
});

// Financial Analysis Result Schema
export const FinancialAnalysisResult = z.object({
  // Cost-related metrics
  unitCost: z.number(),
  totalCost: z.number(),
  totalDirectCost: z.number(),
  totalIndirectCost: z.number(),
  // Pricing metrics
  recommendedPrice: z.number(),
  // Break-even analysis
  breakEvenPoint: z.number(),
  // Profitability metrics
  contributionMargin: z.number(),
  contributionMarginRatio: z.number(),
  // Risk and sensitivity metrics
  operatingLeverage: z.number(),
  // Scenario analysis
  profitScenarios: z.array(ProfitScenario),
});

// Product Schema
export const ProductPricingModel = z
  .object({
    productName: z.string().min(1, 'Product name is required'),
    pricingStrategy: PricingStrategy,
    plannedProductionQuantity: z
      .number()
      .min(0, 'Planned production must be a non-negative number'),
    forecastedSalesQuantity: z
      .number()
      .min(0, 'Forecasted sales must be a non-negative number'),
    directCosts: z.array(CostInfo).optional(),
    indirectCosts: z.array(CostInfo).optional(),
  })
  .refine(
    data => data.forecastedSalesQuantity <= data.plannedProductionQuantity,
    {
      message: 'Forecasted sales cannot exceed planned production',
      path: ['forecastedSales'],
    }
  );

// Type exports
export type CostInfo = z.infer<typeof CostInfo>;
export type DirectCost = z.infer<typeof CostInfo>;
export type IndirectCost = z.infer<typeof CostInfo>;
export type ProfitScenario = z.infer<typeof ProfitScenario>;
export type PricingStrategy = z.infer<typeof PricingStrategy>;

export type ProductPricingModel = z.infer<typeof ProductPricingModel>;
export type FinancialAnalysisResult = z.infer<typeof FinancialAnalysisResult>;
