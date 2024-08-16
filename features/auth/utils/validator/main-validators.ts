import { ProductSchema } from "@/types/product.schema";
import {
  isValidNumber,
  isValidOverheadExpenses,
  isValidProductionForecast,
  isValidProfitMarginSettings,
  isValidRawMaterials,
  isValidString,
} from "./input-validators";

function validateProductSchema(product: ProductSchema): boolean {
  const {
    productName,
    manufacturingCostPerUnit,
    profitMarginSettings,
    recommendedRetailPrice,
    productionForecast,
    rawMaterials,
    overheadExpenses,
  } = product;

  return (
    isValidString(productName) &&
    isValidNumber(manufacturingCostPerUnit) &&
    isValidProfitMarginSettings(profitMarginSettings) &&
    isValidNumber(recommendedRetailPrice) &&
    isValidProductionForecast(productionForecast) &&
    isValidRawMaterials(rawMaterials) &&
    isValidOverheadExpenses(overheadExpenses)
  );
}

export default validateProductSchema;
