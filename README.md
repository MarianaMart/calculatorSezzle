# Sezzle Full-Stack Calculator

A full-stack calculator application built with **React, TypeScript, Vite, and Go**.

The application provides a responsive calculator interface that communicates with a Go REST API to perform arithmetic operations.

The implementation focuses on correctness, maintainability, clear separation of concerns, input validation, error handling, and automated testing.

---

## Features

- Addition
- Subtraction
- Multiplication
- Division
- Decimal number support
- Division-by-zero validation
- Strict API request validation
- Responsive user interface
- User-friendly error handling
- Frontend unit tests
- Backend unit tests
- API service tests

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Vitest
- React Testing Library
- Testing Library User Event
- ESLint

### Backend

- Go
- `net/http`
- `encoding/json`
- Go standard `testing` package
- `httptest`

No external HTTP framework is required by the backend.

---

## Architecture

The application follows a simple layered architecture:

```text
┌─────────────────────────┐
│     React Frontend      │
│                         │
│   Calculator UI         │
└────────────┬────────────┘
             │
             │ POST /api/calculate
             ▼
┌─────────────────────────┐
│    calculatorApi.ts     │
└────────────┬────────────┘
             │
             │ Vite development proxy
             ▼
┌─────────────────────────┐
│       Go REST API       │
│                         │
│   CalculateHandler      │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Calculator Service    │
│                         │
│   Add                   │
│   Subtract              │
│   Multiply              │
│   Divide                │
└─────────────────────────┘
```

The frontend does not perform the arithmetic operation itself.

When the user presses `=`, the calculation is sent to the Go backend and the result returned by the API is displayed in the calculator.

---

## Prerequisites

Make sure the following tools are installed:

- Go
- Node.js
- npm

Verify the installations with:

```bash
go version
node --version
npm --version
```

---

# Getting Started

The frontend and backend run independently during development.

Both must be running for the complete application to work.

---

## Running the Backend

Navigate to the backend directory:

```bash
cd Backend
```

Start the server:

```bash
go run ./cmd/server
```

The API will start at:

```text
http://localhost:8080
```

The calculator endpoint is:

```text
POST /api/calculate
```

---

## Running the Frontend

Open another terminal and navigate to:

```bash
cd Frontend
```

Install the dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

During development, Vite proxies requests beginning with `/api` to:

```text
http://localhost:8080
```

Therefore the React application can use:

```text
/api/calculate
```

without hardcoding the backend host in the application code.

---

# API Documentation

## Calculate

### Endpoint

```http
POST /api/calculate
```

### Content Type

```http
Content-Type: application/json
```

### Request

```json
{
  "operation": "add",
  "operand1": 10,
  "operand2": 5
}
```

### Successful Response

```json
{
  "result": 15
}
```

HTTP status:

```text
200 OK
```

---

## Supported Operations

| Operation      | API value  | Example  |
| -------------- | ---------- | -------- |
| Addition       | `add`      | `7 + 5`  |
| Subtraction    | `subtract` | `7 - 5`  |
| Multiplication | `multiply` | `7 × 5`  |
| Division       | `divide`   | `10 ÷ 2` |

---

## API Examples

### Addition

Request:

```json
{
  "operation": "add",
  "operand1": 10,
  "operand2": 5
}
```

Response:

```json
{
  "result": 15
}
```

---

### Subtraction

Request:

```json
{
  "operation": "subtract",
  "operand1": 10,
  "operand2": 5
}
```

Response:

```json
{
  "result": 5
}
```

---

### Multiplication

Request:

```json
{
  "operation": "multiply",
  "operand1": 8,
  "operand2": 4
}
```

Response:

```json
{
  "result": 32
}
```

---

### Division

Request:

```json
{
  "operation": "divide",
  "operand1": 10,
  "operand2": 2
}
```

Response:

```json
{
  "result": 5
}
```

---

# Error Handling

## Division by Zero

Request:

```json
{
  "operation": "divide",
  "operand1": 10,
  "operand2": 0
}
```

Response:

```json
{
  "error": "division by zero is not allowed"
}
```

HTTP status:

```text
400 Bad Request
```

---

## Invalid Operation

Request:

```json
{
  "operation": "invalid",
  "operand1": 10,
  "operand2": 5
}
```

Response:

```json
{
  "error": "invalid operation"
}
```

HTTP status:

```text
400 Bad Request
```

---

## Missing Operand

Example:

```json
{
  "operation": "add",
  "operand1": 10
}
```

Response:

```json
{
  "error": "operand2 is required"
}
```

HTTP status:

```text
400 Bad Request
```

---

## Invalid JSON

Malformed or unsupported request bodies return:

```json
{
  "error": "invalid request body"
}
```

with:

```text
400 Bad Request
```

---

## Unsupported HTTP Method

For example:

```http
GET /api/calculate
```

returns:

```json
{
  "error": "method not allowed"
}
```

with:

```text
405 Method Not Allowed
```

---

# Testing

The frontend and backend are tested independently so that each layer can be validated in isolation.

---

## Backend Tests

Navigate to:

```bash
cd Backend
```

Run all tests:

```bash
go test ./...
```

Run the tests with coverage:

```bash
go test ./... -cover
```
---

## Frontend Tests

Navigate to:

```bash
cd Frontend
```

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate the coverage report:

```bash
npm run test:coverage
```
The UI tests mock the API service so that component behavior can be tested independently from the Go server.

The API service is tested separately by mocking `fetch`.

---

# Code Quality

## Frontend Linting

Run:

```bash
cd Frontend
npm run lint
```

ESLint is configured to ignore generated directories such as:

```text
dist/
coverage/
```

---

# Future Improvements

Potential future improvements include:

- Exponentiation
- Square root
- Percentage operations
- Keyboard support
- Calculation history
- Additional accessibility improvements
- Dockerized deployment

These enhancements are intentionally kept separate from the required implementation so that the core solution remains focused and maintainable.

---

## Author

**Mariana Rodriguez**
