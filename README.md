# 🚀 Real-time Chat Application

A high-performance, room-based chat application built with a **Go (Gorilla WebSocket)** backend and a **React + Vite** frontend. Experience seamless, real-time communication with a sleek, modern UI.

---

## ✨ Features

- **Real-time Messaging**: Instant communication via WebSockets.
- **Room System**: Join specific rooms to chat with groups of people.
- **Modern UI/UX**: Built with React, Tailwind CSS, and Framer Motion for smooth animations.
- **Robust Backend**: Scalable Go backend using the Gorilla WebSocket library.
- **Responsive Design**: Works perfectly across all devices.

---

## 🛠️ Tech Stack

### Backend
- ![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white) **Go (Golang)**
- ![Gorilla WebSocket](https://img.shields.io/badge/Gorilla-WebSocket-blue?style=for-the-badge) **Gorilla WebSocket**

### Frontend
- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **React 19**
- ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) **Vite**
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) **Tailwind CSS v4**
- ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white) **Framer Motion**

---

## 🚀 Getting Started

### Prerequisites
- [Go](https://go.dev/doc/install) (1.25.0 or later)
- [Node.js](https://nodejs.org/) & [npm](https://www.npmjs.com/get-npm)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Moeed-ul-Hassan/chatapp.git
cd chatapp
```

### Step 2: Setup Backend
```bash
cd backend
go mod tidy
go run main.go
```
*The backend will start on `http://localhost:8080`*

### Step 3: Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
*The frontend will start on `http://localhost:5173`*

---

## 📁 Project Structure

```bash
├── backend/            # Go Backend
│   ├── Manager/        # Chat Room & Client Management
│   ├── main.go         # Entry point & WebSocket handling
│   └── go.mod          # Dependencies
├── frontend/           # React Frontend (Vite)
│   ├── src/
│   │   ├── components/ # UI Components (Login, ChatRoom)
│   │   ├── hooks/      # Custom WebSocket hook (useChat)
│   │   └── App.jsx     # Main Application logic
│   └── tailwind.config.js
└── README.md           # Documentation
```

---

## 📝 Roadmap
- [x] WebSocket Connection
- [x] Initial UI Design
- [ ] Multi-user Broadcasting
- [ ] User Authentication
- [ ] Message Persistence (Database)

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License
This project is licensed under the MIT License.
