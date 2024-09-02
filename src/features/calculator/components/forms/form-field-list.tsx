import {Button} from '@/components/ui/button'
import {Card} from '@/components/ui/card'
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
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {formatCurrency} from '@/features/calculator/lib/format-currency'
import {cn} from '@/lib/utils'
import {zodResolver} from '@hookform/resolvers/zod'
import {useMediaQuery} from '@react-hook/media-query'
import {
  CoinsIcon,
  Copy,
  Edit2,
  InfoIcon,
  MinusIcon,
  PlusIcon,
  Trash2,
} from 'lucide-react'
import * as math from 'mathjs'
import * as React from 'react'
import {useCallback, useMemo, useState} from 'react'
import {
  Control,
  Controller,
  FieldArrayWithId,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import {baseUnits} from '../../types/base-units'
import {EditableMathField} from '../../types/mathquill-loader'
import {
  CostInfo,
  DirectCost,
  IndirectCost,
  ProductPricingModel,
} from '../../types/product.model'

type FormFieldListProps = {
  control: Control<ProductPricingModel>
  name: 'directCosts' | 'indirectCosts'
}

function FormFieldList({control, name}: FormFieldListProps) {
  const {fields, append, remove, update} = useFieldArray({
    name,
    control,
  })
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-row items-center gap-2">
            <h1 className="text-xl font-bold">
              {name === 'directCosts' ? 'Direct Costs' : 'Indirect Costs'}
            </h1>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="w-6 h-6">
                  <InfoIcon className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent alignOffset={10} className="w-[450px]">
                <h3 className="mb-2 font-semibold">
                  {name === 'directCosts' ? 'Direct Costs' : 'Indirect Costs'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {name === 'directCosts'
                    ? 'Direct costs are expenses that can be directly attributed to the production of specific goods or services. These costs typically vary with production volume. Examples include:'
                    : 'Indirect costs are overhead expenses that support the overall business but are not directly tied to producing specific products or services. These costs often remain relatively constant regardless of production volume. Examples include:'}
                </p>
                <ul className="mt-2 text-xs list-disc list-inside text-muted-foreground">
                  {(name === 'directCosts'
                    ? [
                        'Raw materials (e.g., wood for furniture, fabric for clothing)',
                        'Manufacturing supplies (e.g., nails, glue, packaging materials)',
                        'Commissions tied to specific sales',
                      ]
                    : [
                        'Rent or mortgage for facilities',
                        'Utilities (electricity, water, internet)',
                        'Administrative staff salaries',
                        'Marketing and advertising expenses',
                        'Insurance premiums',
                        'Equipment depreciation',
                      ]
                  ).map((item, index) => (
                    <li key={index} className="ml-4">
                      {item}
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          </div>
          <p>
            {name === 'directCosts'
              ? 'Costs that are directly related to the production of the product.'
              : 'Costs that are not directly tied to the production of the product.'}
          </p>
        </div>
        <AddNewItemDialogDrawer
          onAdd={newItem => append(newItem)}
          itemLabel={name === 'directCosts' ? 'Direct Cost' : 'Indirect Cost'}
        />
      </div>
      {fields.length === 0 ? (
        <Card className="border-dashed bg-background">
          <div className="flex flex-col items-center gap-4 px-6 py-10">
            <div className="flex flex-col items-center gap-2 space-x-2">
              <CoinsIcon className="w-10 h-10 text-muted-foreground" />
              <h3>
                {name === 'directCosts' ? 'Direct Costs' : 'Indirect Costs'}
              </h3>
              <p className="text-sm text-center text-balance text-muted-foreground">
                {name === 'directCosts'
                  ? 'Costs directly associated with product production (e.g., materials, ingredients)'
                  : 'Overhead costs not directly tied to production (e.g., rent, utilities)'}
              </p>
            </div>
            <div>
              <AddNewItemDialogDrawer
                onAdd={newItem => append(newItem)}
                itemLabel={
                  name === 'directCosts' ? 'Direct Cost' : 'Indirect Cost'
                }
              />
            </div>
          </div>
        </Card>
      ) : (
        <CostItemList
          fields={fields}
          control={control}
          name={name}
          remove={remove}
          update={update}
          append={append}
        />
      )}
    </div>
  )
}

function CostItemList({
  fields,
  append,
  remove,
  update,
}: {
  fields: FieldArrayWithId<
    ProductPricingModel,
    'directCosts' | 'indirectCosts'
  >[]
  control: Control<ProductPricingModel>
  name: 'directCosts' | 'indirectCosts'
  append: (item: DirectCost | IndirectCost) => void
  remove: (index: number) => void
  update: (index: number, item: DirectCost | IndirectCost) => void
}) {
  const updateQuantity = useCallback(
    (index: number, newQuantity: number) => {
      update(index, {...fields[index], quantity: Math.max(0, newQuantity)})
    },
    [fields, update]
  )

  const duplicate = useCallback(
    (item: DirectCost | IndirectCost) => {
      append(item)
    },
    [append]
  )

  const edit = useCallback((_: number, item: DirectCost | IndirectCost) => {
    console.log('Editing item:', item)
  }, [])

  return useMemo(
    () => (
      <Card className="space-y-2">
        {fields.map((field, index) => (
          <CostItem
            key={field.id}
            field={field}
            index={index}
            updateQuantity={updateQuantity}
            remove={remove}
            duplicate={duplicate}
            edit={edit}
          />
        ))}
      </Card>
    ),
    [fields, updateQuantity, remove, duplicate, edit]
  )
}

interface CostItemProps {
  field: FieldArrayWithId<ProductPricingModel, 'directCosts' | 'indirectCosts'>
  index: number
  updateQuantity: (index: number, newQuantity: number) => void
  remove: (index: number) => void
  duplicate: (item: DirectCost | IndirectCost) => void
  edit: (index: number, item: DirectCost | IndirectCost) => void
}

const CostItem: React.FC<CostItemProps> = React.memo(
  ({field, index, updateQuantity, remove, duplicate, edit}) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)

    const handleIncrement = useCallback(
      () => updateQuantity(index, field.quantity + 1),
      [updateQuantity, index, field.quantity]
    )
    const handleDecrement = useCallback(
      () => updateQuantity(index, Math.max(0, field.quantity - 1)),
      [updateQuantity, index, field.quantity]
    )

    return (
      <div className={cn('relative p-4', index !== 0 && 'border-t')}>
        <div className="flex items-center space-x-4">
          <Popover onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center justify-center text-sm border bg-card size-11 border-primary"
              >
                <p className="text-primary">{field.quantity + 'x'}</p>
              </Button>
            </PopoverTrigger>
            <PopoverContent side="right" align="center" className="w-auto p-0">
              <div className="flex items-center">
                <Button
                  size="icon"
                  className="rounded-none"
                  variant="ghost"
                  onClick={handleDecrement}
                >
                  <MinusIcon className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  className="rounded-none"
                  variant="ghost"
                  onClick={handleIncrement}
                >
                  <PlusIcon className="w-4 h-4" />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <div
            className={cn(
              'flex-grow overflow-hidden',
              isPopoverOpen && 'opacity-65'
            )}
          >
            <div className="flex flex-col items-start justify-between">
              <h3 className="w-full mr-2 text-sm font-medium truncate">
                {field.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(field.unitCost)}/{field.unitType}
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center flex-shrink-0 gap-1">
            <CostItemActions
              field={field}
              index={index}
              remove={remove}
              duplicate={duplicate}
              edit={edit}
              isPopoverOpen={isPopoverOpen}
              totalCost={field.unitCost * field.quantity}
            />
          </div>
        </div>
      </div>
    )
  }
)

CostItem.displayName = 'CostItem'

interface CostItemActionsProps {
  field: FieldArrayWithId<ProductPricingModel, 'directCosts' | 'indirectCosts'>
  index: number
  remove: (index: number) => void
  duplicate: (item: DirectCost | IndirectCost) => void
  edit: (index: number, item: DirectCost | IndirectCost) => void
  isPopoverOpen: boolean
  totalCost: number
}

const CostItemActions: React.FC<CostItemActionsProps> = React.memo(
  ({field, index, remove, duplicate, edit, isPopoverOpen, totalCost}) => {
    const handleRemove = useCallback(() => remove(index), [remove, index])
    const handleDuplicate = useCallback(
      () => duplicate(field),
      [duplicate, field]
    )
    const handleEdit = useCallback(
      () => edit(index, field),
      [edit, index, field]
    )

    return (
      <Card>
        <Button
          variant="ghost"
          className={cn(
            'rounded-r-none hover:bg-transparent',
            isPopoverOpen && 'opacity-65'
          )}
        >
          <p className="h-4 -mt-1">{formatCurrency(totalCost)}</p>
        </Button>
        <Button
          variant="ghost"
          className={cn(
            'p-2.5 border-l rounded-none',
            isPopoverOpen && 'opacity-65'
          )}
          onClick={handleEdit}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          className={cn(
            'p-2.5 rounded-none border-x',
            isPopoverOpen && 'opacity-65'
          )}
          onClick={handleDuplicate}
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          className={cn('p-2.5 rounded-l-none', isPopoverOpen && 'opacity-65')}
          onClick={handleRemove}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </Card>
    )
  }
)

CostItemActions.displayName = 'CostItemActions'

type NewItemFormData = DirectCost | IndirectCost

const MathInput = React.forwardRef<
  HTMLInputElement,
  {onChange: (value: number) => void; value: number; className?: string}
>(({onChange, className, value}) => {
  const [latex, setLatex] = useState(() => `${value}`)

  const evaluateAndRound = (latexString: string) => {
    try {
      const mathExpression = latexString
        .replace(/\\frac{(\d+)}{(\d+)}/g, '($1/$2)')
        .replace(/\\times/g, '*')
        .replace(/\\div/g, '/')
        .replace(/\\cdot/g, '*')

      return math.evaluate(mathExpression)
    } catch (error) {
      console.error('Error evaluating expression:', error)
      return 0
    }
  }

  return (
    <div
      className={cn(
        'flex h-10 w-full font-sans rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      <EditableMathField
        latex={latex}
        config={{
          restrictMismatchedBrackets: true,
          autoCommands: 'pi theta sqrt sum',
          autoOperatorNames: 'sin cos tan',
        }}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          paddingTop: '3px',
          marginLeft: '-4px',
          alignItems: 'center',
          fontFamily: 'var(--font-geist)',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: '15px',
        }}
        onChange={mathField => {
          const newLatex = mathField.latex()
          setLatex(newLatex)
          const newValue = evaluateAndRound(newLatex)
          onChange(newValue)
        }}
      />
    </div>
  )
})

MathInput.displayName = 'MathInput'

function AddNewItemDialogDrawer({
  onAdd,
  itemLabel,
}: {
  onAdd: (item: NewItemFormData) => void
  itemLabel: string
}) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [selectedUnitType, setSelectedUnitType] = React.useState(
    baseUnits[0].units[0].value
  )

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: {errors},
    control,
  } = useForm<NewItemFormData>({
    resolver: zodResolver(CostInfo),
    defaultValues: {
      quantity: 0,
      unitCost: 0,
      unitType: baseUnits[0].units[0].value,
    },
  })

  const watchedUnitType = watch('unitType')

  React.useEffect(() => {
    if (watchedUnitType !== selectedUnitType) {
      setSelectedUnitType(watchedUnitType as typeof selectedUnitType)
    }
  }, [watchedUnitType])

  const onSubmit = (data: NewItemFormData) => {
    onAdd(data)
    setOpen(false)
    reset()
  }

  const content = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">{itemLabel}</Label>
        <Input id="name" {...register('name')} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <div className="flex w-full gap-2">
          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Controller
              name="quantity"
              control={control}
              render={({field}) => (
                <MathInput onChange={field.onChange} value={field.value} />
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="unitType">Unit Type</Label>
            <Select
              onValueChange={value => setValue('unitType', value)}
              defaultValue={selectedUnitType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent position="popper">
                {baseUnits.map(category => (
                  <SelectGroup key={category.category}>
                    <SelectLabel>{category.category}</SelectLabel>
                    {category.units.map(unit => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {errors.quantity && (
          <p className="text-sm text-red-500">{errors.quantity.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="unitCost">Cost per {selectedUnitType}</Label>
        <Input
          type="number"
          step="0.01"
          id="unitCost"
          {...register('unitCost', {valueAsNumber: true})}
        />
        {errors.unitCost && (
          <p className="text-sm text-red-500">{errors.unitCost.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full">
        Add {itemLabel}
      </Button>
    </form>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default">
            <PlusIcon className="w-4 h-4 mr-1" />
            Add
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New {itemLabel}</DialogTitle>
            <DialogDescription>
              Enter the details for the new {itemLabel.toLowerCase()}.
            </DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="default">
          <PlusIcon className="w-4 h-4 mr-1" />
          Add
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add New {itemLabel}</DrawerTitle>
          <DrawerDescription>
            Enter the details for the new {itemLabel.toLowerCase()}.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">{content}</div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default FormFieldList
