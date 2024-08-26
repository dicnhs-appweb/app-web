import {useTheme} from '@/components/theme-provider'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Separator} from '@/components/ui/separator'
import {formatCurrency} from '@/features/calculator/lib/format-currency'
import {cn} from '@/lib/utils'
import {CalculatorIcon, RadicalIcon} from 'lucide-react'
import {metricColors} from '../lib/utils'
import {
  FinancialAnalysisResult,
  ProductPricingModel,
} from '../types/product.model'

interface MetricCardProps {
  title: string
  value: number | string
  description: string
  explanation: string
  calculation: string
  formula: string
  colorClass: string
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  explanation,
  calculation,
  formula,
  colorClass,
}) => {
  const {theme} = useTheme()
  const isDarkMode = theme === 'dark' || theme === 'system'

  return (
    <Card className="h-full p-6 space-y-3">
      <div className="flex flex-col gap-2">
        <h3
          className={cn(
            'text-md',
            isDarkMode ? 'text-gray-200' : 'text-gray-800'
          )}
        >
          {title}
        </h3>
        <p className={cn('text-3xl font-bold', colorClass)}>
          {title === 'Margin of Safety'
            ? `${value}%`
            : title === 'Break-Even Point'
              ? `${value} units`
              : `${typeof value === 'number' ? formatCurrency(value) : value}`}
        </p>
      </div>
      <div>
        <p
          className={cn(
            'mb-2 text-sm',
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          )}
        >
          <span className="font-medium">What?</span> {description}
        </p>
        <p
          className={cn(
            'mb-2 text-sm',
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          )}
        >
          <span className="font-medium">Why?</span> {explanation}
        </p>
        <Separator className="my-4" />
        <div className="flex flex-col gap-2">
          <div>
            <p
              className={cn(
                'inline-flex text-sm',
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              )}
            >
              <RadicalIcon className="w-4 h-4 mr-1" />
              <p>Formula</p>
            </p>
            <p className="text-sm">{formula}</p>
          </div>
          <div>
            <p
              className={cn(
                'inline-flex text-sm',
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              )}
            >
              <CalculatorIcon className="w-4 h-4 mr-1" />
              <p>Calculation</p>
            </p>
            <p className="text-sm">{calculation}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

interface FinancialMetricsDashboardProps {
  result: FinancialAnalysisResult | null
  input: Partial<ProductPricingModel>
}

const FinancialMetrics: React.FC<FinancialMetricsDashboardProps> = ({
  result,
  input,
}) => {
  const {theme} = useTheme()
  const isDarkMode = theme === 'dark' || theme === 'system'

  if (!result) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Computation Result
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={cn(
              'text-center',
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            )}
          >
            Fill in all required fields to see the computation result.
          </p>
        </CardContent>
      </Card>
    )
  }

  const metricsData = [
    {
      title: 'Unit Cost',
      value: result.unitCost,
      description: 'The total cost to produce one unit of your product.',
      explanation:
        'Understanding this helps you set a price that ensures profitability.',
      formula: 'Total Cost / Planned Production Quantity',
      calculation: `${formatCurrency(result.totalCost)} / ${input.plannedProductionQuantity} = ${formatCurrency(result.unitCost)}`,
      colorClass: cn(metricColors.unitCost(result.unitCost)),
    },
    {
      title: 'Recommended Price',
      value: result.recommendedPrice,
      description: 'The suggested selling price based on your chosen strategy.',
      explanation: 'This balances profitability with market competitiveness.',
      formula: 'Depends on pricing strategy (cost-plus or fixed-price)',
      calculation: `Based on ${input.pricingStrategy?.method} method with target value of ${input.pricingStrategy?.targetValue}`,
      colorClass: cn(
        metricColors.recommendedPrice(result.recommendedPrice, result.unitCost)
      ),
    },
    {
      title: 'Break-Even Point',
      value: result.breakEvenPoint,
      description: 'The number of units you need to sell to cover all costs.',
      explanation: 'This shows when your venture starts generating profit.',
      formula: 'Total Fixed Costs / (Price - Variable Cost per Unit)',
      calculation: `Calculated based on cost structure and recommended price`,
      colorClass: cn(
        metricColors.breakEvenPoint(
          result.breakEvenPoint,
          input.forecastedSalesQuantity || 0
        )
      ),
    },
    {
      title: 'Contribution Margin',
      value: result.contributionMargin,
      description:
        'The amount each unit contributes towards covering fixed costs and profit.',
      explanation:
        'Helps in making decisions about pricing and cost management.',
      formula: 'Price - Variable Cost per Unit',
      calculation: `${formatCurrency(result.recommendedPrice)} - Variable Cost = ${formatCurrency(result.contributionMargin)}`,
      colorClass: cn(
        metricColors.contributionMargin(
          result.contributionMargin,
          result.recommendedPrice
        )
      ),
    },
    {
      title: 'Contribution Margin Ratio',
      value: result.contributionMarginRatio,
      description:
        'The percentage of each sale that goes towards fixed costs and profit.',
      explanation:
        'Indicates how efficiently your product generates profit from sales.',
      formula: '(Contribution Margin / Price) * 100',
      calculation: `(${formatCurrency(result.contributionMargin)} / ${formatCurrency(result.recommendedPrice)}) * 100 = ${(result.contributionMarginRatio * 100).toFixed(2)}%`,
      colorClass: cn(
        metricColors.contributionMarginRatio(result.contributionMarginRatio)
      ),
    },
    {
      title: 'Operating Leverage',
      value: result.operatingLeverage,
      description: 'How changes in sales affect your profit.',
      explanation:
        'Higher values mean your profit is more sensitive to sales fluctuations.',
      formula: 'Contribution Margin / Operating Income',
      calculation: `Calculated based on contribution margin and operating income`,
      colorClass: cn(metricColors.operatingLeverage(result.operatingLeverage)),
    },
  ]

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        {metricsData.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  )
}

FinancialMetrics.displayName = 'FinancialMetrics'

export default FinancialMetrics
