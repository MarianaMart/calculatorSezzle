interface CalculatorDisplayProps {
  display: string
  expression?: string
}

function CalculatorDisplay({
  display,
  expression,
}: CalculatorDisplayProps) {
  return (
    <div className="calculator-display">
      <div className="calculator-expression">
        {expression || '\u00A0'}
      </div>

      <output
        className="calculator-value"
        aria-label="Calculator display"
      >
        {display}
      </output>
    </div>
  )
}

export default CalculatorDisplay