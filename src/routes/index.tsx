import {Card, CardDescription, CardTitle} from '@/components/ui/card'
import {AnalysisChart} from '@/features/calculator/components/charts/profit-analysis-chart'
import FinancialMetrics from '@/features/calculator/components/financial-metrics'
import {performFinancialAnalysis} from '@/features/calculator/lib/computation'
import {
  FinancialAnalysisResult,
  ProductPricingModel,
} from '@/features/calculator/types/product.model'
import {zodResolver} from '@hookform/resolvers/zod'
import {createFileRoute} from '@tanstack/react-router'
import {useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {Calculator} from './../features/calculator/components/calculator'
export const Route = createFileRoute('/')({
  component: Calculate,
})

function Calculate() {
  const productForm = useForm<ProductPricingModel>({
    resolver: zodResolver(ProductPricingModel),
    defaultValues: {
      productName: '',
      pricingStrategy: {
        method: 'cost-plus',
        targetValue: 0,
      },
      plannedProductionQuantity: 0,
      forecastedSalesQuantity: 0,
      directCosts: [],
      indirectCosts: [],
    },
  })
  const handleSaveData = (data: ProductPricingModel) => {
    console.log('Form submitted successfully')
    console.log(data)
  }

  const [analysisResult, setAnalysisResult] = useState<FinancialAnalysisResult>(
    {
      breakEvenPoint: 0,
      contributionMargin: 0,
      contributionMarginRatio: 0,
      operatingLeverage: 0,
      profitScenarios: [],
      recommendedPrice: 0,
      totalCost: 0,
      totalDirectCost: 0,
      totalIndirectCost: 0,
      unitCost: 0,
    }
  )

  useEffect(() => {
    const subscription = productForm.watch(formData => {
      try {
        const result = performFinancialAnalysis(formData as ProductPricingModel)
        if (result) {
          setAnalysisResult(result)
        } else {
          console.error('Financial analysis returned undefined result')
        }
      } catch (error) {
        console.error('Error performing financial analysis', error)
        setAnalysisResult({
          breakEvenPoint: 0,
          contributionMargin: 0,
          contributionMarginRatio: 0,
          operatingLeverage: 0,
          profitScenarios: [],
          recommendedPrice: 0,
          totalCost: 0,
          totalDirectCost: 0,
          totalIndirectCost: 0,
          unitCost: 0,
        })
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [productForm])

  return (
    <div className="my-8 space-y-4">
      <Card className="flex flex-col items-center justify-center gap-3 p-10">
        <img src="/logo.png" alt="logo" width={100} height={100} />
        <CardTitle className="text-center">
          Product Pricing Calculator
        </CardTitle>
        <CardDescription className="text-center max-w-[600px] mx-auto text-balance">
          Maximize your product's profitability by calculating optimal prices.
          Set strategic margins and achieve your financial targets with
          precision.
        </CardDescription>
      </Card>
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-grow order-2 md:order-1 md:w-1/2">
          <div className="space-y-4">
            <AnalysisChart
              financialAnalysis={analysisResult}
              product={productForm.getValues()}
            />
            <FinancialMetrics
              result={analysisResult ?? null}
              input={productForm.getValues()}
            />
          </div>
        </div>
        <div className="order-1 md:order-2 md:w-1/2">
          <div className="md:sticky md:top-4">
            <Calculator
              productForm={productForm}
              handleSaveData={handleSaveData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
