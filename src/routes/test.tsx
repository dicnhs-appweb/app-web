import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from "react";
import { EditableMathField, StaticMathField } from '../features/calculator/types/mathquill-loader';
import { evaluate } from 'mathjs';

export const Route = createFileRoute('/test')({
  component: Test
})

function Test() {
  return (
    <div>
      <h2>Editable Math Field</h2>
      <EditableMathExample />
    </div>
  )
}

const EditableMathExample = () => {
  const [latex, setLatex] = useState("\\frac{1}{\\sqrt{2}}\\cdot 2");
  const [integerValue, setIntegerValue] = useState(0);

  const evaluateAndRound = (latexString: string) => {
    try {
      const result = evaluate(latexString);
      return Math.round(result);
    } catch (error) {
      console.error("Error evaluating expression:", error);
      return 0;
    }
  };

  return (
    <div>
      <EditableMathField
        latex={latex}
        onChange={(mathField) => {
          const newLatex = mathField.latex();
          setLatex(newLatex);
          console.log(newLatex);
          setIntegerValue(evaluateAndRound(newLatex));
        }}
      />
      <p>LaTeX: {latex}</p>
      <p>Integer Value: {integerValue}</p>
    </div>
  );
};