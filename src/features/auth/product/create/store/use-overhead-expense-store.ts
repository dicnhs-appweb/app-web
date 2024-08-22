import {OverheadExpense} from '@/types/product.schema';
import {create} from 'zustand';

interface OverheadExpensesState {
  overheadExpenses: OverheadExpense[];
  addOverheadExpense: (overheadExpense: OverheadExpense) => void;
  updateOverheadExpense: (
    index: number,
    updatedOverheadExpense: OverheadExpense
  ) => void;
  removeOverheadExpense: (index: number) => void;
  clearOverheadExpenses: () => void;
}

export const useOverheadExpensesStore = create<OverheadExpensesState>(set => ({
  overheadExpenses: [],
  addOverheadExpense: overheadExpense =>
    set(state => ({
      overheadExpenses: [...state.overheadExpenses, overheadExpense],
    })),
  updateOverheadExpense: (index, updatedOverheadExpense) =>
    set(state => ({
      overheadExpenses: state.overheadExpenses.map((expense, i) =>
        i === index ? updatedOverheadExpense : expense
      ),
    })),
  removeOverheadExpense: index =>
    set(state => ({
      overheadExpenses: state.overheadExpenses.filter((_, i) => i !== index),
    })),
  clearOverheadExpenses: () => set({overheadExpenses: []}),
}));
