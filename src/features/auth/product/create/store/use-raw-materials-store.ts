import {create} from 'zustand';
import {RawMaterial} from '../computations/types/product.schema';

interface RawMaterialsState {
  rawMaterials: RawMaterial[];
  addRawMaterial: (rawMaterial: RawMaterial) => void;
  updateRawMaterial: (index: number, updatedRawMaterial: RawMaterial) => void;
  removeRawMaterial: (index: number) => void;
  clearRawMaterials: () => void;
}

export const useRawMaterialsStore = create<RawMaterialsState>(set => ({
  rawMaterials: [],
  addRawMaterial: rawMaterial =>
    set(state => ({
      rawMaterials: [...state.rawMaterials, rawMaterial],
    })),
  updateRawMaterial: (index, updatedRawMaterial) =>
    set(state => ({
      rawMaterials: state.rawMaterials.map((material, i) =>
        i === index ? updatedRawMaterial : material
      ),
    })),
  removeRawMaterial: index =>
    set(state => ({
      rawMaterials: state.rawMaterials.filter((_, i) => i !== index),
    })),
  clearRawMaterials: () => set({rawMaterials: []}),
}));
