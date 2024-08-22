'use client'

import {RawMaterial} from '@/types/product.schema'
import {ColumnDef} from '@tanstack/react-table'

export const rawMaterialColumns: ColumnDef<RawMaterial>[] = [
  {
    accessorKey: 'materialName',
    header: 'Material Name',
  },
  {
    accessorKey: 'totalUnits',
    header: 'Quantity Needed',
    cell: ({row}) => {
      const quantity = parseFloat(row.getValue('totalUnits'))
      return <div className="text-right">{quantity.toFixed(2)}</div>
    },
  },
  {
    accessorKey: 'costPerUnit',
    header: 'Cost per Unit',
    cell: ({row}) => {
      const cost = parseFloat(row.getValue('costPerUnit'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(cost)
      return <div className="font-medium text-right">{formatted}</div>
    },
  },
]
