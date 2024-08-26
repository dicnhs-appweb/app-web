import {Card} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import FormFieldMaterials from '@/features/calculator/components/forms/form-field-list'

import {Button} from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {Slider} from '@/components/ui/slider'
import {cn} from '@/lib/utils'
import {Boxes, DollarSignIcon, Percent} from 'lucide-react'
import {UseFormReturn} from 'react-hook-form'
import {ProductPricingModel} from '../types/product.model'
import {FormFieldInput} from './forms/form-field-input'
import {FormFieldInputIcon} from './forms/form-field-input-icon'

interface CalculatorProps {
  productForm: UseFormReturn<ProductPricingModel>
  handleSaveData: (data: ProductPricingModel) => void
}

export function Calculator({productForm, handleSaveData}: CalculatorProps) {
  const setSalesPercentage = (percentage: number) => {
    const productionQuantity = productForm.getValues(
      'plannedProductionQuantity'
    )
    const salesQuantity = Math.round(productionQuantity * (percentage / 100))
    productForm.setValue('forecastedSalesQuantity', salesQuantity)
  }

  return (
    <Form {...productForm}>
      <form
        onSubmit={productForm.handleSubmit(handleSaveData)}
        className="space-y-4"
      >
        <Card className="p-6 space-y-4">
          <FormFieldInput
            control={productForm.control}
            name="productName"
            label="Product Name"
          />
          <div className="grid items-center grid-cols-12 gap-4">
            <FormField
              control={productForm.control}
              name="pricingStrategy.targetValue"
              render={({field}) => (
                <FormItem className="col-span-12 lg:col-span-6">
                  <FormLabel>
                    {productForm.getValues('pricingStrategy.method') ===
                    'cost-plus' ? (
                      <span className="inline-flex items-center gap-px">
                        Cost Plus (<Percent size={16} />)
                      </span>
                    ) : (
                      'Fixed Price'
                    )}
                  </FormLabel>
                  {productForm.getValues('pricingStrategy.method') ===
                  'cost-plus' ? (
                    <div className="space-y-2">
                      <Slider
                        min={0}
                        max={100}
                        step={0.1}
                        value={[field.value]}
                        onValueChange={value => field.onChange(value[0])}
                      />
                      <div className="text-sm text-left text-muted-foreground">
                        {field.value.toFixed(1)}%
                      </div>
                    </div>
                  ) : (
                    <FormFieldInputIcon
                      control={productForm.control}
                      name="pricingStrategy.targetValue"
                      type="number"
                      step="0.01"
                      parseValue={parseFloat}
                      indicator={
                        <DollarSignIcon className="w-5 h-5" strokeWidth={1.5} />
                      }
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={productForm.control}
              name="pricingStrategy.method"
              render={({field}) => (
                <FormItem className="col-span-12 lg:col-span-6">
                  <FormLabel>Pricing Strategy</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pricing strategy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cost-plus">Cost Plus</SelectItem>
                      <SelectItem value="fixed-price">Fixed Price</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FormFieldInputIcon
              control={productForm.control}
              name="plannedProductionQuantity"
              label="Production Quantity"
              type="number"
              parseValue={parseInt}
              indicator={<Boxes className="w-5 h-5" strokeWidth={1.5} />}
            />
            <div className="space-y-2">
              <FormFieldInputIcon
                control={productForm.control}
                name="forecastedSalesQuantity"
                label="Sales Quantity"
                type="number"
                parseValue={parseInt}
                customIndicator={
                  <div className="flex items-center -mr-3">
                    {[50, 75, 100].map(percentage => (
                      <Button
                        key={percentage}
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSalesPercentage(percentage)}
                        className={cn(
                          'py-1 text-xs border-l rounded-none',
                          percentage === 100 && 'rounded-r-md',
                          productForm.getValues('forecastedSalesQuantity') ===
                            percentage &&
                            'bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground'
                        )}
                      >
                        {percentage}%
                      </Button>
                    ))}
                  </div>
                }
              />
            </div>
          </div>
        </Card>
        <FormFieldMaterials control={productForm.control} name="directCosts" />
        <FormFieldMaterials
          control={productForm.control}
          name="indirectCosts"
        />
      </form>
    </Form>
  )
}
