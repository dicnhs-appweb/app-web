import {useTheme} from '@/components/theme-provider'
import {motion} from 'framer-motion'
import {MinusIcon, Percent, TrendingDown, TrendingUp} from 'lucide-react'
import React, {useMemo} from 'react'
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import colors from 'tailwindcss/colors'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {ChartContainer} from '@/components/ui/chart'
import {Separator} from '@/components/ui/separator'
import {formatCurrency} from '@/features/calculator/lib/format-currency'
import {useBreakpoint} from '@/hooks/use-breakpoint'
import Decimal from 'decimal.js'
import {
  FinancialAnalysisResult,
  ProductPricingModel,
} from '../../types/product.model'
import {
  AnalysisChartProps,
  ChartConfig,
  ChartConfigProps,
  ChartProps,
  CustomTooltipProps,
  KpiCardProps,
  ProfitStatusCalculationProps,
  StatusDetails,
} from '../../types/profit-analysis-chart.types'

const chartConfig: ChartConfig = {
  totalRevenue: {label: 'Sales Revenue', color: colors.green[700]},
  totalCost: {label: 'Total Cost', color: colors.red[700]},
  profit: {label: 'Profit', color: colors.blue[700]},
  variableCost: {label: 'Variable Cost', color: colors.orange[700]},
  fixedCost: {label: 'Fixed Cost', color: colors.gray[700]},
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload?.length) return null

  const roundedLabel = Math.round(Number(label))

  return (
    <div className="p-2 border rounded shadow bg-card">
      <p className="font-bold">Quantity: {roundedLabel}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{color: entry.color}}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  )
}

const calculateChartProps = (
  financialAnalysis: FinancialAnalysisResult,
  product: ProductPricingModel
): ChartProps => {
  const {totalIndirectCost, totalDirectCost, recommendedPrice, breakEvenPoint} =
    financialAnalysis
  const {plannedProductionQuantity, forecastedSalesQuantity} = product

  const maxQuantity = Math.max(
    plannedProductionQuantity,
    forecastedSalesQuantity
  )
  const xAxisOffset = Math.ceil(maxQuantity * 0.2)
  const adjustedMaxQuantity = maxQuantity + xAxisOffset

  const unitVariableCost = new Decimal(totalDirectCost)
    .dividedBy(plannedProductionQuantity)
    .toNumber()

  const completeData = Array.from({length: adjustedMaxQuantity + 1}, (_, i) => {
    const salesVolume = i
    const totalRevenue = new Decimal(recommendedPrice)
      .times(salesVolume)
      .toNumber()
    const totalCost = new Decimal(totalIndirectCost)
      .plus(new Decimal(unitVariableCost).times(salesVolume))
      .toNumber()
    const variableCost = new Decimal(unitVariableCost)
      .times(salesVolume)
      .toNumber()
    const profit = new Decimal(totalRevenue).minus(totalCost).toNumber()

    return {
      salesVolume,
      totalRevenue,
      totalCost,
      variableCost,
      profit,
      fixedCost: totalIndirectCost,
    }
  })

  const maxYValue = Math.max(
    ...completeData.map(d =>
      Math.max(d.totalRevenue, d.totalCost, d.profit, d.variableCost)
    )
  )

  return {
    data: completeData,
    minQuantity: 0,
    maxQuantity: adjustedMaxQuantity,
    marginOfSafetyStart: breakEvenPoint,
    marginOfSafetyEnd: forecastedSalesQuantity,
    maxYValue,
  }
}

const calculateProfitStatus = ({
  totalProfit,
  profitMargin,
  utilizationRate,
  breakEvenPoint,
  forecastedSalesQuantity,
  plannedProductionQuantity,
}: ProfitStatusCalculationProps): StatusDetails => {
  const getStatusDetails = (): StatusDetails => {
    if (totalProfit > 0) {
      if (profitMargin > 20 && utilizationRate >= 80) {
        return {
          color: 'text-green-800',
          icon: <TrendingUp className="w-5 h-5 mr-2" />,
          text: `High Profitability: ${profitMargin.toFixed(1)}% margin, ${utilizationRate.toFixed(1)}% utilization`,
          description: `Excellent performance with high profit margin and efficient production utilization.`,
        }
      } else if (profitMargin > 10 || utilizationRate >= 70) {
        return {
          color: 'text-blue-800',
          icon: <TrendingUp className="w-5 h-5 mr-2" />,
          text: `Profitable: ${profitMargin.toFixed(1)}% margin, ${utilizationRate.toFixed(1)}% utilization`,
          description: `Good performance, but there's room for improvement in ${profitMargin <= 10 ? 'profit margin' : 'production utilization'}.`,
        }
      } else {
        return {
          color: 'text-yellow-800',
          icon: <TrendingUp className="w-5 h-5 mr-2" />,
          text: `Marginally Profitable: ${profitMargin.toFixed(1)}% margin, ${utilizationRate.toFixed(1)}% utilization`,
          description: `Positive but low profitability. Consider optimizing costs or increasing prices.`,
        }
      }
    } else if (totalProfit === 0) {
      return {
        color: 'text-yellow-800',
        icon: <MinusIcon className="w-5 h-5 mr-2" />,
        text: `Break-even: No profit or loss, ${utilizationRate.toFixed(1)}% utilization`,
        description: `Revenue exactly covers costs. Aim to increase sales or reduce costs for profitability.`,
      }
    } else {
      const lossPercentage = Math.abs(profitMargin)
      if (lossPercentage > 20) {
        return {
          color: 'text-red-800',
          icon: <TrendingDown className="w-5 h-5 mr-2" />,
          text: `Significant Loss: ${lossPercentage.toFixed(1)}% Negative margin with ${utilizationRate.toFixed(1)}% Utilization`,
          description: `Urgent action needed. Review pricing strategy and cost structure.`,
        }
      } else {
        return {
          color: 'text-orange-800',
          icon: <TrendingDown className="w-5 h-5 mr-2" />,
          text: `Operating at Loss: ${lossPercentage.toFixed(1)}% Negative margin with ${utilizationRate.toFixed(1)}% Utilization`,
          description: `Revenue not covering costs. Optimize operations or revise pricing.`,
        }
      }
    }
  }

  const status = getStatusDetails()

  return {
    ...status,
    additionalInfo: `
      Break-even Point: ${breakEvenPoint.toFixed(2)} units
      Expected Sales: ${forecastedSalesQuantity} units
      Quantity Produced: ${plannedProductionQuantity} units
      ${
        forecastedSalesQuantity > plannedProductionQuantity
          ? 'Potential underproduction or high demand.'
          : forecastedSalesQuantity < plannedProductionQuantity
            ? 'Potential overproduction or weak demand.'
            : 'Production matches expected sales.'
      }
    `,
  }
}

const calculateOptimalTickCount = (min: number, max: number) => {
  const range = max - min
  const optimalTickSpacing = Math.pow(10, Math.floor(Math.log10(range)))
  const calculatedTickCount = Math.ceil(range / optimalTickSpacing)
  return Math.max(5, Math.min(calculatedTickCount, 15))
}

const KpiCard: React.FC<KpiCardProps> = ({title, value, description, icon}) => (
  <div>
    <CardHeader className="flex flex-row items-center justify-between pb-0 space-y-0">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </div>
)

const StatusCard: React.FC<{status: StatusDetails}> = ({status}) => (
  <Card className={`mt-4 rounded-lg p-6 ${status?.color ?? ''}`}>
    <div className="flex items-center mb-3 space-x-2">
      {status?.icon ?? <MinusIcon className="w-5 h-5" />}
      <h3 className="text-lg font-semibold">
        {status?.text ?? 'Status unavailable'}
      </h3>
    </div>

    <p className="text-sm font-medium">Detailed Analysis:</p>
    <p className="text-sm">
      {status?.text ?? 'Status unavailable'}.{' '}
      {status?.description ?? 'Analysis unavailable'}
    </p>
    {status?.additionalInfo && (
      <div className="mt-2 text-sm">
        <p className="font-medium">Key Insights:</p>
        <ul className="mt-1 space-y-1 list-disc list-inside">
          {status.additionalInfo
            .split('\n')
            .filter(line => line.trim() !== '')
            .map((line, index) => (
              <li key={index}>{line.trim()}</li>
            ))}
        </ul>
      </div>
    )}
  </Card>
)

const KpiGrid: React.FC<{
  breakEvenPoint: number
  forecastedSalesQuantity: number
  profitAtExpectedSales: number
  contributionMarginRatio: number
  operatingLeverage: number
}> = ({
  breakEvenPoint,
  forecastedSalesQuantity,
  profitAtExpectedSales,
  contributionMarginRatio,
  operatingLeverage,
}) => (
  <Card className="grid grid-cols-1">
    <KpiCard
      title="Break-even Point"
      value={`${breakEvenPoint.toFixed(2)} units`}
      description="Quantity at which total costs equal Sales Revenue"
      icon={<MinusIcon className="w-6 h-6 text-muted-foreground" />}
    />
    <Separator />
    <KpiCard
      title="Expected Sales"
      value={`${forecastedSalesQuantity} units`}
      description="Projected sales volume based on your expectations"
      icon={<TrendingUp className="w-6 h-6 text-muted-foreground" />}
    />
    <Separator />
    <KpiCard
      title="Profit at Expected Sales"
      value={formatCurrency(profitAtExpectedSales)}
      description="Estimated profit at the expected sales volume"
      icon={<TrendingUp className="w-6 h-6 text-muted-foreground" />}
    />
    <Separator />
    <KpiCard
      title="Contribution Margin Ratio"
      value={`${(contributionMarginRatio * 100).toFixed(2)}%`}
      description="Percentage of sales contributing to fixed costs and profit"
      icon={<Percent className="w-5 h-5" />}
    />
    <Separator />
    <KpiCard
      title="Operating Leverage"
      value={operatingLeverage.toFixed(2)}
      description="Sensitivity of profit to changes in sales volume"
      icon={<TrendingUp className="w-5 h-5" />}
    />
  </Card>
)

const ProfitAnalysisChart: React.FC<ChartConfigProps> = ({
  isMobile,
  isTablet,
  chartProps,
  breakEvenPoint,
  forecastedSalesQuantity,
  chartConfig,
}) => {
  const {theme} = useTheme()
  const isDarkMode = theme === 'dark' || theme === 'system'

  const margin = isMobile
    ? {top: 5, right: 10, left: 10, bottom: 5}
    : isTablet
      ? {top: 10, right: 15, left: 30, bottom: 10}
      : {top: 20, right: 20, left: 40, bottom: 20}

  const gridColor = isDarkMode ? colors.neutral[700] : colors.neutral[300]
  const textColor = isDarkMode ? colors.neutral[300] : colors.neutral[700]

  return (
    <ChartContainer
      config={chartConfig}
      className="w-full min-h-[75vh] md:min-h-auto"
    >
      <LineChart data={chartProps.data} margin={margin}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="salesVolume"
          type="number"
          domain={[0, chartProps.maxQuantity]}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickCount={
            isMobile ? 5 : calculateOptimalTickCount(0, chartProps.maxQuantity)
          }
          allowDataOverflow={true}
          allowDecimals={false}
          stroke={textColor}
        >
          {!isMobile && (
            <Label
              value="Quantity Produced"
              position="insideBottom"
              offset={-10}
              style={{fill: textColor}}
            />
          )}
        </XAxis>
        <YAxis
          tickFormatter={formatCurrency}
          label={
            isMobile
              ? undefined
              : {
                  value: 'Amount (₱)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: -30,
                  style: {fill: textColor},
                }
          }
          stroke={textColor}
        />
        <Tooltip
          content={<CustomTooltip />}
          contentStyle={{
            backgroundColor: isDarkMode ? colors.neutral[800] : colors.white,
            color: textColor,
          }}
        />
        <Legend
          verticalAlign={isMobile ? 'bottom' : 'top'}
          height={36}
          wrapperStyle={{color: textColor}}
        />
        {Object.entries(chartConfig).map(([key, config]) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            name={config.label}
            stroke={config.color}
            strokeWidth={1}
            dot={false}
            activeDot={{r: 4}}
            strokeDasharray={
              key === 'variableCost' || key === 'fixedCost' ? '3 3' : undefined
            }
          />
        ))}
        <ReferenceArea
          x1={chartProps.marginOfSafetyStart}
          x2={chartProps.marginOfSafetyEnd}
          y1={0}
          y2={chartProps.maxYValue}
          fill={`url(#${forecastedSalesQuantity > breakEvenPoint ? 'positiveMarginGradient' : 'negativeMarginGradient'})`}
          fillOpacity={0.2}
        >
          <Label
            value={
              forecastedSalesQuantity > breakEvenPoint
                ? 'Margin of Safety'
                : 'Negative Margin'
            }
            position="insideTop"
            offset={isMobile ? 40 : 20}
            fill={textColor}
          />
        </ReferenceArea>
        <defs>
          <linearGradient
            id="positiveMarginGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor={colors.green[400]} stopOpacity={1} />
            <stop offset="100%" stopColor={colors.green[400]} stopOpacity={0} />
          </linearGradient>
          <linearGradient
            id="negativeMarginGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor={colors.red[400]} stopOpacity={1} />
            <stop offset="100%" stopColor={colors.red[400]} stopOpacity={0} />
          </linearGradient>
        </defs>
        <ReferenceLine
          x={breakEvenPoint}
          stroke={isDarkMode ? colors.gray[500] : colors.gray[400]}
          strokeDasharray="3 3"
          label={{
            value: isMobile
              ? `B.E: ${breakEvenPoint.toFixed(0)} units`
              : `Break-even: ${breakEvenPoint.toFixed(0)} units`,
            position: 'insideBottomLeft',
            fill: textColor,
            fontSize: 12,
            dy: -10,
          }}
        />
        <ReferenceLine
          x={forecastedSalesQuantity}
          stroke={isDarkMode ? colors.blue[400] : colors.blue[500]}
          strokeDasharray="3 3"
          label={{
            value: isMobile
              ? `E.S: ${forecastedSalesQuantity.toFixed(2)}`
              : `Expected Sales: ${forecastedSalesQuantity.toFixed(2)}`,
            position: isMobile ? 'insideTopRight' : 'insideBottomLeft',
            fill: textColor,
            fontSize: 12,
            dy: isMobile ? 0 : -30,
          }}
        />
      </LineChart>
    </ChartContainer>
  )
}

export function AnalysisChart({
  financialAnalysis,
  product,
}: AnalysisChartProps) {
  const {isMobile, isTablet, isDesktop} = useBreakpoint()

  const {
    totalIndirectCost,
    totalDirectCost,
    recommendedPrice,
    breakEvenPoint,
    profitScenarios,
    contributionMarginRatio,
    operatingLeverage,
  } = financialAnalysis

  const {plannedProductionQuantity, forecastedSalesQuantity} = product

  const chartProps = useMemo(
    () => calculateChartProps(financialAnalysis, product),
    [financialAnalysis, product]
  )

  const profitAtExpectedSales = useMemo(() => {
    const expectedSalesScenario = profitScenarios.find(
      s => s.salesVolume === forecastedSalesQuantity
    )
    return expectedSalesScenario ? expectedSalesScenario.profit : 0
  }, [profitScenarios, forecastedSalesQuantity])

  const status = useMemo(() => {
    const totalRevenue = recommendedPrice * forecastedSalesQuantity
    const totalProfit = totalRevenue - totalIndirectCost - totalDirectCost
    const profitMargin =
      totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
    const utilizationRate =
      plannedProductionQuantity > 0
        ? (forecastedSalesQuantity / plannedProductionQuantity) * 100
        : 0

    return calculateProfitStatus({
      totalRevenue,
      totalProfit,
      profitMargin,
      utilizationRate,
      breakEvenPoint,
      forecastedSalesQuantity,
      plannedProductionQuantity,
    })
  }, [
    recommendedPrice,
    forecastedSalesQuantity,
    totalIndirectCost,
    totalDirectCost,
    plannedProductionQuantity,
    breakEvenPoint,
  ])

  if (chartProps.data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profit Analysis Chart</CardTitle>
          <CardDescription>No data available for chart</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5}}
      className="flex flex-col"
    >
      <Card className="w-full overflow-hidden md:h-auto">
        <CardHeader>
          <CardTitle>Profit Analysis Chart</CardTitle>
          <CardDescription>
            This chart shows the sales revenue, total cost, and profit for each
            quantity. The shaded area represents the Margin of Safety.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfitAnalysisChart
            isMobile={isMobile}
            isTablet={isTablet}
            isDesktop={isDesktop}
            chartProps={chartProps}
            breakEvenPoint={breakEvenPoint}
            forecastedSalesQuantity={forecastedSalesQuantity}
            chartConfig={chartConfig}
          />
        </CardContent>
      </Card>
      <div className="space-y-4 overflow-hidden">
        <StatusCard status={status} />
        <KpiGrid
          breakEvenPoint={breakEvenPoint}
          forecastedSalesQuantity={forecastedSalesQuantity}
          profitAtExpectedSales={profitAtExpectedSales}
          contributionMarginRatio={contributionMarginRatio}
          operatingLeverage={operatingLeverage}
        />
      </div>
    </motion.div>
  )
}
