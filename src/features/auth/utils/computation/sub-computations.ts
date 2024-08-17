import { OverheadExpense, RawMaterial } from "@/types/product.schema";

function calculateTotalRawMaterialCost(rawMaterials: RawMaterial[]): number {
  return Number(
    rawMaterials
      .reduce(
        (total, { costPerUnit, quantityNeededPerUnit }) =>
          total + costPerUnit * quantityNeededPerUnit,
        0
      )
      .toFixed(2)
  );
}

function calculateTotalOverheadCost(
  overheadExpenses: OverheadExpense[],
  units: number
): number {
  return Number(
    overheadExpenses
      .reduce((total, { costPerUnit }) => total + costPerUnit * units, 0)
      .toFixed(2)
  );
}

export { calculateTotalOverheadCost, calculateTotalRawMaterialCost };
