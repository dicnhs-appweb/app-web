import {
  OverheadExpense,
  ProductSchema,
  ProfitMarginSettings,
  RawMaterial,
} from "@/types/product.schema";

function isValidString(value: string): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidNumber(value: number): boolean {
  return typeof value === "number" && !isNaN(value) && value >= 0;
}

function isValidProfitMarginSettings(settings: ProfitMarginSettings): boolean {
  const { calculationType, percentageValue } = settings;
  return (
    (calculationType === "percentage" || calculationType === "fixed") &&
    isValidNumber(percentageValue)
  );
}

function isValidProductionForecast(
  forecast: ProductSchema["productionForecast"]
): boolean {
  const { maximumUnitsProducible, productionConstraint } = forecast;
  return (
    isValidNumber(maximumUnitsProducible ?? 0) &&
    isValidString(productionConstraint ?? "")
  );
}

function isValidRawMaterials(materials: RawMaterial[]): boolean {
  return materials.every(
    ({ ingredientName, stockOnHand, quantityNeededPerUnit, costPerUnit }) =>
      isValidString(ingredientName) &&
      isValidNumber(stockOnHand) &&
      isValidNumber(quantityNeededPerUnit) &&
      isValidNumber(costPerUnit)
  );
}

function isValidOverheadExpenses(expenses: OverheadExpense[]): boolean {
  return expenses.every(
    ({ expenseCategory, costPerUnit }) =>
      isValidString(expenseCategory) && isValidNumber(costPerUnit)
  );
}

export {
  isValidNumber,
  isValidOverheadExpenses,
  isValidProductionForecast,
  isValidProfitMarginSettings,
  isValidRawMaterials,
  isValidString
};
