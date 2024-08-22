import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {OverheadExpenseAdd} from '@/features/auth/product/create/components/overhead-expense-add'
import {overheadExpenseColumns} from '@/features/auth/product/create/components/overhead-expense-table/columns'
import {OverheadExpenseDataTable} from '@/features/auth/product/create/components/overhead-expense-table/table'
import {RawMaterialAdd} from '@/features/auth/product/create/components/raw-material-add'
import {rawMaterialColumns} from '@/features/auth/product/create/components/raw-material-table/columns'
import {RawMaterialDataTable} from '@/features/auth/product/create/components/raw-material-table/table'
import {getComputationResult} from '@/features/auth/product/create/computations/product-computations'
import {
  ComputationResult,
  ProductSchema,
  ProductZodSchema,
} from '@/features/auth/product/create/computations/types/product.schema'
import {useOverheadExpensesStore} from '@/features/auth/product/create/store/use-overhead-expense-store'
import {useRawMaterialsStore} from '@/features/auth/product/create/store/use-raw-materials-store'
import {formatCurrency} from '@/features/auth/utils/format-currency'
import {zodResolver} from '@hookform/resolvers/zod'
import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {
  ArrowUp,
  ChevronLeft,
  Currency,
  ScaleIcon,
  TruckIcon,
} from 'lucide-react'
import {useEffect, useMemo} from 'react'
import {useForm} from 'react-hook-form'
import {z} from 'zod'

export const Route = createFileRoute('/_auth/product/create')({
  component: CreateView,
})

import {ProfitRangeChart} from '@/features/auth/product/create/components/chart/profit-range-chart'
import {
  calculateFixedCosts,
  calculateMaxQuantity,
} from '@/features/auth/product/create/computations/lib/utils'
import {calculateProfitRange} from '@/features/auth/product/create/computations/product-formula'
import {ProfitRangePoint} from '@/features/auth/product/create/computations/types/product.schema'
import {DollarSign, HelpCircle, Percent} from 'lucide-react'
import {useState} from 'react'

function CreateView() {
  const rawMaterials = useRawMaterialsStore(state => state.rawMaterials)
  const overheadExpenses = useOverheadExpensesStore(
    state => state.overheadExpenses
  )
  const newProductForm = useForm<z.infer<typeof ProductZodSchema>>({
    resolver: zodResolver(ProductZodSchema),
    defaultValues: {
      productName: '',
      profitMarginSettings: {
        calculationType: 'cost-plus',
        profitValue: 0,
      },
      quantityProduced: 0,
      expectedSales: 0,
      rawMaterials: [],
      overheadExpenses: [],
    },
  })

  const watchedFields = newProductForm.watch()

  const computationResult = useMemo(() => {
    if (
      watchedFields.productName &&
      watchedFields.profitMarginSettings.profitValue > 0 &&
      watchedFields.quantityProduced > 0 &&
      watchedFields.expectedSales > 0
    ) {
      return getComputationResult({
        ...watchedFields,
        rawMaterials,
        overheadExpenses,
      })
    }
    return null
  }, [watchedFields, rawMaterials, overheadExpenses])

  const profitRangeData = useMemo(() => {
    if (computationResult) {
      const fixedCosts = calculateFixedCosts(
        computationResult,
        watchedFields.quantityProduced
      )
      const maxQuantity = calculateMaxQuantity(
        watchedFields.expectedSales,
        watchedFields.quantityProduced
      )
      return calculateProfitRange(
        fixedCosts,
        computationResult.manufacturingCostPerUnit,
        computationResult.recommendedSalesPrice,
        maxQuantity
      )
    }
    return [] as ProfitRangePoint[]
  }, [
    computationResult,
    watchedFields.expectedSales,
    watchedFields.quantityProduced,
  ])

  useEffect(() => {
    if (computationResult) {
      newProductForm.setValue('computationResult', computationResult, {
        shouldDirty: false,
      })
    } else {
      newProductForm.setValue('computationResult', undefined, {
        shouldDirty: false,
      })
    }
  }, [computationResult, newProductForm])

  const onSave = (data: z.infer<typeof ProductZodSchema>) => {
    if (computationResult) {
      const updatedData: ProductSchema = {
        ...data,
        rawMaterials,
        overheadExpenses,
      }
      console.log('Form Data:', updatedData)
    }
  }

  const navigate = useNavigate()
  const clearRawMaterialsState = useRawMaterialsStore(
    state => state.clearRawMaterials
  )
  const clearOverheadExpensesState = useOverheadExpensesStore(
    state => state.clearOverheadExpenses
  )
  const discardForm = () => {
    newProductForm.reset()
    clearRawMaterialsState()
    clearOverheadExpensesState()
  }

  const [calculationType, setCalculationType] = useState<
    'cost-plus' | 'fixed-markup'
  >('cost-plus')

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Form {...newProductForm}>
          <form
            className="space-y-4"
            onSubmit={newProductForm.handleSubmit(onSave)}
          >
            <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
              <div className="flex flex-row items-center w-full gap-4">
                <Button
                  onClick={() =>
                    navigate({
                      to: '/dashboard',
                    })
                  }
                  size="sm"
                  variant="outline"
                  className="p-2"
                >
                  <ChevronLeft className="w-6 h-4" />
                </Button>
                <div className="flex flex-row items-center gap-2">
                  <CardTitle className="text-lg sm:text-2xl">
                    Profit Calculator
                  </CardTitle>
                  <span className="mb-1">
                    <Badge variant="outline">Saved</Badge>
                  </span>
                </div>
              </div>
              <div className="flex flex-row justify-end w-full gap-2 mt-2 sm:mt-0">
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={discardForm}
                >
                  Discard
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  className="w-full sm:w-auto"
                >
                  Save
                </Button>
              </div>
            </div>
            <Card className="p-6 space-y-2">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newProductForm.control}
                  name="productName"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newProductForm.control}
                  name="profitMarginSettings.profitValue"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Margin</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            min="0"
                            {...field}
                            onChange={e => {
                              const value = e.target.value
                              field.onChange(value ? parseFloat(value) : '')
                            }}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            {calculationType === 'cost-plus' ? (
                              <Percent className="w-4 h-4 text-gray-400" />
                            ) : (
                              <DollarSign className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={newProductForm.control}
                name="profitMarginSettings.calculationType"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Profit Calculation</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Select
                          onValueChange={value => {
                            field.onChange(value)
                            setCalculationType(
                              value as 'cost-plus' | 'fixed-markup'
                            )
                          }}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select profit margin type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cost-plus">Cost Plus</SelectItem>
                            <SelectItem value="fixed-markup">
                              Fixed Markup
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-8 pointer-events-none">
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newProductForm.control}
                  name="quantityProduced"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Quantity Produced</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min="0"
                          step="1"
                          {...field}
                          onChange={e => {
                            const value = e.target.value
                            field.onChange(value ? parseInt(value, 10) : '')
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newProductForm.control}
                  name="expectedSales"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Expected Sales</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min="0"
                          step="1"
                          {...field}
                          onChange={e => {
                            const value = e.target.value
                            field.onChange(value ? parseInt(value, 10) : '')
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
            {overheadExpenses.length > 0 && (
              <Card className="p-6 space-y-4">
                <div>
                  <div className="flex flex-row justify-between w-full text-sm font-medium">
                    <h3>Total Production Cost</h3>
                    <h3>
                      {formatCurrency(
                        newProductForm.getValues(
                          'computationResult.totalManufacturingCost'
                        )
                      )}
                    </h3>
                  </div>
                </div>
              </Card>
            )}
            <Card className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex flex-row items-baseline justify-between">
                  <h2 className="font-semibold text-md">Raw Materials</h2>
                  <RawMaterialAdd />
                </div>
              </div>
              <RawMaterialDataTable
                columns={rawMaterialColumns}
                data={rawMaterials}
              />
              {rawMaterials.length > 0 && (
                <div className="flex flex-row justify-between w-full text-sm font-medium">
                  <h3>Subtotal Raw Materials</h3>
                  <h3>
                    {formatCurrency(
                      rawMaterials.reduce(
                        (acc, curr) => acc + curr.totalUnits * curr.costPerUnit,
                        0
                      )
                    )}
                  </h3>
                </div>
              )}
            </Card>
            <Card className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex flex-row items-baseline justify-between">
                  <h2 className="font-semibold text-md">Overhead Expenses</h2>
                  <OverheadExpenseAdd />
                </div>
              </div>
              <OverheadExpenseDataTable
                columns={overheadExpenseColumns}
                data={overheadExpenses}
              />
              {overheadExpenses.length > 0 && (
                <div className="flex flex-row justify-between w-full text-sm font-medium">
                  <h3>Subtotal Expenses</h3>
                  <h3>
                    {formatCurrency(
                      overheadExpenses.reduce(
                        (acc, curr) => acc + curr.totalUnits * curr.costPerUnit,
                        0
                      )
                    )}
                  </h3>
                </div>
              )}
            </Card>
          </form>
        </Form>
        <div className="space-y-2">
          {computationResult && (
            <div>
              <ProfitRangeChart
                quantityProduced={newProductForm.getValues('quantityProduced')}
                profitMarginSettings={newProductForm.getValues(
                  'profitMarginSettings'
                )}
                profitRange={profitRangeData}
                totalCost={computationResult.totalManufacturingCost}
                totalRevenue={
                  computationResult.recommendedSalesPrice *
                  watchedFields.expectedSales
                }
                maxQuantity={calculateMaxQuantity(
                  watchedFields.expectedSales,
                  watchedFields.quantityProduced
                )}
                expectedSales={watchedFields.expectedSales}
                breakEvenPoint={computationResult.breakEvenPoint}
              />
            </div>
          )}

          <ComputationResultDisplay
            result={computationResult}
            expectedSales={newProductForm.getValues('expectedSales')}
            input={newProductForm.getValues()}
          />
        </div>
      </div>
    </div>
  )
}

export type MetricType = {
  title: string
  value: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  description: string
  formula: string
  computation: string
}

function ComputationResultDisplay({
  result,
  expectedSales,
  input,
}: {
  result: ComputationResult | null
  expectedSales: number
  input: Partial<ProductSchema>
}) {
  if (!result) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Computation Result
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">
            Fill in all required fields to see the computation result.
          </p>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (metric: string, value: number): string => {
    switch (metric) {
      case 'Production Cost Per Unit':
        return value <= 0.7 * result.recommendedSalesPrice
          ? 'text-green-600'
          : 'text-red-600'
      case 'Recommended Sale Price':
        return value >= 1.3 * result.manufacturingCostPerUnit &&
          value <= 1.5 * result.manufacturingCostPerUnit
          ? 'text-green-600'
          : 'text-yellow-600'
      case 'Break-Even Point':
        return value < 0.5 * expectedSales
          ? 'text-green-600'
          : value > 0.8 * expectedSales
            ? 'text-red-600'
            : 'text-yellow-600'
      case 'Profit Per Sale':
        return value >= 0.2 * result.recommendedSalesPrice
          ? 'text-green-600'
          : value < 0
            ? 'text-red-600'
            : 'text-yellow-600'
      case 'Total Potential Profit':
        return value > 0.2 * (result.recommendedSalesPrice * expectedSales)
          ? 'text-green-600'
          : value < 0
            ? 'text-red-600'
            : 'text-yellow-600'
      case 'Margin of Safety':
        return value >= 20
          ? 'text-green-600'
          : value < 10
            ? 'text-red-600'
            : 'text-yellow-600'
      case 'Contribution Margin':
        return value >= 0.3 * result.recommendedSalesPrice
          ? 'text-green-600'
          : value < 0
            ? 'text-red-600'
            : 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  const metrics: MetricType[] = [
    {
      title: 'Production Cost Per Unit',
      value: formatCurrency(result.manufacturingCostPerUnit),
      icon: TruckIcon,
      description:
        'The total cost of producing one unit, including raw materials, labor, and overhead expenses.',
      formula: 'Total Manufacturing Cost / Quantity Produced',
      computation: `${formatCurrency(result.totalManufacturingCost)} / ${input.quantityProduced} = ${formatCurrency(result.manufacturingCostPerUnit)}`,
    },
    {
      title: 'Recommended Sale Price',
      value: formatCurrency(result.recommendedSalesPrice),
      icon: Currency,
      description:
        'The suggested selling price per unit, based on the production cost and desired profit margin.',
      formula:
        'Production Cost Per Unit + (Production Cost Per Unit × Profit Margin)',
      computation: `${formatCurrency(result.manufacturingCostPerUnit)} + (${formatCurrency(result.manufacturingCostPerUnit)} × ${(input.profitMarginSettings?.profitValue ?? 0 / 100).toFixed(2)}) = ${formatCurrency(result.recommendedSalesPrice)}`,
    },
    {
      title: 'Break-Even Point',
      value: result.breakEvenPoint.toFixed(2),
      icon: ScaleIcon,
      description:
        'The number of units that need to be sold to cover all costs, where total revenue equals total expenses.',
      formula:
        'Total Fixed Costs / (Sale Price Per Unit - Variable Cost Per Unit)',
      computation: `${formatCurrency(result.totalManufacturingCost)} / (${formatCurrency(result.recommendedSalesPrice)} - ${formatCurrency(result.manufacturingCostPerUnit)}) = ${result.breakEvenPoint.toFixed(2)} units`,
    },
    {
      title: 'Profit Per Sale',
      value: formatCurrency(result.profitPerUnit),
      icon: ArrowUp,
      description: 'The amount of profit generated from selling one unit.',
      formula: 'Recommended Sale Price - Production Cost Per Unit',
      computation: `${formatCurrency(result.recommendedSalesPrice)} - ${formatCurrency(result.manufacturingCostPerUnit)} = ${formatCurrency(result.profitPerUnit)}`,
    },
    {
      title: 'Total Potential Profit',
      value: formatCurrency(result.totalPotentialProfit),
      icon: Currency,
      description:
        'The maximum profit that can be achieved if all expected units are sold.',
      formula:
        '(Recommended Sale Price - Production Cost Per Unit) × Expected Sales',
      computation: `(${formatCurrency(result.recommendedSalesPrice)} - ${formatCurrency(result.manufacturingCostPerUnit)}) × ${expectedSales} = ${formatCurrency(result.totalPotentialProfit)}`,
    },
    {
      title: 'Margin of Safety',
      value: `${result.marginOfSafety.toFixed(2)}%`,
      icon: ScaleIcon,
      description:
        'The percentage by which actual sales can decrease before reaching the break-even point.',
      formula: '(Expected Sales - Break-Even Point) / Expected Sales × 100',
      computation: `(${expectedSales} - ${result.breakEvenPoint.toFixed(2)}) / ${expectedSales} × 100 = ${result.marginOfSafety.toFixed(2)}%`,
    },
    {
      title: 'Contribution Margin',
      value: formatCurrency(
        result.recommendedSalesPrice - result.manufacturingCostPerUnit
      ),
      icon: ArrowUp,
      description:
        'The amount each unit contributes to covering fixed costs and generating profit.',
      formula: 'Recommended Sale Price - Production Cost Per Unit',
      computation: `${formatCurrency(result.recommendedSalesPrice)} - ${formatCurrency(result.manufacturingCostPerUnit)} = ${formatCurrency(result.recommendedSalesPrice - result.manufacturingCostPerUnit)}`,
    },
  ]
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2">
        {metrics.map((metric, index) => (
          <FinancialMetric
            key={index}
            {...metric}
            status={getStatusColor(
              metric.title,
              parseFloat(metric.value.replace(/[^0-9.-]+/g, ''))
            )}
          />
        ))}
      </div>
    </div>
  )
}

const FinancialMetric = ({
  title,
  value,
  icon: Icon,
  status,
  description,
  formula,
  computation,
}: MetricType & {status: string}) => {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <Icon className={`w-4 h-4 ${status}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${status}`}>{value}</div>
        <div className="mt-2 text-sm text-gray-600">
          <p className="mb-2 text-sm">{description}</p>
          <div className="pt-2 space-y-2">
            <p className="font-mono text-xs text-center">{formula}</p>
            <p className="font-mono text-xs text-center">{computation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
