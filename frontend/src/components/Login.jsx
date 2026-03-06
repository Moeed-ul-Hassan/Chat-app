import React, { useState } from 'react';
import { MessageSquare, User, Hash, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = ({ onJoin }) => {
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('General');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim() && room.trim()) {
            let actualRoom = room.trim();
            if (actualRoom.toLowerCase() === 'general' && password.trim() !== '') {
                actualRoom = 'Private';
            }
            onJoin(username, actualRoom, password);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f8fafc] relative overflow-hidden">
            {/* Soft Background Accents */}
            <motion.div
                animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ede9fe] rounded-full blur-[100px] opacity-60"
            />
            <motion.div
                animate={{ x: [0, 30, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#e0e7ff] rounded-full blur-[100px] opacity-60"
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white/80 backdrop-blur-[16px] rounded-[2.5rem] p-6 sm:p-10 shadow-[0_20px_50px_rgba(139,92,246,0.08)] border border-white">
                    <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] rounded-3xl flex items-center justify-center shadow-lg shadow-violet-200 mb-6"
                        >
                            <MessageSquare size={32} sm:size={36} className="text-white" />
                        </motion.div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">Good Day!</h1>
                        <p className="text-sm sm:text-base text-slate-500 font-medium">Welcome to Echo Grid</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-bold text-slate-400 ml-1">Identity</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#8b5cf6] transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-[#f1f5f9]/50 border-2 border-transparent rounded-[1.25rem] pl-11 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base text-slate-700 focus:outline-none focus:bg-white focus:border-[#8b5cf6]/20 transition-all font-medium"
                                    placeholder="Enter username"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-bold text-slate-400 ml-1">Frequency</label>
                            <div className="relative group">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#8b5cf6] transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={room}
                                    onChange={(e) => setRoom(e.target.value)}
                                    className="w-full bg-[#f1f5f9]/50 border-2 border-transparent rounded-[1.25rem] pl-11 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base text-slate-700 focus:outline-none focus:bg-white focus:border-[#8b5cf6]/20 transition-all font-medium"
                                    placeholder="Room name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-bold text-slate-400 ml-1">Secret Key (Optional)</label>
                            <div className="relative group">
                                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#8b5cf6] transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#f1f5f9]/50 border-2 border-transparent rounded-[1.25rem] pl-11 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base text-slate-700 focus:outline-none focus:bg-white focus:border-[#8b5cf6]/20 transition-all font-medium"
                                    placeholder="Enter room password"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-[#8b5cf6] text-white font-black py-4 sm:py-4.5 rounded-[1.25rem] flex items-center justify-center gap-3 hover:bg-[#7c3aed] transition-all shadow-xl shadow-violet-200 mt-4 text-sm sm:text-base relative overflow-hidden group"
                        >
                            <motion.span
                                className="absolute inset-0 bg-white/20 rounded-[1.25rem] -translate-x-full group-hover:translate-x-full"
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                            <span>GET STARTED</span>
                            <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                <ArrowRight size={20} />
                            </motion.div>
                        </motion.button>
                    </form>
                </div>

                <div className="mt-12 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-2xl border border-white">
                        <Sparkles size={14} className="text-[#8b5cf6]" />
                        <span className="text-sm font-bold text-slate-500">Echo Protocol v4.0</span>
                    </div>

                    <div className="text-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Developed By</span>
                        <p className="text-sm font-black text-slate-600 bg-white/50 px-4 py-1.5 rounded-full border border-white">Moeed ul Hassan</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
