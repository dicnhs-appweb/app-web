import {zodResolver} from '@hookform/resolvers/zod'
import {useMediaQuery} from '@react-hook/media-query'
import {PlusCircle} from 'lucide-react'
import * as React from 'react'
import {useForm} from 'react-hook-form'
import * as z from 'zod'

import {Button} from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {cn} from '@/lib/utils'
import {OverheadExpenseSchema} from '../computations/types/product.schema'
import {useOverheadExpensesStore} from '../store/use-overhead-expense-store'

type FormValues = z.infer<typeof OverheadExpenseSchema>

interface ExpenseFormProps {
  onSubmit: (data: FormValues) => void
  className?: string
}

function ExpenseForm({className, onSubmit}: ExpenseFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(OverheadExpenseSchema),
    defaultValues: {},
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-4', className)}
      >
        <FormField
          control={form.control}
          name="expenseName"
          render={({field}) => (
            <FormItem>
              <FormLabel>Expense Category</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="costPerUnit"
          render={({field}) => (
            <FormItem>
              <FormLabel>Cost Per Unit</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                  step="0.01"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalUnits"
          render={({field}) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Add Expense
        </Button>
      </form>
    </Form>
  )
}

export function OverheadExpenseAdd() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const addOverheadExpense = useOverheadExpensesStore(
    state => state.addOverheadExpense
  )

  const handleSubmit = (data: FormValues) => {
    addOverheadExpense(data)
    setOpen(false)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="default"
            variant="ghost"
            className="h-0 gap-1 p-0 hover:bg-transparent hover:underline"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="text-sm sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Expense
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Overhead Expense</DialogTitle>
            <DialogDescription>
              Add a new overhead expense to your product. Fill in all the
              details below.
            </DialogDescription>
          </DialogHeader>
          <ExpenseForm onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="text-sm sm:whitespace-nowrap">Add</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add Overhead Expense</DrawerTitle>
          <DrawerDescription>
            Add a new overhead expense to your product. Fill in all the details
            below.
          </DrawerDescription>
        </DrawerHeader>
        <ExpenseForm className="px-4" onSubmit={handleSubmit} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
