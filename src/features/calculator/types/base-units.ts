import { z } from 'zod';

const UnitSchema = z.object({
  value: z.string(),
  label: z.string()
});

const CategorySchema = z.object({
  category: z.enum(['Weight', 'Volume', 'Count', 'Packaging']),
  units: z.array(UnitSchema)
});

const BaseUnitsSchema = z.array(CategorySchema);

export const baseUnits = [
  {
    category: 'Weight',
    units: [
      { value: 'kg', label: 'Kilograms (kg)' },
      { value: 'g', label: 'Grams (g)' },
      { value: 'mg', label: 'Milligrams (mg)' },
      { value: 'lb', label: 'Pounds (lb)' },
      { value: 'oz', label: 'Ounces (oz)' },
    ],
  },
  {
    category: 'Volume',
    units: [
      { value: 'l', label: 'Liters (L)' },
      { value: 'ml', label: 'Milliliters (mL)' },
      { value: 'fl_oz', label: 'Fluid Ounces (fl oz)' },
      { value: 'cup', label: 'Cups' },
      { value: 'tbsp', label: 'Tablespoons' },
      { value: 'tsp', label: 'Teaspoons' },
    ],
  },
  {
    category: 'Count',
    units: [
      { value: 'pcs', label: 'Pieces' },
      { value: 'dozen', label: 'Dozen' },
    ],
  },
  {
    category: 'Packaging',
    units: [
      { value: 'pack', label: 'Pack' },
      { value: 'box', label: 'Box' },
      { value: 'bag', label: 'Bag' },
      { value: 'can', label: 'Can' },
      { value: 'bottle', label: 'Bottle' },
      { value: 'jar', label: 'Jar' },
    ],
  },
] as const;

// Validate the baseUnits array
BaseUnitsSchema.parse(baseUnits);

// Export the type for baseUnits
export type BaseUnits = typeof baseUnits;

// Export a type for a single unit
export type BaseUnit = BaseUnits[number]['units'][number];