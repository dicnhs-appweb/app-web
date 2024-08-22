import {getComputationResult} from '@/features/auth/product/create/computations/product-computations'
import {
  ComputationResult,
  ProductSchema,
} from '@/features/auth/product/create/computations/types/product.schema'
import {createFileRoute} from '@tanstack/react-router'
import {useEffect, useState} from 'react'

export const Route = createFileRoute('/_auth/test')({
  component: Test,
})

function Test() {
  {
    const product: ProductSchema = {
      productName: 'Deluxe Chocolate Bar',
      profitMarginSettings: {
        calculationType: 'fixed-markup',
        profitValue: 50,
      },
      quantityProduced: 1,
      expectedSales: 2,
      rawMaterials: [
        {
          materialName: 'Cocoa',
          totalUnits: 1,
          costPerUnit: 50,
        },
      ],
      overheadExpenses: [
        {
          expenseName: 'Labor',
          totalUnits: 1,
          costPerUnit: 50,
        },
      ],
    }
    const [productResult, setProductResult] = useState<ComputationResult>()

    useEffect(() => {
      const result = getComputationResult(product)
      setProductResult(result)
    }, [])
    return (
      <div>
        <pre>
          <div>{JSON.stringify(productResult, null, 2)}</div>
        </pre>
      </div>
    )
  }
}

export default Test
