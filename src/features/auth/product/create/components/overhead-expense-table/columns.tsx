'use client'

import {OverheadExpense} from '@/types/product.schema'
import {ColumnDef} from '@tanstack/react-table'

export const overheadExpenseColumns: ColumnDef<OverheadExpense>[] = [
  {
    accessorKey: 'expenseName',
    header: 'Expense Name',
  },
  {
    accessorKey: 'totalUnits',
    header: 'Quantity',
    cell: ({row}) => {
      const quantity = parseFloat(row.getValue('totalUnits'))
      return <div className="text-right">{quantity.toFixed(2)}</div>
    },
  },
  {
    accessorKey: 'costPerUnit',
    header: 'Cost Per Unit',
    cell: ({row}) => {
      const amount = parseFloat(row.getValue('costPerUnit'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
      return <div className="font-medium text-right">{formatted}</div>
    },
  },
]
