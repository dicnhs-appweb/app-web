import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Delete, Trash2} from 'lucide-react';
import {useProductStore} from '../../store/useRawMaterialStore';
import {EditExpenseDialog} from '../edit-expense-dialog';
import {EditMaterialDialog} from '../edit-material-dialog';

function OverheadExpensesTable() {
  const {
    product: {overheadExpenses: data},
  } = useProductStore();

  return (
    <div className="flex flex-col mb-4 space-y-4">
      <div>
        <Card className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Expense Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {item.expenseCategory}
                  </TableCell>
                  <TableCell>{formatCurrency(item.costPerUnit)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <EditMaterialDialog />
                      <Button variant="ghost" className="w-8 h-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <Delete className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <div className="space-y-2 sm:hidden">
          {data.map((item, index) => (
            <div className="flex flex-row gap-2">
              <Card className="w-full" key={index}>
                <div className="flex flex-row justify-between p-4 overflow-hidden">
                  <div>
                    <span className="text-xs">Expense</span>
                    <h2 className="text-lg">{item.expenseCategory}</h2>
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
                <EditExpenseDialog />
                <Button>
                  <span className="sr-only">Delete Material</span>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
}

export default OverheadExpensesTable;
