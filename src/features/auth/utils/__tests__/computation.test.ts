import {ProductSchema} from '@/types/product.schema';
import * as productComputations from '../computation/product-computations';
import {getComputationResult} from '../get-computation-result';

jest.mock('../computation/sub-computations', () => ({
  calculateTotalOverheadCost: jest.fn().mockReturnValue(50),
  calculateTotalRawMaterialCost: jest.fn().mockReturnValue(100),
}));

const mockData = {
  basicProduct: {
    productName: 'Basic Product',
    profitMarginSettings: {
      calculationType:
        'fixed-markup' as ProductSchema['profitMarginSettings']['calculationType'],
      profitValue: 10,
    },
    desiredProductionQuantity: 1,
    expectedSales: 1,
    rawMaterials: [
      {materialName: 'Material A', totalUnits: 1, costPerUnit: 5},
      {materialName: 'Material B', totalUnits: 1, costPerUnit: 5},
    ],
    overheadExpenses: [{expenseName: 'Labor', totalUnits: 1, costPerUnit: 10}],
  },
  complexProduct: {
    productName: 'Complex Product',
    profitMarginSettings: {
      calculationType: 'fixed-markup' as const,
      profitValue: 50,
    },
    desiredProductionQuantity: 1000,
    expectedSales: 800,
    rawMaterials: [
      {materialName: 'Material X', totalUnits: 500, costPerUnit: 2.75},
      {materialName: 'Material Y', totalUnits: 200, costPerUnit: 5.5},
      {materialName: 'Material Z', totalUnits: 100, costPerUnit: 10.25},
    ],
    overheadExpenses: [
      {expenseName: 'Rent', totalUnits: 1, costPerUnit: 2000},
      {expenseName: 'Labor', totalUnits: 160, costPerUnit: 15},
      {expenseName: 'Utilities', totalUnits: 1, costPerUnit: 500},
    ],
  },
  edgeCaseProduct: {
    productName: 'Edge Case Product',
    profitMarginSettings: {
      calculationType: 'cost-plus' as const,
      profitValue: -10,
    },
    desiredProductionQuantity: 0,
    expectedSales: 0,
    rawMaterials: [],
    overheadExpenses: [],
  },
  noOverheadProduct: {
    productName: 'No Overhead Product',
    profitMarginSettings: {
      calculationType: 'fixed-markup' as const,
      profitValue: 20,
    },
    desiredProductionQuantity: 100,
    expectedSales: 80,
    rawMaterials: [
      {materialName: 'Material A', totalUnits: 100, costPerUnit: 5},
    ],
    overheadExpenses: [],
  },
  noRawMaterialProduct: {
    productName: 'No Raw Material Product',
    profitMarginSettings: {
      calculationType: 'fixed-markup' as const,
      profitValue: 30,
    },
    desiredProductionQuantity: 50,
    expectedSales: 40,
    rawMaterials: [],
    overheadExpenses: [{expenseName: 'Rent', totalUnits: 1, costPerUnit: 1000}],
  },
  highProfitMarginProduct: {
    productName: 'High Profit Margin Product',
    profitMarginSettings: {
      calculationType: 'fixed-markup' as const,
      profitValue: 1000,
    },
    desiredProductionQuantity: 10,
    expectedSales: 8,
    rawMaterials: [
      {materialName: 'Material A', totalUnits: 10, costPerUnit: 10},
    ],
    overheadExpenses: [{expenseName: 'Labor', totalUnits: 1, costPerUnit: 50}],
  },
  costPlusProduct: {
    productName: 'Cost Plus Product',
    profitMarginSettings: {
      calculationType: 'cost-plus' as const,
      profitValue: 25,
    },
    desiredProductionQuantity: 500,
    expectedSales: 400,
    rawMaterials: [
      {materialName: 'Material A', totalUnits: 500, costPerUnit: 2},
    ],
    overheadExpenses: [
      {expenseName: 'Labor', totalUnits: 100, costPerUnit: 10},
    ],
  },
};

const expectedResults = {
  basicProduct: {
    manufacturingCostPerUnit: 20,
    recommendedRetailPrice: 30,
    breakEvenPoint: 0.5,
    profitPerUnit: 10,
    totalPotentialProfit: 10,
    marginOfSafety: 50,
    contributionMargin: 20,
  },
  complexProduct: {
    manufacturingCostPerUnit: 5400,
    recommendedRetailPrice: 5450,
    breakEvenPoint: 0.99,
    profitPerUnit: 50,
    totalPotentialProfit: 50000,
    marginOfSafety: -19.95,
    contributionMargin: 4350,
  },
  edgeCaseProduct: {
    manufacturingCostPerUnit: 0,
    recommendedRetailPrice: 0,
    breakEvenPoint: 0,
    profitPerUnit: 0,
    totalPotentialProfit: 0,
    marginOfSafety: 0,
    contributionMargin: 0,
  },
  noOverheadProduct: {
    manufacturingCostPerUnit: 500,
    recommendedRetailPrice: 520,
    breakEvenPoint: 0,
    profitPerUnit: 20,
    totalPotentialProfit: 2000,
    marginOfSafety: 100,
    contributionMargin: 520,
  },
  noRawMaterialProduct: {
    manufacturingCostPerUnit: 1000,
    recommendedRetailPrice: 1030,
    breakEvenPoint: 33.33,
    profitPerUnit: 30,
    totalPotentialProfit: 1500,
    marginOfSafety: 16.67,
    contributionMargin: 1030,
  },
  highProfitMarginProduct: {
    manufacturingCostPerUnit: 150,
    recommendedRetailPrice: 1150,
    breakEvenPoint: 0.05,
    profitPerUnit: 1000,
    totalPotentialProfit: 10000,
    marginOfSafety: 99.94,
    contributionMargin: 1100,
  },
  costPlusProduct: {
    manufacturingCostPerUnit: 2000,
    recommendedRetailPrice: 2500,
    breakEvenPoint: 400,
    profitPerUnit: 500,
    totalPotentialProfit: 250000,
    marginOfSafety: 0,
    contributionMargin: 1500,
  },
};

describe('Product Computation Tests', () => {
  describe('getComputationResult', () => {
    it.each([
      ['basicProduct', mockData.basicProduct, expectedResults.basicProduct],
      [
        'complexProduct',
        mockData.complexProduct,
        expectedResults.complexProduct,
      ],
      [
        'edgeCaseProduct',
        mockData.edgeCaseProduct,
        expectedResults.edgeCaseProduct,
      ],
    ])(
      'should return correct computation result for %s',
      (_, product, expected) => {
        const result = getComputationResult(product as ProductSchema);
        expect(result).toEqual(expected);
      }
    );
  });

  describe('calculateManufacturingCostPerUnit', () => {
    it.each([
      [
        mockData.basicProduct.rawMaterials,
        mockData.basicProduct.overheadExpenses,
        1.5,
      ],
      [
        mockData.complexProduct.rawMaterials,
        mockData.complexProduct.overheadExpenses,
        1.5,
      ],
      [[], [], 0],
      [[{materialName: 'Test', totalUnits: 1, costPerUnit: 100}], [], 1],
      [[], [{expenseName: 'Test', totalUnits: 1, costPerUnit: 100}], 1],
    ])(
      'should calculate manufacturing cost correctly',
      (rawMaterials, overheadExpenses, expected) => {
        const result = productComputations.calculateManufacturingCostPerUnit(
          rawMaterials,
          overheadExpenses
        );
        expect(result).toBe(expected);
      }
    );
  });

  describe('calculateRecommendedRetailPrice', () => {
    it.each([
      [1.5, {calculationType: 'cost-plus' as const, profitValue: 20}, 1.8],
      [1.5, {calculationType: 'fixed-markup' as const, profitValue: 0.3}, 1.8],
      [100, {calculationType: 'cost-plus' as const, profitValue: 50}, 150],
      [100, {calculationType: 'fixed-markup' as const, profitValue: 50}, 150],
    ])(
      'should calculate retail price correctly',
      (cost, settings, expected) => {
        const result = productComputations.calculateRecommendedRetailPrice(
          cost,
          settings
        );
        expect(result).toBe(expected);
      }
    );
  });

  describe('calculateBreakEvenPoint', () => {
    it('should calculate break-even point correctly', () => {
      const result = productComputations.calculateBreakEvenPoint(
        mockData.basicProduct.overheadExpenses,
        mockData.basicProduct.rawMaterials,
        1.8
      );
      expect(result).toBe(62.5);
    });

    it('should throw an error when contribution margin is zero', () => {
      expect(() =>
        productComputations.calculateBreakEvenPoint(
          [{expenseName: 'Test', totalUnits: 1, costPerUnit: 1}],
          [{materialName: 'Test', totalUnits: 1, costPerUnit: 1}],
          1
        )
      ).toThrow();
    });
  });

  describe('calculateProfitPerUnit', () => {
    it.each([
      [1.8, 1.5, 0.3],
      [2, 1, 1],
      [1, 2, -1],
    ])(
      'should calculate profit per unit correctly',
      (price, cost, expected) => {
        const result = productComputations.calculateProfitPerUnit(price, cost);
        expect(result).toBe(expected);
      }
    );
  });

  describe('calculateTotalPotentialProfit', () => {
    it.each([
      [0.3, 80, 24],
      [1, 100, 100],
      [-0.5, 50, -25],
    ])(
      'should calculate total potential profit correctly',
      (profit, quantity, expected) => {
        const result = productComputations.calculateTotalPotentialProfit(
          profit,
          quantity
        );
        expect(result).toBe(expected);
      }
    );
  });

  describe('calculateMarginOfSafety', () => {
    it.each([
      [80, 62.5, 21.88],
      [100, 50, 50],
      [50, 50, 0],
      [0, 50, 0],
    ])(
      'should calculate margin of safety correctly',
      (sales, breakEven, expected) => {
        const result = productComputations.calculateMarginOfSafety(
          sales,
          breakEven
        );
        expect(result).toBeCloseTo(expected, 2);
      }
    );
  });

  describe('calculateContributionMargin', () => {
    it.each([
      [1.8, mockData.basicProduct.rawMaterials, 0.8],
      [2, [{materialName: 'Test', totalUnits: 1, costPerUnit: 1}], 1],
      [1, [{materialName: 'Test', totalUnits: 1, costPerUnit: 2}], -1],
    ])(
      'should calculate contribution margin correctly',
      (price, materials, expected) => {
        const result = productComputations.calculateContributionMargin(
          price,
          materials
        );
        expect(result).toBe(expected);
      }
    );
  });

  describe('Edge cases and error handling', () => {
    it.each([
      [Number.MAX_SAFE_INTEGER, 'should handle very large numbers'],
      [Number.MIN_VALUE, 'should handle very small numbers'],
      [-1, 'should handle negative numbers'],
    ])('calculateManufacturingCostPerUnit %s', input => {
      const result = productComputations.calculateManufacturingCostPerUnit(
        [{materialName: 'Test', totalUnits: input, costPerUnit: 1}],
        [{expenseName: 'Test', totalUnits: input, costPerUnit: 1}]
      );
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('Decimal precision', () => {
    it('should maintain precision in chain calculations', () => {
      const result = getComputationResult({
        ...mockData.basicProduct,
        rawMaterials: [
          {materialName: 'Test', totalUnits: 1, costPerUnit: 1 / 3},
        ],
        overheadExpenses: [
          {expenseName: 'Test', totalUnits: 1, costPerUnit: 1 / 3},
        ],
      });
      expect(result.manufacturingCostPerUnit).toBeCloseTo(2 / 3, 10);
    });
  });
});
