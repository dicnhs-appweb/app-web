import {
  OverheadExpense,
  RawMaterial,
} from '@/features/auth/product/create/computations/types/product.schema';
import Decimal from 'decimal.js';

export function calculateTotalRawMaterialCost(
  rawMaterials: RawMaterial[]
): number {
  return rawMaterials
    .reduce((totalCost, {costPerUnit, totalUnits}) => {
      return totalCost.plus(new Decimal(costPerUnit).times(totalUnits));
    }, new Decimal(0))
    .toDecimalPlaces(2)
    .toNumber();
}

export function calculateTotalOverheadCost(
  overheadExpenses: OverheadExpense[]
): number {
  return overheadExpenses
    .reduce((totalCost, {costPerUnit, totalUnits}) => {
      return totalCost.plus(new Decimal(costPerUnit).times(totalUnits));
    }, new Decimal(0))
    .toDecimalPlaces(2)
    .toNumber();
}
