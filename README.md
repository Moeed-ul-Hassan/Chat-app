# 🚀 Echo: Local Video Call & Chat

Echo is a high-performance, P2P video calling and real-time messaging application designed for local networks. Built with a **Go** backend and a **React + Vite** frontend, it features sleek aesthetics, WebRTC signaling, and gesture-based controls.

![Application Screenshot](./frontend/public/screenshot.png)

---

## ✨ Features

- **📽️ Local Video Calls**: High-quality P2P video/audio streaming over local networks via WebRTC.
- **💬 Real-time Messaging**: Instant communication with a modern, indigo-themed UI.
- **📁 File & Image Sharing**: Send documents and images seamlessly with previews.
- **⚡ Dynamic UI**: Glowing "Thunder" animations and responsive glassmorphism.
- **🏎️ In-Memory Caching**: Fast session and room management using `go-cache`.

---

## 🛠️ Tech Stack

### Backend
- ![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white) 
- **WebSockets**: Gorilla WebSocket for real-time signaling.
- **Caching**: `go-cache` for high-speed local session state.

### Frontend
- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
- **Styling**: Tailwind CSS v4 + Framer Motion for premium animations.
- **Signaling**: Custom WebRTC hooks for P2P connection management.

---

## 🚀 Quick Start

### 1. Setup Backend
```bash
cd backend
go mod tidy
go run main.go
```
*Port: `8080`*

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
*Port: `5173`*

---

## 🌐 Deployment

The application is live and accessible at the following URLs:

- **Frontend (Vercel)**: [https://chat-app-md.vercel.app/](https://chat-app-md.vercel.app/)
- **Backend (Railway)**: [https://chat-app-production-0aff.up.railway.app/](https://chat-app-production-0aff.up.railway.app/)

### ⚙️ Environment Variables

To connect the frontend and backend in production, set the following variables:

#### Vercel (Frontend)
- `VITE_BACKEND_URL`: `chat-app-production-0aff.up.railway.app`
  *(Do not include `https://` or `wss://`)*

#### Railway (Backend)
- `PORT`: (Set automatically by Railway, or defaults to `8080`)


---

## 📁 Project Structure

```bash
├── backend/            # Go Backend (Signaling & Caching)
│   ├── Manager/        # Session Management
│   └── main.go         # Entry point & WS Relay
├── frontend/           # React Frontend (Vite)
│   ├── src/
│   │   ├── components/ # VideoCall, ChatRoom, Login
│   │   ├── hooks/      # useVideoCall, useChat
│   │   └── App.jsx     # Main Application Logic
└── README.md           # Documentation
```

---

## 📄 License
This project is licensed under the MIT License. Developed by **Sr. Moeed ul Hassan**.
