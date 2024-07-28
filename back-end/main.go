package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

var canvas struct {
	mux sync.Mutex
	Val [75][150][3]uint8 `json:"val"`
}

func getCanvasHandler(w http.ResponseWriter, r *http.Request) {
	json, _ := json.Marshal(canvas.Val)
	w.Write(json)
	w.WriteHeader(200)
}

func postSetPixelsHandler(w http.ResponseWriter, r *http.Request) {
	var changes struct {
		Poses  [][2]int16 `json:"poses"`
		Values [][3]uint8 `json:"values"`
	}
	err := json.NewDecoder(r.Body).Decode(&changes)
	if err != nil {
		fmt.Println("Error occured", err.Error())
		w.WriteHeader(400)
		return
	}
	canvas.mux.Lock()
	for i, pos := range changes.Poses {
		canvas.Val[pos[1]][pos[0]] = changes.Values[i]
	}
	canvas.mux.Unlock()
	w.WriteHeader(200)
}

func init() {
	_, err := os.Stat("canvas.json")
	if errors.Is(err, os.ErrNotExist) {
		for y, line := range canvas.Val {
			for x, _ := range line {
				canvas.Val[y][x] = [3]uint8{0, 0, 0}
			}
		}
	} else {
		data, _ := os.ReadFile("canvas.json")
		json.Unmarshal(data, &canvas)

	}
}

func saveCurrentCanvas() {
	for {
		log.Println("Saving canvas...")
		canvas.mux.Lock()
		json, _ := json.MarshalIndent(canvas, "", " ")
		canvas.mux.Unlock()
		os.WriteFile("canvas.json", json, 0644)

		time.Sleep(15 * time.Second)
	}
}

func main() {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	r.Get("/canvas", getCanvasHandler)
	r.Post("/set-pixels", postSetPixelsHandler)

	go saveCurrentCanvas()

	fmt.Println("Listening on :3000")
	http.ListenAndServe(":3000", r)
}
