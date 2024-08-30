'use client';

import {Button} from '@/components/ui/button';
import {OverheadExpense as OverheadExpenseSchema} from '@/types/product.schema';
import {ColumnDef} from '@tanstack/react-table';
import {Delete} from 'lucide-react';
import {EditExpenseDialog} from '../edit-expense-dialog';

export type OverheadExpense = OverheadExpenseSchema;

export const overheadExpenseColumns: ColumnDef<OverheadExpense>[] = [
  {
    accessorKey: 'expenseCategory',
    header: 'Expense Category',
  },
  {
    accessorKey: 'costPerUnit',
    header: 'Cost per Unit',
    cell: ({row}) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(row.original.costPerUnit);
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    enableHiding: false,
    cell: () => {
      return (
        <div className="inline-flex space-x-1">
          <EditExpenseDialog />
          <Button variant="outline" size="sm">
            <span>
              <Delete className="size-5" />
            </span>
          </Button>
        </div>
      );
    },
  },
];
