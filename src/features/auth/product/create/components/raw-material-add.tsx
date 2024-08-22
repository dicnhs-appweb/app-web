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
import {RawMaterialSchema} from '@/types/product.schema'
import {useRawMaterialsStore} from '../store/use-raw-materials-store'

type FormValues = z.infer<typeof RawMaterialSchema>

interface MaterialFormProps {
  onSubmit: (data: FormValues) => void
  className?: string
}

function MaterialForm({onSubmit, className}: MaterialFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(RawMaterialSchema),
    defaultValues: {},
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-2', className)}
      >
        <FormField
          control={form.control}
          name="materialName"
          render={({field}) => (
            <FormItem>
              <FormLabel>Material Name</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Total Units</FormLabel>
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
          name="costPerUnit"
          render={({field}) => (
            <FormItem>
              <FormLabel>Cost Per Unit</FormLabel>
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
          Add Material
        </Button>
      </form>
    </Form>
  )
}

export function RawMaterialAdd() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const addRawMaterial = useRawMaterialsStore(state => state.addRawMaterial)

  const handleSubmit = (data: FormValues) => {
    addRawMaterial(data)
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
              Add Material
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Raw Material</DialogTitle>
            <DialogDescription>
              Add a new raw material to your product. Fill in all the details
              below.
            </DialogDescription>
          </DialogHeader>
          <MaterialForm onSubmit={handleSubmit} />
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
          <DrawerTitle>Add Raw Material</DrawerTitle>
          <DrawerDescription>
            Add a new raw material to your product. Fill in all the details
            below.
          </DrawerDescription>
        </DrawerHeader>
        <MaterialForm onSubmit={handleSubmit} className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
