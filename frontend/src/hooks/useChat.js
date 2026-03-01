import { useState, useEffect, useCallback, useRef } from 'react';

export const useChat = (room, username) => {
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const socketRef = useRef(null);

    const connect = useCallback(() => {
        if (!room || !username) return;

        // Backend URL (User handles this on :8080)
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const socketUrl = `${protocol}//localhost:8080/ws?room=${encodeURIComponent(room)}&username=${encodeURIComponent(username)}`;

        const socket = new WebSocket(socketUrl);
        socketRef.current = socket;

        socket.onopen = () => {
            setConnected(true);
            setError(null);
            console.log('WebSocket Connected');
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setMessages((prev) => [...prev, {
                    ...data,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            } catch (err) {
                console.error('Failed to parse message:', err);
            }
        };

        socket.onclose = () => {
            setConnected(false);
            console.log('WebSocket Disconnected');
            // Auto-reconnect after 3 seconds
            setTimeout(connect, 3000);
        };

        socket.onerror = (err) => {
            setError('Connection error occurred');
            console.error('WebSocket Error:', err);
        };

        return () => socket.close();
    }, [room, username]);

    useEffect(() => {
        if (room && username) {
            connect();
        }
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [room, username, connect]);

    const sendMessage = (content) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const message = {
                username,
                content,
                type: 'chat',
                room
            };
            socketRef.current.send(JSON.stringify(message));
        } else {
            console.warn('Cannot send message: WebSocket not open');
        }
    };

    return { messages, connected, error, sendMessage };
};
