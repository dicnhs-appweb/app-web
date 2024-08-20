import {
  OverheadExpense,
  ProductSchema,
  RawMaterial,
} from '@/types/product.schema';
import {create} from 'zustand';

interface ProductStore {
  product: ProductSchema;
  setProduct: (product: Partial<ProductSchema>) => void;
  addRawMaterial: (rawMaterial: RawMaterial) => void;
  updateRawMaterial: (index: number, rawMaterial: Partial<RawMaterial>) => void;
  removeRawMaterial: (index: number) => void;
  addOverheadExpense: (expense: OverheadExpense) => void;
  updateOverheadExpense: (
    index: number,
    expense: Partial<OverheadExpense>
  ) => void;
  removeOverheadExpense: (index: number) => void;
}

export const useProductStore = create<ProductStore>()(set => ({
  product: {
    productName: 'Cookies',
    profitMarginSettings: {percentageValue: 0, calculationType: 'percentage'},
    rawMaterials: [
      {
        costPerUnit: 25,
        ingredientName: 'Sugar',
        quantityNeededPerUnit: 25,
        stockOnHand: 25,
      },
      {
        costPerUnit: 10,
        ingredientName: 'Flour',
        quantityNeededPerUnit: 15,
        stockOnHand: 20,
      },
      {
        ingredientName: 'Ingredient A',
        stockOnHand: 4187,
        quantityNeededPerUnit: 94,
        costPerUnit: 3.86,
      },
      {
        ingredientName: 'Ingredient A',
        stockOnHand: 8409,
        quantityNeededPerUnit: 8,
        costPerUnit: 8.65,
      },
      {
        ingredientName: 'Ingredient B',
        stockOnHand: 7163,
        quantityNeededPerUnit: 21,
        costPerUnit: 8.98,
      },
      {
        ingredientName: 'Ingredient B',
        stockOnHand: 1878,
        quantityNeededPerUnit: 89,
        costPerUnit: 3.34,
      },
      {
        ingredientName: 'Ingredient A',
        stockOnHand: 7862,
        quantityNeededPerUnit: 57,
        costPerUnit: 0.55,
      },
      {
        ingredientName: 'Ingredient B',
        stockOnHand: 1174,
        quantityNeededPerUnit: 58,
        costPerUnit: 5.73,
      },
    ],
    overheadExpenses: [
      {
        expenseCategory: 'Rent',
        costPerUnit: 7.11,
      },
      {
        expenseCategory: 'Utilities',
        costPerUnit: 0.35,
      },
      {
        expenseCategory: 'Utilities',
        costPerUnit: 6.75,
      },
      {
        expenseCategory: 'Utilities',
        costPerUnit: 4.18,
      },
      {
        expenseCategory: 'Rent',
        costPerUnit: 3.62,
      },
      {
        expenseCategory: 'Utilities',
        costPerUnit: 1.77,
      },
    ],
    manufacturingCostPerUnit: 0,
    recommendedRetailPrice: 0,
    productionForecast: {
      maximumUnitsProducible: 0,
      productionConstraint: undefined,
    },
  },
  setProduct: newProduct =>
    set(state => ({product: {...state.product, ...newProduct}})),
  addRawMaterial: rawMaterial =>
    set(state => ({
      product: {
        ...state.product,
        rawMaterials: [...state.product.rawMaterials, rawMaterial],
      },
    })),
  updateRawMaterial: (index, rawMaterial) =>
    set(state => ({
      product: {
        ...state.product,
        rawMaterials: state.product.rawMaterials.map((item, i) =>
          i === index ? {...item, ...rawMaterial} : item
        ),
      },
    })),
  removeRawMaterial: index =>
    set(state => ({
      product: {
        ...state.product,
        rawMaterials: state.product.rawMaterials.filter((_, i) => i !== index),
      },
    })),
  addOverheadExpense: expense =>
    set(state => ({
      product: {
        ...state.product,
        overheadExpenses: [...state.product.overheadExpenses, expense],
      },
    })),
  updateOverheadExpense: (index, expense) =>
    set(state => ({
      product: {
        ...state.product,
        overheadExpenses: state.product.overheadExpenses.map((item, i) =>
          i === index ? {...item, ...expense} : item
        ),
      },
    })),
  removeOverheadExpense: index =>
    set(state => ({
      product: {
        ...state.product,
        overheadExpenses: state.product.overheadExpenses.filter(
          (_, i) => i !== index
        ),
      },
    })),
}));
