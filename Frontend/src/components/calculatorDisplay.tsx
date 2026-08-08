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

      <div className="calculator-value">
        {display}
      </div>
    </div>
  )
}

export default CalculatorDisplay