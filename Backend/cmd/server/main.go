package main

import (
	"log"
	"net/http"
	"time"

	httpapi "sezzle-calculator/backend/internal/http"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/calculate", httpapi.CalculateHandler)

	server := &http.Server{
		Addr:              ":8080",
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Println("server running on http://localhost:8080")

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server failed: %v", err)
	}
}