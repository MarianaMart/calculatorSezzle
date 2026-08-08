export type Operation =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'

export interface CalculateRequest {
  operation: Operation
  operand1: number
  operand2: number
}

export interface CalculateResponse {
  result: number
}

export interface ApiErrorResponse {
  error: string
}