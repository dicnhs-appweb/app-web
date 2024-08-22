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
import {useOverheadExpensesStore} from '@/features/auth/product/create/store/use-overhead-expense-store'
import {useRawMaterialsStore} from '@/features/auth/product/create/store/use-raw-materials-store'
import {formatCurrency} from '@/features/auth/utils/format-currency'
import {getComputationResult} from '@/features/auth/utils/get-computation-result'
import {
  ComputationResult,
  ProductSchema,
  ProductZodSchema,
} from '@/types/product.schema'
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
      desiredProductionQuantity: 0,
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
      watchedFields.desiredProductionQuantity > 0 &&
      watchedFields.expectedSales > 0 &&
      rawMaterials.length > 0 &&
      overheadExpenses.length > 0
    ) {
      return getComputationResult({
        ...watchedFields,
        rawMaterials,
        overheadExpenses,
      })
    }
    return null
  }, [watchedFields, rawMaterials, overheadExpenses])

  useEffect(() => {
    if (
      watchedFields.productName &&
      watchedFields.profitMarginSettings.profitValue > 0 &&
      watchedFields.desiredProductionQuantity > 0 &&
      watchedFields.expectedSales > 0 &&
      rawMaterials.length > 0 &&
      overheadExpenses.length > 0
    ) {
      const result = getComputationResult({
        ...watchedFields,
        rawMaterials,
        overheadExpenses,
      })
      newProductForm.setValue('computationResult', result, {shouldDirty: false})
    } else {
      newProductForm.setValue('computationResult', undefined, {
        shouldDirty: false,
      })
    }
  }, [watchedFields, rawMaterials, overheadExpenses, newProductForm])

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
                      <Select
                        onValueChange={field.onChange}
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newProductForm.control}
                  name="desiredProductionQuantity"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Desired Production Quantity</FormLabel>
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
        <div>
          <ComputationResultDisplay
            result={computationResult}
            expectedSales={newProductForm.getValues('expectedSales')}
          />
        </div>
      </div>
    </div>
  )
}

function ComputationResultDisplay({
  result,
  expectedSales,
}: {
  result: ComputationResult | null
  expectedSales: number
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
      case 'Manufacturing Cost Per Unit':
        return value <= 0.7 * result.recommendedRetailPrice
          ? 'text-green-600'
          : 'text-red-600'
      case 'Recommended Retail Price':
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
      case 'Profit Per Unit':
        return value >= 0.2 * result.recommendedRetailPrice
          ? 'text-green-600'
          : value < 0
            ? 'text-red-600'
            : 'text-yellow-600'
      case 'Total Potential Profit':
        return value > 0.2 * (result.recommendedRetailPrice * expectedSales)
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
        return value >= 0.3 * result.recommendedRetailPrice
          ? 'text-green-600'
          : value < 0
            ? 'text-red-600'
            : 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  const metrics = [
    {
      title: 'Manufacturing Cost Per Unit',
      value: formatCurrency(result.manufacturingCostPerUnit),
      icon: TruckIcon,
    },
    {
      title: 'Recommended Retail Price',
      value: formatCurrency(result.recommendedRetailPrice),
      icon: Currency,
    },
    {
      title: 'Break-Even Point',
      value: result.breakEvenPoint.toFixed(2),
      icon: ScaleIcon,
    },
    {
      title: 'Profit Per Unit',
      value: formatCurrency(result.profitPerUnit),
      icon: ArrowUp,
    },
    {
      title: 'Total Potential Profit',
      value: formatCurrency(result.totalPotentialProfit),
      icon: Currency,
    },
    {
      title: 'Margin of Safety',
      value: `${result.marginOfSafety.toFixed(2)}%`,
      icon: ScaleIcon,
    },
    {
      title: 'Contribution Margin',
      value: formatCurrency(result.contributionMargin),
      icon: ArrowUp,
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
}: {
  title: string
  value: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  status: string
}) => (
  <Card className="bg-white">
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium text-gray-500">
        {title}
      </CardTitle>
      <Icon className={`w-4 h-4 ${status}`} />
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${status}`}>{value}</div>
    </CardContent>
  </Card>
)

export default CreateView
