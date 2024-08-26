import {cn} from '@/lib/utils'
import {AnimatePresence, motion} from 'framer-motion'
import * as React from 'react'

export interface InputIndicatorProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  indicator?: React.ReactNode
  customIndicator?: React.ReactNode
}

const InputIndicator = React.forwardRef<HTMLInputElement, InputIndicatorProps>(
  ({className, type, indicator, customIndicator, ...props}, ref) => {
    return (
      <div
        className={cn(
          'flex items-center border rounded-md border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background',
          indicator ? 'pr-0' : 'pr-3'
        )}
      >
        <input
          type={type}
          className={cn(
            'flex w-full rounded-md bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
        {customIndicator && customIndicator}
        {indicator && (
          <div className="relative flex items-center h-10 px-3 overflow-hidden text-sm border-l rounded-r-md text-muted-foreground bg-muted">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -20}}
                transition={{duration: 0.2}}
                className="flex items-center justify-center"
              >
                {indicator}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    )
  }
)
InputIndicator.displayName = 'InputIndicator'

export {InputIndicator}
