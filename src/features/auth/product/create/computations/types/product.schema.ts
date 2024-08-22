import * as z from 'zod';

// Raw Material Schema
export const RawMaterialSchema = z.object({
  materialName: z.string(),
  totalUnits: z.number().min(0, 'Total units must be a positive number'),
  costPerUnit: z.number().min(0, 'Cost per unit must be a positive number'),
});
export type RawMaterial = z.infer<typeof RawMaterialSchema>;

// Overhead Expense Schema
export const OverheadExpenseSchema = z.object({
  expenseName: z.string(),
  totalUnits: z.number().min(0, 'Total units must be a positive number'),
  costPerUnit: z.number().min(0, 'Cost per unit must be a positive number'),
});
export type OverheadExpense = z.infer<typeof OverheadExpenseSchema>;

// Profit Margin Settings Schema
export const ProfitMarginSettingsSchema = z.object({
  calculationType: z.enum(['cost-plus', 'fixed-markup']),
  profitValue: z.number().min(0),
});
export type ProfitMarginSettings = z.infer<typeof ProfitMarginSettingsSchema>;

// Profit Range Point Schema
export const ProfitRangePointSchema = z.object({
  quantity: z.number(),
  profit: z.number(),
});
export type ProfitRangePoint = z.infer<typeof ProfitRangePointSchema>;

// Computation Result Schema
export const ComputationResultSchema = z.object({
  manufacturingCostPerUnit: z.number(),
  recommendedSalesPrice: z.number(),
  breakEvenPoint: z.number(),
  profitPerUnit: z.number(),
  totalPotentialProfit: z.number(),
  marginOfSafety: z.number(),
  contributionMargin: z.number(),
  profitRange: z.array(ProfitRangePointSchema),
  totalManufacturingCost: z.number(),
});
export type ComputationResult = z.infer<typeof ComputationResultSchema>;

// Product Schema
export const ProductZodSchema = z
  .object({
    productName: z.string(),
    profitMarginSettings: ProfitMarginSettingsSchema,
    quantityProduced: z
      .number()
      .min(0, 'Desired production quantity must be a non-negative number'),
    expectedSales: z
      .number()
      .min(0, 'Expected sales must be a non-negative number'),
    rawMaterials: z.array(RawMaterialSchema).optional(),
    overheadExpenses: z.array(OverheadExpenseSchema).optional(),
    computationResult: ComputationResultSchema.optional(),
  })
  .refine(
    data =>
      data.expectedSales <= data.quantityProduced || data.expectedSales >= 0,
    {
      message: 'Expected sales cannot exceed desired production quantity',
      path: ['expectedSales'],
    }
  );
export type ProductSchema = z.infer<typeof ProductZodSchema>;
