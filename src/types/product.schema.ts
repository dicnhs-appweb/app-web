import * as z from 'zod';

export const OverheadExpenseSchema = z.object({
  expenseName: z.string(),
  totalUnits: z.number().min(0, 'Total units must be a positive number'),
  costPerUnit: z.number().min(0, 'Cost per unit must be a positive number'),
});
export type OverheadExpense = z.infer<typeof OverheadExpenseSchema>;

export const ProfitMarginSettingsSchema = z.object({
  calculationType: z.enum(['cost-plus', 'fixed-markup']),
  profitValue: z.number().min(0),
});

export type ProfitMarginSettings = z.infer<typeof ProfitMarginSettingsSchema>;

export const RawMaterialSchema = z.object({
  materialName: z.string(),
  totalUnits: z.number().min(0, 'Total units must be a positive number'),
  costPerUnit: z.number().min(0, 'Cost per unit must be a positive number'),
});
export type RawMaterial = z.infer<typeof RawMaterialSchema>;

export const ComputationResultSchema = z.object({
  manufacturingCostPerUnit: z.number(),
  recommendedRetailPrice: z.number(),
  breakEvenPoint: z.number(),
  profitPerUnit: z.number(),
  totalPotentialProfit: z.number(),
  marginOfSafety: z.number(),
  contributionMargin: z.number(),
});
export type ComputationResult = z.infer<typeof ComputationResultSchema>;

export const ProductZodSchema = z.object({
  productName: z.string(),
  profitMarginSettings: ProfitMarginSettingsSchema,
  desiredProductionQuantity: z
    .number()
    .min(0, 'Desired production quantity must be a non-negative number'),
  expectedSales: z
    .number()
    .min(0, 'Expected sales must be a non-negative number'),
  rawMaterials: z.array(RawMaterialSchema).optional(),
  overheadExpenses: z.array(OverheadExpenseSchema).optional(),
  computationResult: ComputationResultSchema.optional(),
});
export type ProductSchema = z.infer<typeof ProductZodSchema>;
