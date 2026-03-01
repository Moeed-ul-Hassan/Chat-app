import React, { useState } from 'react';
import { MessageSquare, User, Hash, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = ({ onJoin }) => {
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('General');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim() && room.trim()) {
            onJoin(username, room);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-chat-user-bubble/20 via-chat-bg to-chat-bg">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="flex justify-center mb-8">
                    <div className="p-4 bg-chat-accent/10 rounded-2xl border border-chat-accent/20">
                        <MessageSquare size={48} className="text-chat-accent" />
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Welcome</h1>
                        <p className="text-slate-400">Join a room to start chatting</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-chat-secondary border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-chat-accent/50 transition-all"
                                    placeholder="Enter your name..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Room Name</label>
                            <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={room}
                                    onChange={(e) => setRoom(e.target.value)}
                                    className="w-full bg-chat-secondary border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-chat-accent/50 transition-all"
                                    placeholder="Room name..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full group relative overflow-hidden bg-chat-accent text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-chat-accent/90 transition-all shadow-lg shadow-chat-accent/20"
                        >
                            Connect Now
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-slate-500 text-sm">
                    Go Backend Powered • Real-time Distributed Chat
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
