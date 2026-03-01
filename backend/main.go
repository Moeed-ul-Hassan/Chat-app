package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024, //How much memory we will allocate for reading the message
	WriteBufferSize: 1024, //How much memory we will allocate for writing the message
	CheckOrigin: func(r *http.Request) bool {
		return true // It is much important as it will allow the connection from the frontend
	},
}

func main() {
	http.HandleFunc("/ws", handleConnections) //connection router

	fmt.Println("Chat server started on :8080")
	// Start the server
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("500 | Error starting server:", err)
	}
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	// Upgrade the connection to a WebSocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error upgrading connection:", err)
		return
	}
	defer ws.Close()

	fmt.Println("Client connected")

	// Loop to read messages from the client
	for {
		// Read message from client
		messageType, p, err := ws.ReadMessage()
		if err != nil {
			fmt.Println("Error reading message:", err)
			break
		}

		// Print the message
		fmt.Printf("Received: %s\n", p)

		// Echo the message back to the client
		if err = ws.WriteMessage(messageType, p); err != nil {
			fmt.Println("Error writing message:", err)
			break
		}
	}
}
