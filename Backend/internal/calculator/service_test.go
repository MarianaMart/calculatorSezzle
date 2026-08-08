package calculator

import (
	"errors"
	"testing"
)

func TestCalculate(t *testing.T) {
	tests := []struct {
		name          string
		operation     Operation
		operand1      float64
		operand2      float64
		expected      float64
		expectedError error
	}{
		{
			name:      "addition",
			operation: OperationAdd,
			operand1:  10,
			operand2:  5,
			expected:  15,
		},
		{
			name:      "subtraction",
			operation: OperationSubtract,
			operand1:  10,
			operand2:  5,
			expected:  5,
		},
		{
			name:      "multiplication",
			operation: OperationMultiply,
			operand1:  10,
			operand2:  5,
			expected:  50,
		},
		{
			name:      "division",
			operation: OperationDivide,
			operand1:  10,
			operand2:  5,
			expected:  2,
		},
		{
			name:          "division by zero",
			operation:     OperationDivide,
			operand1:      10,
			operand2:      0,
			expectedError: ErrDivisionByZero,
		},
		{
			name:          "invalid operation",
			operation:     Operation("invalid"),
			operand1:      10,
			operand2:      5,
			expectedError: ErrInvalidOperation,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := Calculate(
				tt.operation,
				tt.operand1,
				tt.operand2,
			)

			if tt.expectedError != nil {
				if !errors.Is(err, tt.expectedError) {
					t.Fatalf(
						"expected error %v, got %v",
						tt.expectedError,
						err,
					)
				}

				return
			}

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			if result != tt.expected {
				t.Errorf(
					"expected %v, got %v",
					tt.expected,
					result,
				)
			}
		})
	}
}