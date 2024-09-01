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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { InfoIcon } from 'lucide-react'

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
  infoText?: string
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
  infoText,
}: FormFieldInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('w-full', className)}>
          <div className="flex flex-row items-center space-x-2">
            <FormLabel>{label}</FormLabel>
            {infoText && (
              <Popover>
                <PopoverTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <p className="text-sm text-muted-foreground">{infoText}</p>
                </PopoverContent>
              </Popover>
            )}
          </div>
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
