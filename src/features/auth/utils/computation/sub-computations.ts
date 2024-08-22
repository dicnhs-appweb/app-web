import {OverheadExpense, RawMaterial} from '@/types/product.schema';
import Decimal from 'decimal.js';

function calculateTotalRawMaterialCost(rawMaterials: RawMaterial[]): number {
  if (!Array.isArray(rawMaterials) || rawMaterials.length === 0) {
    return 0;
  }
  let totalCost = new Decimal(0);
  for (const {costPerUnit, totalUnits} of rawMaterials) {
    totalCost = totalCost.plus(new Decimal(costPerUnit).times(totalUnits));
  }
  return totalCost.toDecimalPlaces(2).toNumber();
}

function calculateTotalOverheadCost(
  overheadExpenses: OverheadExpense[]
): number {
  if (!Array.isArray(overheadExpenses) || overheadExpenses.length === 0) {
    return 0;
  }
  let totalCost = new Decimal(0);
  for (const {costPerUnit, totalUnits} of overheadExpenses) {
    totalCost = totalCost.plus(new Decimal(costPerUnit).times(totalUnits));
  }
  return totalCost.toDecimalPlaces(2).toNumber();
}

export {calculateTotalOverheadCost, calculateTotalRawMaterialCost};
