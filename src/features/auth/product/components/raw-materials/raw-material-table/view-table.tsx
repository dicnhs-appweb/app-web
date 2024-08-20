import {DataTable} from '@/components/data-table/data-table';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {RawMaterial} from '@/types/product.type';
import {Table} from '@tanstack/react-table';
import {Delete} from 'lucide-react';
import {useProductStore} from '../../../store/useRawMaterialStore';
import {EditMaterialDialog} from '../../edit-material-dialog';

function RawMaterialTable({table}: {table: Table<RawMaterial>}) {
  const {
    product: {rawMaterials: data},
  } = useProductStore();
  return (
    <div className="flex flex-col mb-4 space-y-2">
      <div>
        <div className="hidden overflow-x-auto md:block">
          <DataTable table={table} />
        </div>
        <div className="space-y-2 md:hidden">
          {data.map((item, index) => (
            <div className="flex flex-row gap-2">
              <Card className="w-full" key={index}>
                <div className="flex flex-row justify-between p-4 overflow-hidden">
                  <div>
                    <span className="text-xs">Ingredient</span>
                    <h2 className="text-lg">{item.ingredientName}</h2>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-2">
                    <p className="text-base font-medium">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'PHP',
                      }).format(Number(item.costPerUnit))}
                    </p>
                  </div>
                </div>
              </Card>
              <div className="flex flex-col space-y-1">
                <EditMaterialDialog />
                <Button variant="ghost" className="w-8 h-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <Delete className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{data.length}</strong> raw materials
        </div>
      </div>
    </div>
  );
}

export default RawMaterialTable;
