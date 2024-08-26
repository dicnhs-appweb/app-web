import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {cn} from '@/lib/utils'
import {Control} from 'react-hook-form'

interface FormFieldInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
  label: string
  type?: string
  step?: string
  parseValue?: (value: string) => unknown
  className?: string
}

export function FormFieldInput({
  className,
  control,
  name,
  label,
  type = 'text',
  step,
  parseValue,
}: FormFieldInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({field}) => (
        <FormItem className={cn(className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              step={step}
              {...field}
              value={field.value ?? ''}
              onChange={e =>
                field.onChange(
                  parseValue ? parseValue(e.target.value) : e.target.value
                )
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
