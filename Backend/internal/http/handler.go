package http

import (
	"encoding/json"
	"errors"
	"net/http"
	"sezzle-calculator/backend/internal/calculator"
)

type CalculateRequest struct {
	Operation calculator.Operation `json:"operation"`
	Operand1  *float64             `json:"operand1"`
	Operand2  *float64             `json:"operand2"`
}

type CalculateResponse struct {
	Result float64 `json:"result"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

func CalculateHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Allow", http.MethodPost)
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}

	var request CalculateRequest

	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if request.Operation == "" {
		writeError(w, http.StatusBadRequest, "operation is required")
		return
	}

	if request.Operand1 == nil {
		writeError(w, http.StatusBadRequest, "operand1 is required")
		return
	}

	if request.Operand2 == nil {
		writeError(w, http.StatusBadRequest, "operand2 is required")
		return
	}

	result, err := calculator.Calculate(
		request.Operation,
		*request.Operand1,
		*request.Operand2,
	)

	if err != nil {
		switch {
		case errors.Is(err, calculator.ErrDivisionByZero):
			writeError(w, http.StatusBadRequest, err.Error())

		case errors.Is(err, calculator.ErrInvalidOperation):
			writeError(w, http.StatusBadRequest, err.Error())

		default:
			writeError(w, http.StatusInternalServerError, "internal server error")
		}

		return
	}

	writeJSON(
		w,
		http.StatusOK,
		CalculateResponse{
			Result: result,
		},
	)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(
		w,
		status,
		ErrorResponse{
			Error: message,
		},
	)
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	_ = json.NewEncoder(w).Encode(data)
}
