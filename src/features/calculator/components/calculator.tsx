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
import {Boxes, DollarSignIcon, InfoIcon, Percent} from 'lucide-react'
import {UseFormReturn} from 'react-hook-form'
import {ProductPricingModel} from '../types/product.model'
import {FormFieldInput} from './forms/form-field-input'
import {FormFieldInputIcon} from './forms/form-field-input-icon'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

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
            info="The name of the product you are pricing."
          />
          <div className="grid items-center grid-cols-12 gap-4">
            <FormField
              control={productForm.control}
              name="pricingStrategy.targetValue"
              render={({field}) => (
                <FormItem className="col-span-12 lg:col-span-6">
                  <div className={cn("flex items-center space-x-2", productForm.getValues('pricingStrategy.method') === 'fixed-price' ? '-mb-2' : 'mb-4')}>
                    <FormLabel>
                      {productForm.getValues('pricingStrategy.method') ===
                      'cost-plus'
                        ? 'Cost Plus'
                        : 'Fixed Price'}
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <h3 className="font-semibold mb-2">
                          {productForm.getValues('pricingStrategy.method') ===
                          'cost-plus'
                            ? 'Cost Plus Strategy'
                            : 'Fixed Price Strategy'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {productForm.getValues('pricingStrategy.method') ===
                          'cost-plus'
                            ? 'This slider allows you to set the percentage markup on the cost of production.'
                            : 'Enter the fixed price for your product.'}
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {productForm.getValues('pricingStrategy.method') ===
                  'cost-plus' ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Slider
                          min={0}
                          max={100}
                          step={0.1}
                          value={[field.value]}
                          onValueChange={value => field.onChange(value[0])}
                        />
                      </div>
                      <div className="text-sm text-left text-muted-foreground">
                        {field.value.toFixed(1)}%
                      </div>
                    </div>
                  ) : (
                    <FormFieldInputIcon
                      control={productForm.control}
                      name="pricingStrategy.targetValue"
                      parseValue={(value) => parseFloat(value)}
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
                  <div className="flex items-center space-x-2">
                    <FormLabel>Pricing Strategy</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
                      </PopoverTrigger>
                      <PopoverContent align='end' alignOffset={10} className="w-80">
                        <h3 className="font-semibold mb-2">Pricing Strategy</h3>
                        <p className="text-sm text-muted-foreground">
                          Choose a pricing strategy for your product. 
                          "Cost Plus" adds a markup to the cost of production, 
                          while "Fixed Price" sets a predetermined price.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
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
              parseValue={(value) => parseFloat(value)}
              indicator={<Boxes className="w-5 h-5" strokeWidth={1.5} />}
              infoText="The number of units you plan to produce."
            />
            <div className="space-y-2">
              <FormFieldInputIcon
                control={productForm.control}
                name="forecastedSalesQuantity"
                label="Sales Quantity"
                parseValue={(value) => parseFloat(value)}
                infoText="The number of units you plan to sell."
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
