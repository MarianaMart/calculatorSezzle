package calculator

import "errors"

type Operation string

const (
	OperationAdd      Operation = "add"
	OperationSubtract Operation = "subtract"
	OperationMultiply Operation = "multiply"
	OperationDivide   Operation = "divide"
)

var (
	ErrDivisionByZero   = errors.New("division by zero is not allowed")
	ErrInvalidOperation = errors.New("invalid operation")
)

func Calculate(operation Operation, operand1, operand2 float64) (float64, error) {
	switch operation {
	case OperationAdd:
		return operand1 + operand2, nil

	case OperationSubtract:
		return operand1 - operand2, nil

	case OperationMultiply:
		return operand1 * operand2, nil

	case OperationDivide:
		if operand2 == 0 {
			return 0, ErrDivisionByZero
		}

		return operand1 / operand2, nil

	default:
		return 0, ErrInvalidOperation
	}
}