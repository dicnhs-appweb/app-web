export type calculationType = "percentage" | "fixed";

export interface ProductType {
  productName: string;
  manufacturingCostPerUnit: number;
  profitMarginSettings: ProfitMarginSettings;
  recommendedRetailPrice: number;
  productionForecast: ProductionForecast;
  rawMaterials: RawMaterial[];
  overheadExpenses: OverheadExpense[];
}

export interface OverheadExpense {
  expenseCategory: string;
  costPerUnit: number;
}

export interface ProductionForecast {
  maximumUnitsProducible: number;
  productionConstraint: string | undefined;
}

export interface ProfitMarginSettings {
  calculationType: calculationType;
  percentageValue: number;
}

export interface RawMaterial {
  ingredientName: string;
  stockOnHand: number;
  quantityNeededPerUnit: number;
  costPerUnit: number;
}
