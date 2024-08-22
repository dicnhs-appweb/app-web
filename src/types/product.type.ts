export type calculationType = 'percentage' | 'fixed';

export interface ProductType {
  // input
  productName: string;
  profitMarginSettings: ProfitMarginSettings;
  rawMaterials: RawMaterial[];
  overheadExpenses: OverheadExpense[];
  // output
  productionForecast?: ProductionForecast;
  recommendedRetailPrice?: number;
  manufacturingCostPerUnit?: number;
}

export interface OverheadExpense {
  expenseCategory: string;
  costPerUnit: number;
}

export interface ProfitMarginSettings {
  calculationType: calculationType;
  profitValue: number;
}

export interface RawMaterial {
  materialName: string;
  stockOnHand: number;
  quantityNeededPerUnit: number;
  costPerUnit: number;
}

export interface ProductionForecast {
  maximumUnitsProducible: number;
  productionConstraint: string | undefined;
}
