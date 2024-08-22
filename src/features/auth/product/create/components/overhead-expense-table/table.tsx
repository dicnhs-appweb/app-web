import {CardContent} from '@/components/ui/card'
import {Separator} from '@/components/ui/separator'
import {formatCurrency} from '@/features/auth/utils/format-currency'
import {OverheadExpense} from '@/types/product.schema'
import {ColumnDef, getCoreRowModel, useReactTable} from '@tanstack/react-table'
import {overheadExpenseColumns} from './columns'

interface DataCardProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: OverheadExpense[]
}

export function OverheadExpenseDataTable<TData, TValue>({
  data,
}: DataCardProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns: overheadExpenseColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full">
      <div className="space-y-2">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map(row => (
            <>
              <div
                key={row.id}
                className="overflow-hidden transition-colors hover:bg-secondary/5"
              >
                <div className="flex flex-row items-center justify-between gap-3 my-1">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 text-sm font-medium border rounded-sm text-primary">
                      {row.original.totalUnits}x
                    </div>
                    <div className="flex flex-col">
                      <h2 className="font-medium">
                        {row.original.expenseName}
                      </h2>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(row.original.costPerUnit)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col text-right">
                    <p className="text-sm">
                      {formatCurrency(
                        row.original.costPerUnit * row.original.totalUnits
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">Amount</p>
                  </div>
                </div>
              </div>
              <Separator className="my-2" />
            </>
          ))
        ) : (
          <div className="w-full">
            <CardContent className="flex items-center justify-center h-24">
              No Overhead Expenses
            </CardContent>
          </div>
        )}
      </div>
    </div>
  )
}
