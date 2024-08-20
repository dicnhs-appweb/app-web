import {productByIdQueryOptions} from '@/features/auth/dashboard/api/get-product'
import {ProductType} from '@/types/product.type'
import {useSuspenseQuery} from '@tanstack/react-query'
import {createFileRoute} from '@tanstack/react-router'
import {z} from 'zod'

export const Route = createFileRoute('/_auth/product/$id')({
  params: {
    parse: params => ({
      id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .parse(params.id),
    }),
    stringify: ({id}) => ({id}),
  },
  loader: opts =>
    opts.context.queryClient.ensureQueryData(
      productByIdQueryOptions(opts.params.id)
    ),
  component: ViewProductComponent,
})

function ViewProductComponent() {
  const {id} = Route.useParams()
  const productQuery = useSuspenseQuery(productByIdQueryOptions(id))
  const product = productQuery.data as ProductType

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Details</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Product Name:
          </label>
          <p className="text-gray-900">{product.productName}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Manufacturing Cost Per Unit:
          </label>
          <p className="text-gray-900">
            ${product.manufacturingCostPerUnit?.toFixed(2) ?? 'N/A'}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Profit Margin Settings:
          </label>
          <p className="text-gray-900">
            Type: {product.profitMarginSettings.calculationType}, Value:{' '}
            {product.profitMarginSettings.percentageValue}%
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Recommended Retail Price:
          </label>
          <p className="text-gray-900">
            ${product.recommendedRetailPrice?.toFixed(2) ?? 'N/A'}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Production Forecast:
          </label>
          <p className="text-gray-900">
            Max Units:{' '}
            {product.productionForecast?.maximumUnitsProducible ?? 'N/A'},
            Constraint:{' '}
            {product.productionForecast?.productionConstraint || 'None'}
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Raw Materials:
          </label>
          <ul className="list-disc pl-5">
            {product.rawMaterials.map((material, index) => (
              <li key={index} className="mb-2">
                {material.ingredientName}: {material.quantityNeededPerUnit}{' '}
                units needed, ${material.costPerUnit.toFixed(2)} per unit,
                {material.stockOnHand} in stock
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Overhead Expenses:
          </label>
          <ul className="list-disc pl-5">
            {product.overheadExpenses.map((expense, index) => (
              <li key={index}>
                {expense.expenseCategory}: ${expense.costPerUnit.toFixed(2)} per
                unit
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ViewProductComponent
