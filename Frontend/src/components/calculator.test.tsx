import { render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import Calculator from './calculator'
import { calculate } from '../services/calculatorApi'

vi.mock('../services/calculatorApi', () => ({
  calculate: vi.fn(),
}))

const mockedCalculate = vi.mocked(calculate)

describe('Calculator', () => {
  beforeEach(() => {
    mockedCalculate.mockReset()
  })

  it('renders the calculator with zero as initial value', () => {
    render(<Calculator />)

    expect(
        screen.getByLabelText('Calculator display'),
        ).toHaveTextContent('0')
  })

  it('does not call the API when the second operand is missing', async () => {
    const user = userEvent.setup()

    render(<Calculator />)

    await user.click(screen.getByRole('button', { name: '7' }))
    await user.click(screen.getByRole('button', { name: '−' }))
    await user.click(screen.getByRole('button', { name: '=' }))

    expect(mockedCalculate).not.toHaveBeenCalled()
  })

  it('calls the API when the operation is complete', async () => {
    mockedCalculate.mockResolvedValue(4)

    const user = userEvent.setup()

    render(<Calculator />)

    await user.click(screen.getByRole('button', { name: '7' }))
    await user.click(screen.getByRole('button', { name: '−' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: '=' }))

    expect(mockedCalculate).toHaveBeenCalledWith({
      operation: 'subtract',
      operand1: 7,
      operand2: 3,
    })

    await waitFor(() => {
        expect(
            screen.getByLabelText('Calculator display'),
        ).toHaveTextContent('4')
        })
  })

  it('displays Error when the API returns an error', async () => {
    mockedCalculate.mockRejectedValue(
      new Error('division by zero is not allowed'),
    )

    const user = userEvent.setup()

    render(<Calculator />)

    await user.click(screen.getByRole('button', { name: '7' }))
    await user.click(screen.getByRole('button', { name: '÷' }))
    await user.click(screen.getByRole('button', { name: '0' }))
    await user.click(screen.getByRole('button', { name: '=' }))

    expect(await screen.findByText('Error')).toBeInTheDocument()
  })

  it('clears the calculator when AC is pressed', async () => {
  const user = userEvent.setup()

  render(<Calculator />)

  await user.click(screen.getByRole('button', { name: '7' }))
  await user.click(screen.getByRole('button', { name: '5' }))

  expect(
    screen.getByLabelText('Calculator display'),
  ).toHaveTextContent('75')

  await user.click(screen.getByRole('button', { name: 'AC' }))

  expect(
    screen.getByLabelText('Calculator display'),
  ).toHaveTextContent('0')

  expect(mockedCalculate).not.toHaveBeenCalled()
})

it('allows decimal numbers', async () => {
  const user = userEvent.setup()

  render(<Calculator />)

  await user.click(screen.getByRole('button', { name: '1' }))
  await user.click(screen.getByRole('button', { name: '.' }))
  await user.click(screen.getByRole('button', { name: '5' }))

  expect(
    screen.getByLabelText('Calculator display'),
  ).toHaveTextContent('1.5')
})

it('does not allow more than one decimal point', async () => {
  const user = userEvent.setup()

  render(<Calculator />)

  await user.click(screen.getByRole('button', { name: '1' }))
  await user.click(screen.getByRole('button', { name: '.' }))
  await user.click(screen.getByRole('button', { name: '5' }))
  await user.click(screen.getByRole('button', { name: '.' }))
  await user.click(screen.getByRole('button', { name: '2' }))

  expect(
    screen.getByLabelText('Calculator display'),
  ).toHaveTextContent('1.52')
})

it.each([
  {
    symbol: '+',
    operation: 'add' as const,
    expectedResult: 12,
  },
  {
    symbol: '−',
    operation: 'subtract' as const,
    expectedResult: 2,
  },
  {
    symbol: '×',
    operation: 'multiply' as const,
    expectedResult: 35,
  },
  {
    symbol: '÷',
    operation: 'divide' as const,
    expectedResult: 1.4,
  },
])(
  'sends the correct request for $operation',
  async ({ symbol, operation, expectedResult }) => {
    mockedCalculate.mockResolvedValue(expectedResult)

    const user = userEvent.setup()

    render(<Calculator />)

    await user.click(screen.getByRole('button', { name: '7' }))
    await user.click(screen.getByRole('button', { name: symbol }))
    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: '=' }))

    expect(mockedCalculate).toHaveBeenCalledWith({
      operation,
      operand1: 7,
      operand2: 5,
    })

    await waitFor(() => {
      expect(
        screen.getByLabelText('Calculator display'),
      ).toHaveTextContent(String(expectedResult))
    })
  },
)
})