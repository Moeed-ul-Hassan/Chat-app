import React, { useState, useEffect, useRef } from 'react';
import { Send, Hash, User, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatRoom = ({ room, username, messages, connected, onSendMessage }) => {
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto bg-chat-bg/50 backdrop-blur-xl border-x border-white/10 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-chat-accent/20 rounded-lg text-chat-accent">
                        <Hash size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg leading-tight">{room}</h2>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Circle size={8} className={connected ? 'fill-emerald-500 text-emerald-500' : 'fill-rose-500 text-rose-500'} />
                            {connected ? 'Connected' : 'Disconnected'}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                    <User size={14} className="text-slate-400" />
                    <span className="text-sm font-medium">{username}</span>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
                <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => {
                        const isMe = msg.username === username;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl shadow-sm ${isMe
                                    ? 'bg-chat-user-bubble text-white rounded-tr-none'
                                    : 'bg-chat-bubble text-slate-100 rounded-tl-none border border-white/5'
                                    }`}>
                                    {!isMe && (
                                        <div className="text-[10px] font-bold text-chat-accent mb-1 uppercase tracking-wider">
                                            {msg.username}
                                        </div>
                                    )}
                                    <p className="text-[15px] leading-relaxed break-words">{msg.content}</p>
                                    <div className={`text-[10px] mt-1 opacity-50 ${isMe ? 'text-right' : 'text-left'}`}>
                                        {msg.timestamp}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-white/5 border-t border-white/10">
                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Message #general..."
                        className="w-full bg-chat-secondary border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-chat-accent/50 transition-all placeholder:text-slate-500"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="p-3 bg-chat-accent text-slate-900 rounded-xl hover:bg-chat-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-chat-accent/20"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatRoom;
