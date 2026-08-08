package http

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestCalculateHandlerSuccess(t *testing.T) {
	tests := []struct {
		name           string
		body           string
		expectedResult float64
	}{
		{
			name: "addition",
			body: `{
				"operation": "add",
				"operand1": 10,
				"operand2": 5
			}`,
			expectedResult: 15,
		},
		{
			name: "zero is accepted as operand",
			body: `{
				"operation": "add",
				"operand1": 0,
				"operand2": 5
			}`,
			expectedResult: 5,
		},
		{
			name: "division",
			body: `{
				"operation": "divide",
				"operand1": 10,
				"operand2": 2
			}`,
			expectedResult: 5,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			request := httptest.NewRequest(
				http.MethodPost,
				"/api/calculate",
				strings.NewReader(tt.body),
			)

			recorder := httptest.NewRecorder()

			CalculateHandler(recorder, request)

			if recorder.Code != http.StatusOK {
				t.Fatalf(
					"expected status %d, got %d",
					http.StatusOK,
					recorder.Code,
				)
			}

			if recorder.Header().Get("Content-Type") != "application/json" {
				t.Errorf(
					"expected Content-Type application/json, got %s",
					recorder.Header().Get("Content-Type"),
				)
			}

			var response CalculateResponse

			if err := json.NewDecoder(recorder.Body).Decode(&response); err != nil {
				t.Fatalf("failed to decode response: %v", err)
			}

			if response.Result != tt.expectedResult {
				t.Errorf(
					"expected result %v, got %v",
					tt.expectedResult,
					response.Result,
				)
			}
		})
	}
}

func TestCalculateHandlerErrors(t *testing.T) {
	tests := []struct {
		name          string
		method        string
		body          string
		expectedStatus int
		expectedError string
	}{
		{
			name:           "method not allowed",
			method:         http.MethodGet,
			expectedStatus: http.StatusMethodNotAllowed,
			expectedError:  "method not allowed",
		},
		{
			name:           "invalid JSON",
			method:         http.MethodPost,
			body:           `{"operation":`,
			expectedStatus: http.StatusBadRequest,
			expectedError:  "invalid request body",
		},
		{
			name:   "unknown field",
			method: http.MethodPost,
			body: `{
				"operation": "add",
				"operand1": 10,
				"operand2": 5,
				"unexpected": true
			}`,
			expectedStatus: http.StatusBadRequest,
			expectedError:  "invalid request body",
		},
		{
			name:   "missing operation",
			method: http.MethodPost,
			body: `{
				"operand1": 10,
				"operand2": 5
			}`,
			expectedStatus: http.StatusBadRequest,
			expectedError:  "operation is required",
		},
		{
			name:   "missing operand1",
			method: http.MethodPost,
			body: `{
				"operation": "add",
				"operand2": 5
			}`,
			expectedStatus: http.StatusBadRequest,
			expectedError:  "operand1 is required",
		},
		{
			name:   "missing operand2",
			method: http.MethodPost,
			body: `{
				"operation": "add",
				"operand1": 10
			}`,
			expectedStatus: http.StatusBadRequest,
			expectedError:  "operand2 is required",
		},
		{
			name:   "division by zero",
			method: http.MethodPost,
			body: `{
				"operation": "divide",
				"operand1": 10,
				"operand2": 0
			}`,
			expectedStatus: http.StatusBadRequest,
			expectedError:  "division by zero is not allowed",
		},
		{
			name:   "invalid operation",
			method: http.MethodPost,
			body: `{
				"operation": "banana",
				"operand1": 10,
				"operand2": 5
			}`,
			expectedStatus: http.StatusBadRequest,
			expectedError:  "invalid operation",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			request := httptest.NewRequest(
				tt.method,
				"/api/calculate",
				strings.NewReader(tt.body),
			)

			recorder := httptest.NewRecorder()

			CalculateHandler(recorder, request)

			if recorder.Code != tt.expectedStatus {
				t.Fatalf(
					"expected status %d, got %d",
					tt.expectedStatus,
					recorder.Code,
				)
			}

			var response ErrorResponse

			if err := json.NewDecoder(recorder.Body).Decode(&response); err != nil {
				t.Fatalf("failed to decode error response: %v", err)
			}

			if response.Error != tt.expectedError {
				t.Errorf(
					"expected error %q, got %q",
					tt.expectedError,
					response.Error,
				)
			}
		})
	}
}