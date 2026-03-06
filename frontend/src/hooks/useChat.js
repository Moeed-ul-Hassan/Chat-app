import { useState, useEffect, useCallback, useRef } from 'react';

export const useChat = (room, username, password) => {
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const [typingUsers, setTypingUsers] = useState(new Set());
    const socketRef = useRef(null);
    const typingTimeoutRef = useRef({});

    const clearMessages = () => setMessages([]);

    const encrypt = (text, key) => {
        if (!key) return text;
        try {
            const xor = text.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))).join('');
            return btoa(unescape(encodeURIComponent(xor)));
        } catch (e) { return text; }
    };

    const decrypt = (text, key) => {
        if (!key) return text;
        try {
            const xor = decodeURIComponent(escape(atob(text)));
            return xor.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))).join('');
        } catch (e) { return text; }
    };

    const connect = useCallback(() => {
        if (!room || !username) return;

        // Backend URL (Use VITE_BACKEND_URL for production, fallback to localhost for dev)
        const backendHost = import.meta.env.VITE_BACKEND_URL || 'localhost:8080';
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const socketUrl = `${protocol}//${backendHost}/ws?room=${encodeURIComponent(room)}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password || '')}`;

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
                let content = data.content || '';

                if (content.startsWith('E2EE|')) {
                    if (password) {
                        content = decrypt(content.replace('E2EE|', ''), password);
                    } else {
                        content = "🔒 [Encrypted Message]";
                    }
                }

                // Robust check for simulated bot responses
                const botPrefixRegex = /^BOT_RESPONSE\|/i;
                if (botPrefixRegex.test(content.trim())) {
                    const actualMessage = content.trim().replace(botPrefixRegex, '');
                    setMessages((prev) => [...prev, {
                        username: 'Jarvis AI',
                        content: actualMessage,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }]);
                    return;
                }

                if (data.type === 'auth_error') {
                    setError(data.content);
                    if (socketRef.current) socketRef.current.close();
                    return;
                }

                if (data.type === 'typing') {
                    if (data.username === username) return; // ignore our own
                    setTypingUsers(prev => {
                        const newSet = new Set(prev);
                        newSet.add(data.username);
                        return newSet;
                    });
                    if (typingTimeoutRef.current[data.username]) {
                        clearTimeout(typingTimeoutRef.current[data.username]);
                    }
                    typingTimeoutRef.current[data.username] = setTimeout(() => {
                        setTypingUsers(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(data.username);
                            return newSet;
                        });
                    }, 3000);
                    return;
                }

                if (data.type === 'reaction') {
                    setMessages(prev => prev.map(msg => {
                        if (msg.id === data.targetId) {
                            return { ...msg, reactions: { ...(msg.reactions || {}), [data.username]: data.reaction } };
                        }
                        return msg;
                    }));
                    return;
                }

                if (data.type === 'read') {
                    if (data.username !== username) {
                        setMessages(prev => prev.map(msg => {
                            if (msg.username === username && !msg.read) {
                                return { ...msg, read: true };
                            }
                            return msg;
                        }));
                    }
                    return;
                }

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

    const sendMessage = (content, type = 'chat', fileName = null) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            let payloadContent = content;
            if (password && typeof content === 'string' && type === 'chat' && !content.startsWith('BOT_RESPONSE|')) {
                const encrypted = encrypt(content, password);
                if (encrypted !== content) payloadContent = 'E2EE|' + encrypted;
            }

            const message = {
                id: Math.random().toString(36).substr(2, 9),
                username,
                content: payloadContent,
                type,
                room,
                fileName
            };
            socketRef.current.send(JSON.stringify(message));
        } else {
            console.warn('Cannot send message: WebSocket not open');
        }
    };

    const sendTyping = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: 'typing', room, username }));
        }
    };

    const sendReaction = (targetId, reaction) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: 'reaction', room, username, targetId, reaction }));
        }
    };

    const sendReadReceipt = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: 'read', room, username }));
        }
    };

    // Auto-send read receipts when messages change (if we are looking at them)
    // We'll expose this so the UI can call it when appropriate, or call it automatically.
    useEffect(() => {
        const unreadFromOthers = messages.some(m => m.username !== username && !m.read && m.type === 'chat');
        if (unreadFromOthers && connected) {
            sendReadReceipt();
            // Optimistically update our own view so we don't spam
            setMessages(prev => prev.map(m => m.username !== username ? { ...m, read: true } : m));
        }
    }, [messages, username, connected]);

    return {
        messages,
        connected,
        error,
        sendMessage,
        clearMessages,
        sendTyping,
        sendReaction,
        typingUsers: Array.from(typingUsers),
        socket: socketRef.current
    };
};
