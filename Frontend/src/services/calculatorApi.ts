import type {
  ApiErrorResponse,
  CalculateRequest,
  CalculateResponse,
} from '../types/calculator'

export async function calculate(
  request: CalculateRequest,
): Promise<number> {
  const response = await fetch('/api/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorResponse: ApiErrorResponse = await response.json()

    throw new Error(errorResponse.error)
  }

  const data: CalculateResponse = await response.json()

  return data.result
}