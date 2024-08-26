import {z} from 'zod';

export const RequiredProductDataSchema = z.object({
  directCosts: z.array(z.any()).nonempty(),
  indirectCosts: z.array(z.any()).nonempty(),
  plannedProductionQuantity: z.number().positive(),
  forecastedSalesQuantity: z.number().positive(),
  pricingStrategy: z.object({
    method: z.enum(['cost-plus', 'target-return']),
    targetValue: z.number().positive(),
  }),
});
