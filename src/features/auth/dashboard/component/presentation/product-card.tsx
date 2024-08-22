import {Button} from '@/components/ui/button'
import {Card} from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {formatCurrency} from '@/features/auth/utils/format-currency'
import {ProductType, ProfitMarginSettings} from '@/types/product.type'
import {useNavigate} from '@tanstack/react-router'
import {DollarSign, Info, Package, TrendingUp} from 'lucide-react'
import {ObjectId} from 'mongodb'
import React, {useMemo} from 'react'

interface ProductCardProps
  extends Pick<
    ProductType,
    'productName' | 'recommendedRetailPrice' | 'productionForecast'
  > {
  _id: ObjectId
  profitMarginSettings: ProfitMarginSettings
}

export const ProductCard = React.memo(({data}: {data: ProductCardProps}) => {
  const {
    productName,
    recommendedRetailPrice,
    productionForecast,
    profitMarginSettings,
  } = data

  const getProfitMarginText = useMemo(
    () => () => {
      if (profitMarginSettings.calculationType === 'percentage') {
        return `${profitMarginSettings.profitValue}%`
      } else {
        return formatCurrency(profitMarginSettings.profitValue)
      }
    },
    [profitMarginSettings, formatCurrency]
  )

  const navigate = useNavigate()
  const viewProduct = (id: ObjectId) =>
    navigate({to: '/product/$id', params: {id}})

  console.log(data)

  return (
    <Card className="my-2">
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <h3 className="flex flex-wrap w-[250px] items-center text-gray-800 text-lg">
            <span className="mr-2">{productName}</span>
          </h3>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: DollarSign,
                color: 'text-green-500',
                label: 'Retail Price',
                value: recommendedRetailPrice
                  ? formatCurrency(recommendedRetailPrice)
                  : 'N/A',
              },
              {
                icon: TrendingUp,
                color: 'text-blue-500',
                label: 'Profit Margin',
                value: getProfitMarginText(),
              },
              {
                icon: Package,
                color: 'text-purple-500',
                label: 'Max Production',
                value: productionForecast?.maximumUnitsProducible
                  ? `${productionForecast.maximumUnitsProducible.toLocaleString()} units`
                  : 'N/A',
                hasTooltip: true,
              },
            ].map((item, index) => (
              <div
                key={index + item.value}
                className="flex items-center space-x-3"
              >
                <item.icon
                  className={`w-6 h-6 ${item.color}`}
                  aria-hidden="true"
                />
                <div className="flex flex-row justify-between flex-grow sm:flex-col">
                  <p className="flex items-center text-sm text-gray-500">
                    {item.label}
                    {item.hasTooltip && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info
                              className="w-4 h-4 ml-1 text-gray-400"
                              aria-hidden="true"
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            Maximum units that can be produced based on current
                            capacity
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </p>
                  <p className="text-lg font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="default"
          className="flex-grow"
          onClick={() => viewProduct(data._id)}
        >
          View
        </Button>
      </div>
    </Card>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard
