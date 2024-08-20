import {DataTableViewOptions} from '@/components/data-table/column-toggle';
import {Button} from '@/components/ui/button';
import {getCoreRowModel, useReactTable} from '@tanstack/react-table';
import {useProductStore} from '../store/useRawMaterialStore';
import {OperationalTotalChart} from './operational-total/donut-chart';
import OverheadExpensesTable from './overhead-expenses-table/view-table';
import {rawMaterialColumns} from './raw-materials/raw-material-table/columns';
import RawMaterialTable from './raw-materials/raw-material-table/view-table';

export const ProductCalculationForm = () => {
  const {
    product: {rawMaterials: data},
  } = useProductStore();
  const table = useReactTable({
    data,
    columns: rawMaterialColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
      <div className="col-span-1 md:col-span-5">
        <OperationalTotalChart />
      </div>
      <div className="col-span-1 gap-4 md:col-span-full">
        <div className="inline-flex justify-end gap-2 mb-3">
          <Button>Add Material</Button>
          <Button>Add Expense</Button>
          <DataTableViewOptions table={table} />
        </div>
        <RawMaterialTable table={table} />
        <OverheadExpensesTable />
      </div>
    </div>
  );
};
