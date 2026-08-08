interface CalculatorButtonProps {
  label: string
  onClick: () => void
  className?: string
}

function CalculatorButton({
  label,
  onClick,
  className = '',
}: CalculatorButtonProps) {
  return (
    <button
      type="button"
      className={`calculator-button ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default CalculatorButton