'use client';

import {DataTableColumnHeader} from '@/components/data-table/column-header';
import {Button} from '@/components/ui/button';
import {RawMaterial as RawMaterialSchema} from '@/types/product.schema';
import {ColumnDef} from '@tanstack/react-table';
import {Delete} from 'lucide-react';
import {EditMaterialDialog} from '../../edit-material-dialog';

export type RawMaterial = RawMaterialSchema;
export const rawMaterialColumns: ColumnDef<RawMaterial>[] = [
  {
    accessorKey: 'ingredientName',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Ingredient" />
    ),
    size: 200,
  },
  {
    accessorKey: 'costPerUnit',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Ingredient" />
    ),
    size: 120,
    cell: ({row}) => {
      const cost = parseFloat(row.getValue('costPerUnit'));
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      }).format(cost);
    },
  },
  {
    accessorKey: 'stockOnHand',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Ingredient" />
    ),
    size: 100,
    cell: ({row}) => {
      const stock = row.getValue('stockOnHand');
      return `${stock} units`;
    },
  },
  {
    accessorKey: 'quantityNeededPerUnit',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Ingredient" />
    ),
    size: 140,
    cell: ({row}) => {
      const quantity = row.getValue('quantityNeededPerUnit');
      return `${quantity} units`;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    size: 10,
    cell: () => {
      return (
        <div className="flex justify-center space-x-0">
          <EditMaterialDialog />
          <Button variant="ghost" className="w-8 h-8 p-0">
            <span className="sr-only">Open menu</span>
            <Delete className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
