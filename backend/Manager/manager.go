package Manager

import (
	"github.com/gorilla/websocket"
)

type Manager struct {
	clients map[*websocket.Conn]bool
}

type Client struct {
	conn *websocket.Conn
}
