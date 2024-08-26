import {ReactNode} from 'react';
import {FinancialAnalysisResult, ProductPricingModel} from './product.model';

export interface AnalysisChartProps {
  financialAnalysis: FinancialAnalysisResult;
  product: ProductPricingModel;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{name: string; value: number; color: string}>;
  label?: string;
}

export interface KpiCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
}

export interface StatusDetails {
  color: string;
  icon: ReactNode;
  text: string;
  description: string;
  additionalInfo?: string;
}

export interface ChartDataPoint {
  salesVolume: number;
  totalRevenue: number;
  totalCost: number;
  variableCost: number;
  profit: number;
}

export interface ChartProps {
  data: ChartDataPoint[];
  minQuantity: number;
  maxQuantity: number;
  marginOfSafetyStart: number;
  marginOfSafetyEnd: number;
  maxYValue: number;
}

export interface ProfitStatusCalculationProps {
  totalRevenue: number;
  totalProfit: number;
  profitMargin: number;
  utilizationRate: number;
  breakEvenPoint: number;
  forecastedSalesQuantity: number;
  plannedProductionQuantity: number;
}

export interface ChartConfigProps {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  chartProps: ChartProps;
  breakEvenPoint: number;
  forecastedSalesQuantity: number;
  chartConfig: ChartConfig;
}

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}
