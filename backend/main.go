package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"

	"os"

	"github.com/gorilla/websocket"
	"github.com/patrickmn/go-cache"
)

var (
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	// Initialize cache with 5 minute default expiration and 10 minute cleanup
	c = cache.New(5*time.Minute, 10*time.Minute)
	// Mutex for managing connections safely
	clientsMu     sync.Mutex
	clients       = make(map[string]map[*websocket.Conn]string) // room -> conn -> username
	roomPasswords = make(map[string]string)                     // room -> password
)

type Message struct {
	Type     string `json:"type"`
	ID       string `json:"id,omitempty"`
	TargetID string `json:"targetId,omitempty"` // For linking reactions/reads to specific messages
	Room     string `json:"room"`
	Username string `json:"username"`
	Content  string `json:"content"`
	FileName string `json:"fileName,omitempty"`
	Reaction string `json:"reaction,omitempty"`
}

func main() {
	http.HandleFunc("/ws", handleConnections)

	// Get port from environment variable for Railway deployment
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Video Call Signaling Server started on :%s\n", port)
	err := http.ListenAndServe("0.0.0.0:"+port, nil)
	if err != nil {
		fmt.Printf("Error starting server on port %s: %v\n", port, err)
	}
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error upgrading connection:", err)
		return
	}
	defer ws.Close()

	room := r.URL.Query().Get("room")
	username := r.URL.Query().Get("username")
	password := r.URL.Query().Get("password")

	if room == "" || username == "" {
		fmt.Println("Missing room or username")
		return
	}

	clientsMu.Lock()
	// Check/Set room password
	if storedPassword, exists := roomPasswords[room]; exists {
		if storedPassword != password {
			clientsMu.Unlock()
			fmt.Printf("User %s rejected from room %s (wrong password)\n", username, room)
			ws.WriteJSON(Message{Type: "auth_error", Content: "Invalid secret key for this room"})
			return
		}
	} else {
		// First user sets the password
		roomPasswords[room] = password
		fmt.Printf("Room %s created with password protection\n", room)
	}

	if _, ok := clients[room]; !ok {
		clients[room] = make(map[*websocket.Conn]string)
	}

	// Check if user already exists in this room and close their old connection
	for conn, name := range clients[room] {
		if name == username {
			fmt.Printf("Closing stale connection for user %s in room %s\n", username, room)
			conn.Close()
			delete(clients[room], conn)
		}
	}

	clients[room][ws] = username
	clientsMu.Unlock()

	// Store session in cache
	c.Set(fmt.Sprintf("user:%s:%s", room, username), time.Now().Format(time.RFC3339), cache.DefaultExpiration)

	fmt.Printf("User %s joined room %s\n", username, room)

	defer func() {
		clientsMu.Lock()
		delete(clients[room], ws)
		if len(clients[room]) == 0 {
			delete(clients, room)
			delete(roomPasswords, room)
		}
		clientsMu.Unlock()
		fmt.Printf("User %s left room %s\n", username, room)
	}()

	for {
		_, p, err := ws.ReadMessage()
		if err != nil {
			break
		}

		var msg Message
		if err := json.Unmarshal(p, &msg); err != nil {
			fmt.Println("Error unmarshaling message:", err)
			continue
		}

		// Broadcast to others in the same room (Signaling should skip sender)
		echoToSender := msg.Type == "chat"
		broadcast(msg, ws, echoToSender)
	}
}

func broadcast(msg Message, sender *websocket.Conn, echoToSender bool) {
	clientsMu.Lock()
	defer clientsMu.Unlock()

	for client := range clients[msg.Room] {
		if client != sender || echoToSender {
			err := client.WriteJSON(msg)
			if err != nil {
				fmt.Printf("Error broadcasting to %s: %v\n", clients[msg.Room][client], err)
				client.Close()
				delete(clients[msg.Room], client)
			}
		}
	}
}
