import { useState } from 'react'
import { calculate } from './services/calculatorApi'

function App() {
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTest = async () => {
    try {
      setError(null)

      const value = await calculate({
        operation: 'add',
        operand1: 10,
        operand2: 5,
      })

      setResult(value)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred',
      )
    }
  }

  return (
    <main>
      <h1>Calculator</h1>

      <button onClick={handleTest}>
        Test API
      </button>

      {result !== null && <p>Result: {result}</p>}

      {error && <p>Error: {error}</p>}
    </main>
  )
}

export default App