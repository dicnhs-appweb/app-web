import {ProductZodSchema} from '@/types/product.schema';
import {z} from 'zod';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

type ProductFormState = z.infer<typeof ProductZodSchema>;

interface ProductFormStore {
  formState: ProductFormState;
  updateFormState: (newState: Partial<ProductFormState>) => void;
  resetFormState: () => void;
}

const initialState: ProductFormState = {
  productName: '',
  profitMarginSettings: {
    calculationType: 'cost-plus',
    profitValue: 0,
  },
  desiredProductionQuantity: 0,
  expectedSales: 0,
  rawMaterials: [],
  overheadExpenses: [],
};

export const useProductFormStore = create(
  persist<ProductFormStore>(
    set => ({
      formState: initialState,
      updateFormState: newState =>
        set(state => ({
          formState: {...state.formState, ...newState},
        })),
      resetFormState: () => set({formState: initialState}),
    }),
    {
      name: 'product-form-state',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
