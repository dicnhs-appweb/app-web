import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {ChartConfig, ChartContainer} from '@/components/ui/chart'
import {formatCurrency} from '@/features/auth/utils/format-currency'
import {MinusIcon, TrendingDown, TrendingUp} from 'lucide-react'
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ProfitMarginSettings,
  ProfitRangePoint,
} from '../../computations/types/product.schema'

const chartConfig: ChartConfig = {
  totalRevenue: {label: 'Total Revenue', color: 'hsl(215, 70%, 60%)'},
  totalCost: {label: 'Total Cost', color: 'hsl(0, 70%, 60%)'},
  profit: {label: 'Profit', color: 'hsl(145, 70%, 60%)'},
}

interface ProfitRangeChartProps {
  profitRange: ProfitRangePoint[]
  totalCost: number
  totalRevenue: number
  maxQuantity: number
  expectedSales: number
  breakEvenPoint: number
  profitMarginSettings: ProfitMarginSettings
  quantityProduced: number
}

export function ProfitRangeChart({
  profitRange,
  totalCost,
  totalRevenue,
  maxQuantity,
  expectedSales,
  breakEvenPoint,
  profitMarginSettings,
  quantityProduced,
}: ProfitRangeChartProps) {
  const safeData = profitRange || []
  const safeMaxQuantity = maxQuantity || 0
  const safeExpectedSales = expectedSales || 0
  const safeBreakEvenPoint = breakEvenPoint || 0

  const minQuantity = 0
  const adjustedMaxQuantity = Math.max(safeMaxQuantity, safeExpectedSales * 1.2)

  const revenuePerUnit = totalRevenue / safeExpectedSales

  const completeData = safeData.map(point => ({
    ...point,
    totalRevenue: point.quantity * revenuePerUnit,
    totalCost: totalCost,
    profit: point.quantity * revenuePerUnit - totalCost,
  }))

  const profitAtExpectedSales =
    completeData.find(d => d.quantity === safeExpectedSales)?.profit || 0

  if (completeData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Profit Analysis Chart</CardTitle>
          <CardDescription>No data available for chart</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  interface TooltipProps {
    active?: boolean
    payload?: Array<{
      name: string
      value: number
      color: string
    }>
    label?: string
  }

  const CustomTooltip: React.FC<TooltipProps> = ({active, payload, label}) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white border rounded shadow">
          <p className="font-bold">Quantity: {label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{color: entry.color}}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const calculateProfitStatus = () => {
    const costPerUnit = totalCost / quantityProduced
    let salesPrice: number
    let profitPerUnit: number

    if (profitMarginSettings.calculationType === 'cost-plus') {
      salesPrice = costPerUnit * (1 + profitMarginSettings.profitValue / 100)
      profitPerUnit = salesPrice - costPerUnit
    } else {
      salesPrice = costPerUnit + profitMarginSettings.profitValue
      profitPerUnit = profitMarginSettings.profitValue
    }

    const totalRevenue = salesPrice * expectedSales
    const totalProfit = totalRevenue - totalCost
    const profitMargin =
      totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
    const utilizationRate =
      quantityProduced > 0 ? (expectedSales / quantityProduced) * 100 : 0
    const breakEvenPoint = totalCost / profitPerUnit

    const getStatusDetails = () => {
      if (totalProfit > 0) {
        if (profitMargin > 20 && utilizationRate >= 80) {
          return {
            color: 'text-green-600',
            icon: <TrendingUp className="w-5 h-5" />,
            text: `High Profitability: ${profitMargin.toFixed(1)}% margin, ${utilizationRate.toFixed(1)}% utilization`,
            description: `Excellent performance with high profit margin and efficient production utilization.`,
          }
        } else if (profitMargin > 10 || utilizationRate >= 70) {
          return {
            color: 'text-blue-600',
            icon: <TrendingUp className="w-5 h-5" />,
            text: `Profitable: ${profitMargin.toFixed(1)}% margin, ${utilizationRate.toFixed(1)}% utilization`,
            description: `Good performance, but there's room for improvement in ${profitMargin <= 10 ? 'profit margin' : 'production utilization'}.`,
          }
        } else {
          return {
            color: 'text-yellow-600',
            icon: <TrendingUp className="w-5 h-5" />,
            text: `Marginally Profitable: ${profitMargin.toFixed(1)}% margin, ${utilizationRate.toFixed(1)}% utilization`,
            description: `Positive but low profitability. Consider optimizing costs or increasing prices.`,
          }
        }
      } else if (totalProfit === 0) {
        return {
          color: 'text-yellow-600',
          icon: <MinusIcon className="w-5 h-5" />,
          text: `Break-even: No profit or loss, ${utilizationRate.toFixed(1)}% utilization`,
          description: `Revenue exactly covers costs. Aim to increase sales or reduce costs for profitability.`,
        }
      } else {
        const lossPercentage = Math.abs(profitMargin)
        if (lossPercentage > 20) {
          return {
            color: 'text-red-600',
            icon: <TrendingDown className="w-5 h-5" />,
            text: `Significant Loss: ${lossPercentage.toFixed(1)}% negative margin, ${utilizationRate.toFixed(1)}% utilization`,
            description: `Urgent action needed. Review pricing strategy and cost structure.`,
          }
        } else {
          return {
            color: 'text-orange-600',
            icon: <TrendingDown className="w-5 h-5" />,
            text: `Operating at Loss: ${lossPercentage.toFixed(1)}% negative margin, ${utilizationRate.toFixed(1)}% utilization`,
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
        Expected Sales: ${expectedSales} units
        Quantity Produced: ${quantityProduced} units
        ${
          expectedSales > quantityProduced
            ? 'Potential underproduction or high demand.'
            : expectedSales < quantityProduced
              ? 'Potential overproduction or weak demand.'
              : 'Production matches expected sales.'
        }
      `,
    }
  }

  const status = calculateProfitStatus()

  return (
    <div className="flex flex-col gap-2">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profit Analysis</CardTitle>
          <CardDescription className="text-base">
            Comprehensive view of Revenue, Costs, and Profitability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart
                data={completeData}
                margin={{top: 20, right: 30, left: 20, bottom: 20}}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="quantity"
                  type="number"
                  domain={[minQuantity, adjustedMaxQuantity]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                >
                  <Label value="Quantity" position="insideBottom" offset={-5} />
                </XAxis>
                <YAxis tickFormatter={formatCurrency}>
                  <Label
                    value="Amount (₱)"
                    angle={-90}
                    position="insideLeft"
                    offset={15}
                  />
                </YAxis>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke={chartConfig.totalRevenue.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{r: 5}}
                />
                <Line
                  type="monotone"
                  dataKey="totalCost"
                  stroke={chartConfig.totalCost.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{r: 5}}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke={chartConfig.profit.color}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{r: 5}}
                  strokeDasharray="5 5"
                />
                <ReferenceLine
                  x={safeBreakEvenPoint}
                  stroke="gray"
                  strokeDasharray="3 3"
                  label={{value: 'Break-even Point', position: 'top'}}
                >
                  <Label
                    value={`${safeBreakEvenPoint.toFixed(2)}`}
                    position="insideBottomRight"
                  />
                </ReferenceLine>
                <ReferenceLine
                  x={safeExpectedSales}
                  stroke="blue"
                  strokeDasharray="3 3"
                  label={{value: 'Expected Sales', position: 'top'}}
                >
                  <Label
                    value={`${safeExpectedSales.toFixed(2)}`}
                    position="insideBottomRight"
                  />
                </ReferenceLine>
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="p-6">
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">
              Key Performance Indicators
            </h4>
            <div
              className={`flex items-center gap-2 ${status?.color ?? 'text-gray-600'}`}
            >
              {status?.icon ?? <MinusIcon className="w-5 h-5" />}
              <span className="font-medium">
                {status?.text ?? 'Status unavailable'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard
              title="Break-even Point"
              value={`${safeBreakEvenPoint.toFixed(2)} units`}
              description="Quantity at which total costs equal total revenue"
            />
            <KpiCard
              title="Expected Sales"
              value={`${safeExpectedSales.toFixed(2)} units`}
              description="Projected sales volume based on market analysis"
            />
            <KpiCard
              title="Profit at Expected Sales"
              value={formatCurrency(profitAtExpectedSales)}
              description="Estimated profit at the expected sales volume"
            />
          </div>
          <div className="pt-2 text-sm text-gray-600">
            <p>
              <strong>Analysis:</strong>{' '}
              {status?.description ?? 'Analysis unavailable'}
            </p>
            <p>{status?.additionalInfo ?? ''}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

const KpiCard = ({
  title,
  value,
  description,
}: {title: string; value: string; description: string}) => (
  <div className="p-3 bg-white rounded-lg shadow">
    <h5 className="text-sm font-medium text-gray-500">{title}</h5>
    <p className="mt-1 text-xl font-semibold">{value}</p>
    <p className="mt-1 text-xs text-gray-600">{description}</p>
  </div>
)
