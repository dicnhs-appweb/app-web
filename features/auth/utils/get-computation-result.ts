import { ProductSchema } from "@/types/product.schema";
import { ProfitMarginSettings } from "@/types/product.type";
import {
  calculateManufacturingCostPerUnit,
  calculateMaximumUnitsProducible,
  calculateProfitMargin,
  calculateRecommendedRetailPrice,
} from "./computation/product-computations";
import validateProductSchema from "./validator/main-validators";

export type ComputationResult = {
  manufacturingCostPerUnit: number;
  recommendedRetailPrice: number;
  maximumUnitsProducible: number;
  profitMargin: ProfitMarginSettings;
};

export const getComputationResult = (
  product: ProductSchema
): ComputationResult => {
  if (!validateProductSchema(product)) {
    throw new Error("Invalid product schema");
  }

  const { rawMaterials, overheadExpenses, profitMarginSettings } = product;

  const manufacturingCostPerUnit = calculateManufacturingCostPerUnit(
    rawMaterials,
    overheadExpenses
  );
  const recommendedRetailPrice = calculateRecommendedRetailPrice(
    manufacturingCostPerUnit,
    profitMarginSettings
  );
  const maximumUnitsProducible = calculateMaximumUnitsProducible(rawMaterials);
  const profitMargin = calculateProfitMargin(
    recommendedRetailPrice,
    manufacturingCostPerUnit
  );

  return {
    manufacturingCostPerUnit,
    recommendedRetailPrice,
    maximumUnitsProducible,
    profitMargin,
  };
};
