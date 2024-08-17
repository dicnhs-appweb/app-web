import {
  OverheadExpense,
  ProductSchema,
  ProfitMarginSettings,
  RawMaterial,
} from "./product.schema";

export type calculateManufacturingCostPerUnit = (
  rawMaterials: RawMaterial[],
  overheadExpenses: OverheadExpense[]
) => number;

export type calculateRecommendedRetailPrice = (
  manufacturingCostPerUnit: number,
  profitMarginSettings: ProfitMarginSettings
) => number;

export type calculateMaximumUnitsProducible = (
  rawMaterials: RawMaterial[]
) => number;

export type calculateTotalRawMaterialCost = (
  rawMaterials: RawMaterial[]
) => number;

export type calculateTotalOverheadCost = (
  overheadExpenses: OverheadExpense[],
  units: number
) => number;

export type calculateProfitMargin = (
  recommendedRetailPrice: number,
  manufacturingCostPerUnit: number
) => ProfitMarginSettings;

export type validateProductSchema = (product: ProductSchema) => boolean;
