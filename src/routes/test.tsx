import {createFileRoute} from '@tanstack/react-router'
import * as math from 'mathjs'
import React, {useEffect, useState} from 'react'
import {z} from 'zod'
import {baseUnits} from '../features/calculator/types/base-units'
import {EditableMathField} from '../features/calculator/types/mathquill-loader'

export const Route = createFileRoute('/test')({
  component: Test,
})

function Test() {
  return (
    <div>
      <h2>Editable Math Field</h2>
      <EditableMathExample />
    </div>
  )
}

const ComponentStateSchema = z.object({
  latex: z.string(),
  formData: z.object({
    value: z.number(),
    unit: z.string(),
  }),
  displayData: z.string(),
})

type ComponentState = z.infer<typeof ComponentStateSchema>

const EditableMathExample = () => {
  const [state, setState] = useState<ComponentState>({
    latex: '\\frac{1}{2}',
    formData: {value: 0.5, unit: ''},
    displayData: '',
  })

  const evaluateAndRound = (latexString: string) => {
    try {
      const mixedNumberRegex = /(\d+)\\frac{(\d+)}{(\d+)}/g
      const mathExpression = latexString
        .replace(
          mixedNumberRegex,
          (_, whole, numerator, denominator) =>
            `(${whole} + ${numerator}/${denominator})`
        )
        .replace(/\\frac{(\d+)}{(\d+)}/g, '($1/$2)')
        .replace(/\\times/g, '*')
        .replace(/\\div/g, '/')
        .replace(/\\cdot/g, '*')
        .replace(/\\sqrt{(.+?)}/g, 'sqrt($1)')
        .replace(/\\pi/g, 'PI')
        .replace(/(\d+)!/g, 'factorial($1)')

      const result = math.evaluate(mathExpression)
      return result
    } catch (error) {
      console.error('Error evaluating expression:', error)
      return 0
    }
  }

  const handleUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = event.target.value
    setState(prevState => ({
      ...prevState,
      formData: {...prevState.formData, unit: newUnit},
    }))
  }

  useEffect(() => {
    const value = evaluateAndRound(state.latex)
    setState(prevState => ({
      ...prevState,
      formData: {...prevState.formData, value},
    }))
  }, [state.latex])

  useEffect(() => {
    const {value, unit} = state.formData
    if (unit) {
      const fraction = math.fraction(value)
      const displayValue =
        fraction.n === fraction.d
          ? '1'
          : fraction.n > fraction.d
            ? `${Math.floor(fraction.n / fraction.d)} ${fraction.n % fraction.d}/${fraction.d}`
            : `${fraction.n}/${fraction.d}`
      setState(prevState => ({
        ...prevState,
        displayData: `${displayValue} ${unit}`,
      }))
    } else {
      setState(prevState => ({...prevState, displayData: ''}))
    }
  }, [state.formData])

  const validateState = () => {
    try {
      ComponentStateSchema.parse(state)
      console.log('Component state is valid')
    } catch (error) {
      console.error('Invalid component state:', error)
    }
  }

  return (
    <div>
      <EditableMathField
        latex={state.latex}
        onChange={mathField => {
          const newLatex = mathField.latex()
          setState(prevState => ({...prevState, latex: newLatex}))
        }}
      />
      <p>LaTeX: {state.latex}</p>
      <select onChange={handleUnitChange} value={state.formData.unit}>
        <option value="">Select a unit</option>
        {baseUnits.map(category => (
          <optgroup key={category.category} label={category.category}>
            {category.units.map(unit => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <h3>Form Data:</h3>
      <pre>{JSON.stringify(state.formData, null, 2)}</pre>
      <h3>Display Data:</h3>
      <p>{state.displayData}</p>
      <button onClick={validateState}>Validate State</button>
    </div>
  )
}

export default Test
