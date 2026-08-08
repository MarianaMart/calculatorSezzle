import { useState } from 'react'

import { calculate } from '../services/calculatorApi'
import type { Operation } from '../types/calculator'

import CalculatorButton from './calculatorButton'
import CalculatorDisplay from './calculatorDisplay'
import './Calculator.css'

const operationSymbols: Record<Operation, string> = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
}

function Calculator() {
  const [display, setDisplay] = useState('0')
  const [firstOperand, setFirstOperand] = useState<number | null>(null)
  const [operation, setOperation] = useState<Operation | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNumber = (digit: string) => {
    setError(null)

    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
      return
    }

    if (display === '0') {
      setDisplay(digit)
      return
    }

    setDisplay((current) => current + digit)
  }

  const handleDecimal = () => {
    setError(null)

    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }

    if (!display.includes('.')) {
      setDisplay((current) => current + '.')
    }
  }

  const handleOperation = (nextOperation: Operation) => {
    setError(null)

    const currentValue = Number(display)

    setFirstOperand(currentValue)
    setOperation(nextOperation)
    setWaitingForOperand(true)
  }

    const handleCalculate = async () => {
    if (
        firstOperand === null ||
        operation === null ||
        waitingForOperand
    ) {
        return
    }

    const secondOperand = Number(display)

    try {
        setError(null)

        const result = await calculate({
        operation,
        operand1: firstOperand,
        operand2: secondOperand,
        })

        setDisplay(String(result))
        setFirstOperand(null)
        setOperation(null)
        setWaitingForOperand(true)
    } catch {
        setError('Error')
        setFirstOperand(null)
        setOperation(null)
        setWaitingForOperand(true)
    }
    }

  const handleClear = () => {
    setDisplay('0')
    setFirstOperand(null)
    setOperation(null)
    setWaitingForOperand(false)
    setError(null)
  }

  const expression =
    firstOperand !== null && operation !== null
      ? `${firstOperand} ${operationSymbols[operation]}`
      : ''

  return (
    <div className="calculator">
      <CalculatorDisplay
        display={error ?? display}
        expression={expression}
      />

      <div className="calculator-grid">
        <CalculatorButton
            label="AC"
            onClick={handleClear}
            className="clear"
        />

        <CalculatorButton
            label="÷"
            onClick={() => handleOperation('divide')}
            className="operator"
        />

        <CalculatorButton
            label="7"
            onClick={() => handleNumber('7')}
        />

        <CalculatorButton
            label="8"
            onClick={() => handleNumber('8')}
        />

        <CalculatorButton
            label="9"
            onClick={() => handleNumber('9')}
        />

        <CalculatorButton
            label="×"
            onClick={() => handleOperation('multiply')}
            className="operator"
        />

        <CalculatorButton
            label="4"
            onClick={() => handleNumber('4')}
        />

        <CalculatorButton
            label="5"
            onClick={() => handleNumber('5')}
        />

        <CalculatorButton
            label="6"
            onClick={() => handleNumber('6')}
        />

        <CalculatorButton
            label="−"
            onClick={() => handleOperation('subtract')}
            className="operator"
        />

        <CalculatorButton
            label="1"
            onClick={() => handleNumber('1')}
        />

        <CalculatorButton
            label="2"
            onClick={() => handleNumber('2')}
        />

        <CalculatorButton
            label="3"
            onClick={() => handleNumber('3')}
        />

        <CalculatorButton
            label="+"
            onClick={() => handleOperation('add')}
            className="operator"
        />

        <CalculatorButton
            label="0"
            onClick={() => handleNumber('0')}
            className="zero"
        />

        <CalculatorButton
            label="."
            onClick={handleDecimal}
        />

        <CalculatorButton
            label="="
            onClick={handleCalculate}
            className="equals"
        />
        </div>
    </div>
  )
}

export default Calculator