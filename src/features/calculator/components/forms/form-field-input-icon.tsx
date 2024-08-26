import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {InputIndicator} from '@/components/ui/input-indicator'
import {cn} from '@/lib/utils'
import {Control} from 'react-hook-form'

interface FormFieldInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
  label?: string
  type?: string
  step?: string
  parseValue?: (value: string) => unknown
  indicator?: React.ReactNode
  className?: string
  customIndicator?: React.ReactNode
}

export function FormFieldInputIcon({
  control,
  name,
  label,
  type = 'text',
  step,
  parseValue,
  indicator,
  className,
  customIndicator,
}: FormFieldInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({field}) => (
        <FormItem className={cn('w-full', className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <InputIndicator
              key={name}
              type={type}
              step={step}
              {...field}
              value={field.value ?? ''}
              onChange={e =>
                field.onChange(
                  parseValue ? parseValue(e.target.value) : e.target.value
                )
              }
              indicator={indicator}
              customIndicator={customIndicator}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
