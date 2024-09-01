import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Control } from 'react-hook-form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { InfoIcon } from 'lucide-react'

interface FormFieldInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
  label: string
  type?: string
  step?: string
  parseValue?: (value: string) => unknown
  className?: string
  info?: string // New prop for popover content
}

export function FormFieldInput({
  className,
  control,
  name,
  label,
  type = 'text',
  step,
  parseValue,
  info,
}: FormFieldInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          <div className="flex items-center space-x-2">
            <FormLabel>{label}</FormLabel>
            {info && (
              <Popover>
                <PopoverTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <h3 className="font-semibold mb-2">
                    {label}
                  </h3>
                  <p className="text-sm text-muted-foreground">{info}</p>
                </PopoverContent>
              </Popover>
            )}
          </div>
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
