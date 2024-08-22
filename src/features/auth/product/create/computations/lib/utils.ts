import {ComputationResult} from '../types/product.schema';

export function calculateFixedCosts(
  result: ComputationResult | null,
  quantityProduced: number | undefined
): number {
  if (!result || quantityProduced === undefined) return 0;
  return Math.max(
    0,
    result.totalManufacturingCost -
      result.manufacturingCostPerUnit * quantityProduced
  );
}

export function calculateMaxQuantity(
  expectedSales: number | undefined,
  quantityProduced: number | undefined
): number {
  const maxValue = Math.max(expectedSales ?? 0, quantityProduced ?? 0);
  return Math.max(1, maxValue * 1.5); // Ensure it's always at least 1
}
