import { afterEach, describe, expect, it, vi } from 'vitest'

import { calculate } from './calculatorApi'
import type { CalculateRequest } from '../types/calculator'

describe('calculatorApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends the correct request and returns the calculation result', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        result: 15,
      }),
    })

    vi.stubGlobal('fetch', fetchMock)

    const request: CalculateRequest = {
      operation: 'add',
      operand1: 10,
      operand2: 5,
    }

    const result = await calculate(request)

    expect(result).toBe(15)

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/calculate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      },
    )
  })

  it('throws the API error when the response is not successful', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({
        error: 'division by zero is not allowed',
      }),
    })

    vi.stubGlobal('fetch', fetchMock)

    const request: CalculateRequest = {
      operation: 'divide',
      operand1: 10,
      operand2: 0,
    }

    await expect(calculate(request)).rejects.toThrow(
      'division by zero is not allowed',
    )
  })

  it('propagates network errors', async () => {
    const fetchMock = vi.fn().mockRejectedValue(
      new Error('Network error'),
    )

    vi.stubGlobal('fetch', fetchMock)

    const request: CalculateRequest = {
      operation: 'add',
      operand1: 10,
      operand2: 5,
    }

    await expect(calculate(request)).rejects.toThrow(
      'Network error',
    )
  })
})