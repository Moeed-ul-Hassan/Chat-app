import React, { useState, useEffect, useRef } from 'react';
import { Send, Hash, User, Circle, Users, Shield, Zap, Check, CheckCheck, Search, MoreVertical, Plus, Smile, Paperclip, Mic, Phone, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatRoom = ({ room, username, messages, connected, onSendMessage }) => {
    const [input, setInput] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isJarvisTyping, setIsJarvisTyping] = useState(false);
    const scrollRef = useRef(null);

    // Mock chat list data for the aesthetic
    const chatList = [
        { id: 1, name: 'Hajeera', msg: 'Ok, let me check', time: '9:40am', active: true, avatar: 'H' },
        { id: 2, name: 'Riya', msg: 'See you tomorrow', time: 'Yesterday', avatar: 'R' },
        { id: 3, name: 'Nakul', msg: 'Ok', time: 'Monday', avatar: 'N' },
        { id: 4, name: 'Khan', msg: 'Check the documents', time: 'Monday', avatar: 'K' },
    ];

    // Jarvis Quick Queries (styled for the new UI)
    const quickQueries = [
        { q: "Developer?", a: "Echo was designed and engineered by Sr. Moeed ul Hassan." },
        { q: "What is Echo?", a: "Echo is a  real-time chat platform Built with Go lang and React. Provides surity of E2EE." },
        { q: "Status?", a: "Yup! All systems are operational." },
    ];

    const handleBotQuery = (query, answer) => {
        onSendMessage(query);
        setSidebarOpen(false);

        // Delay before Jarvis starts typing
        setTimeout(() => {
            setIsJarvisTyping(true);

            // Jarvis "types" for 1.8 seconds
            setTimeout(() => {
                onSendMessage(`BOT_RESPONSE|${answer}`);
                setIsJarvisTyping(false);
            }, 1800);
        }, 500);
    };

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
        <div className="flex h-screen bg-[#f8fafc] text-slate-800 overflow-hidden font-sans relative">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar - Chat List */}
            <aside className={`fixed lg:relative lg:flex inset-y-0 left-0 w-80 sm:w-96 bg-white border-r border-slate-100 flex-col z-50 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Sidebar Header */}
                <div className="p-6 sm:p-8 pb-4">
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg sm:text-xl border border-indigo-50">
                                {username[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">Good Morning!</h2>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
                        >
                            <X size={22} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-1.5 bg-slate-50 rounded-2xl mb-6 sm:mb-8">
                        {['Chats', 'Groups', 'Contacts'].map((tab) => (
                            <button
                                key={tab}
                                className={`flex-1 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${tab === 'Chats'
                                    ? 'bg-[#8b5cf6] text-white shadow-lg shadow-violet-200'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 space-y-2">
                    {chatList.map((chat) => (
                        <div
                            key={chat.id}
                            className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-[1.25rem] sm:rounded-[1.5rem] transition-all cursor-pointer ${chat.active ? 'bg-violet-50/50 border border-violet-100/50' : 'hover:bg-slate-50 border border-transparent'
                                }`}
                        >
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-100 rounded-[1rem] sm:rounded-[1.25rem] flex items-center justify-center text-slate-400 font-bold text-lg border border-white">
                                {chat.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                                    <h3 className="font-black text-slate-800 text-sm">{chat.name}</h3>
                                    <span className="text-[10px] font-bold text-slate-400">{chat.time}</span>
                                </div>
                                <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">{chat.msg}</p>
                            </div>
                        </div>
                    ))}

                    {/* Active Frequency (Room) */}
                    <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-indigo-50/40 rounded-[1.5rem] sm:rounded-[2rem] border border-indigo-100/30">
                        <p className="text-[9px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 sm:mb-4 px-1">Current Frequency</p>
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                <Hash size={18} sm:size={20} strokeWidth={3} />
                            </div>
                            <div>
                                <h4 className="text-xs sm:text-sm font-black text-slate-800">{room}</h4>
                                <p className="text-[9px] sm:text-[10px] text-emerald-500 font-black uppercase tracking-wider">Synchronized</p>
                            </div>
                        </div>
                    </div>

                    {/* Jarvis Queries in Sidebar */}
                    <div className="mt-6 sm:mt-8 px-2 pb-10">
                        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Jarvis Intelligence</p>
                        <div className="flex flex-wrap gap-2">
                            {quickQueries.map((query, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleBotQuery(query.q, query.a)}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-50 hover:bg-[#ede9fe] hover:text-[#8b5cf6] text-slate-500 rounded-full text-[10px] sm:text-[11px] font-black tracking-tight transition-all border border-slate-100 hover:border-[#8b5cf6]/20"
                                >
                                    {query.q}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative bg-[#f8fafc] w-full min-w-0">
                {/* Chat Header */}
                <header className="h-20 sm:h-24 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-4 sm:px-10 z-20">
                    <div className="flex items-center gap-3 sm:gap-5">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
                        >
                            <Menu size={22} />
                        </button>
                        <div className="relative">
                            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-lg sm:text-xl border border-indigo-50">
                                {room[0]?.toUpperCase() || '#'}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-[3px] sm:border-4 border-white shadow-sm"></div>
                        </div>
                        <div>
                            <h2 className="text-sm sm:text-lg font-black text-slate-800 tracking-tight truncate max-w-[100px] sm:max-w-none">{room}</h2>
                            <p className="text-[9px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Active Channel</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-3">
                        <button className="p-2 sm:p-3 text-slate-400 hover:bg-slate-50 rounded-xl sm:rounded-2xl transition-colors">
                            <Phone size={18} sm:size={20} />
                        </button>
                        <button className="p-2 sm:p-3 text-slate-400 hover:bg-slate-50 rounded-xl sm:rounded-2xl transition-colors">
                            <MoreVertical size={18} sm:size={20} />
                        </button>
                    </div>
                </header>

                {/* Messages Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-6 sm:space-y-8 scroll-smooth"
                >
                    <div className="flex justify-center mb-6 sm:mb-10">
                        <span className="px-4 py-1.5 sm:px-5 sm:py-2 bg-white text-slate-400 text-[9px] sm:text-[10px] font-black rounded-full border border-slate-100 uppercase tracking-widest shadow-sm">Today</span>
                    </div>

                    <AnimatePresence initial={false}>
                        {messages.map((msg, idx) => {
                            const isJarvis = msg.username === 'Jarvis AI';
                            const isMe = msg.username === username && !isJarvis;

                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2 sm:gap-3`}
                                >
                                    {!isMe && (
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center text-slate-500 font-bold text-[10px] sm:text-xs border border-white capitalize">
                                            {msg.username[0]}
                                        </div>
                                    )}

                                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%]`}>
                                        <div className={`group relative px-4 py-3 sm:px-6 sm:py-4 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm transition-all ${isMe
                                            ? 'bg-[#c7d2fe] text-[#1e293b] rounded-br-none shadow-indigo-100/20'
                                            : isJarvis
                                                ? 'bg-[#ede9fe] text-[#1e293b] border border-white rounded-bl-none shadow-violet-100/30'
                                                : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                                            }`}>
                                            <p className="text-[13px] sm:text-[14px] leading-relaxed font-semibold break-words">{msg.content}</p>
                                        </div>
                                        <span className="text-[8px] sm:text-[9px] font-black text-slate-400 mt-1 px-2">
                                            {msg.timestamp || '09:00 AM'}
                                        </span>
                                    </div>

                                    {isMe && (
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center text-indigo-600 font-bold text-[10px] sm:text-xs border border-white capitalize">
                                            {username[0]}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}

                        {isJarvisTyping && (
                            <motion.div
                                key="jarvis-typing"
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                className="flex justify-start items-end gap-2 sm:gap-3"
                            >
                                <motion.div
                                    animate={{
                                        boxShadow: ["0 0 10px rgba(139,92,246,0.1)", "0 0 20px rgba(139,92,246,0.2)", "0 0 10px rgba(139,92,246,0.1)"]
                                    }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-8 h-8 sm:w-10 sm:h-10 bg-violet-100 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center text-violet-600 font-bold text-[10px] sm:text-xs border border-white"
                                >
                                    J
                                </motion.div>
                                <div className="bg-[#ede9fe]/60 backdrop-blur-sm border border-white px-5 py-3 sm:px-6 sm:py-4 rounded-[1.5rem] sm:rounded-[2rem] rounded-bl-none shadow-sm shadow-violet-100/30">
                                    <div className="flex gap-1.5 items-center h-4">
                                        {[0, 0.15, 0.3].map((delay, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{
                                                    y: [0, -5, 0],
                                                    scale: [1, 1.2, 1],
                                                    backgroundColor: ["#a78bfa", "#8b5cf6", "#a78bfa"]
                                                }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 0.8,
                                                    delay: delay,
                                                    ease: "easeInOut"
                                                }}
                                                className="w-1.5 h-1.5 rounded-full"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="p-4 sm:p-8 sm:px-10 bg-white/40 backdrop-blur-md border-t border-slate-100">
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3">
                            <div className="flex-1 bg-white border-2 border-slate-50 rounded-[2rem] sm:rounded-[2.5rem] px-3 sm:px-5 py-2 sm:py-3 shadow-xl shadow-slate-200/20 flex items-center gap-2 sm:gap-3 focus-within:border-[#8b5cf6]/20 transition-all">
                                <button type="button" className="p-1.5 sm:p-2 text-slate-400 hover:text-indigo-500 transition-colors bg-slate-50 rounded-full hidden sm:block">
                                    <Plus size={18} sm:size={20} />
                                </button>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type something..."
                                    className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-bold text-xs sm:text-sm placeholder:text-slate-300 min-w-0"
                                />
                                <div className="flex items-center gap-0.5 sm:gap-1">
                                    <button type="button" className="p-1.5 sm:p-2 text-slate-400 hover:text-indigo-500 transition-colors">
                                        <Smile size={18} sm:size={20} />
                                    </button>
                                    <button type="button" className="p-1.5 sm:p-2 text-slate-400 hover:text-indigo-500 transition-colors hidden sm:block">
                                        <Mic size={18} sm:size={20} />
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="w-12 h-12 sm:w-16 sm:h-16 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center hover:bg-violet-600 transition-all shadow-xl shadow-violet-200 active:scale-90 disabled:opacity-50 disabled:shadow-none flex-shrink-0"
                            >
                                <Send size={20} sm:size={26} strokeWidth={2.5} className="ml-0.5 sm:ml-1" />
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChatRoom;
