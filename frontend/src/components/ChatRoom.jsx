import React, { useState, useEffect, useRef } from 'react';
import { Send, Hash, User, Circle, Users, Shield, Zap, Check, CheckCheck, Search, MoreVertical, Plus, Smile, Paperclip, Mic, Phone, Video, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatRoom = ({ room, username, messages, connected, onSendMessage, onStartCall }) => {
    const [input, setInput] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isJarvisTyping, setIsJarvisTyping] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const scrollRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const type = file.type.startsWith('image/') ? 'image' : 'file';
            onSendMessage(reader.result, type, file.name);
        };
        reader.readAsDataURL(file);
    };

    // Mock chat list data
    const chatList = [
        { id: 1, name: 'Hajeera', msg: 'Ok, let me check', time: '9:40am', active: true, avatar: 'H' },
        { id: 2, name: 'Riya', msg: 'See you tomorrow', time: 'Yesterday', avatar: 'R' },
        { id: 3, name: 'Nakul', msg: 'Ok', time: 'Monday', avatar: 'N' },
        { id: 4, name: 'Khan', msg: 'Check the documents', time: 'Monday', avatar: 'K' },
    ];

    const quickQueries = [
        { q: "Developer?", a: "Echo was designed and engineered by Sr. Moeed ul Hassan." },
        { q: "What is Echo?", a: "Echo is a real-time chat platform Built with Go lang and React. Provides surity of E2EE." },
        { q: "Status?", a: "Yup! All systems are operational." },
    ];

    const handleBotQuery = (query, answer) => {
        onSendMessage(query);
        setSidebarOpen(false);
        setTimeout(() => {
            setIsJarvisTyping(true);
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

    const toggleRecording = () => {
        setIsRecording(!isRecording);
    };

    // Waveform helper for the UI
    const Waveform = ({ active }) => (
        <div className="flex items-center gap-0.5 h-6">
            {[3, 5, 4, 8, 6, 4, 7, 5, 3, 6, 4, 8, 5, 3, 6].map((h, i) => (
                <div
                    key={i}
                    className={`w-[2px] rounded-full bg-slate-600/40 ${active ? 'animate-pulse-wave' : ''}`}
                    style={{ height: `${h * 2}px`, animationDelay: `${i * 0.1}s` }}
                />
            ))}
        </div>
    );

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-100 to-indigo-50 text-slate-800 overflow-hidden font-sans relative">
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

            <aside className={`fixed lg:relative lg:flex inset-y-0 left-0 w-80 sm:w-96 bg-white/80 backdrop-blur-xl border-r border-white/50 flex-col z-50 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-6 sm:p-8 pb-4">
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100/50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg sm:text-xl border border-white">
                                {username[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">Good Morning!</h2>
                            </div>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-xl">
                            <X size={22} />
                        </button>
                    </div>

                    <div className="flex p-1.5 bg-slate-100/50 rounded-2xl mb-6 sm:mb-8">
                        {['Chats', 'Groups', 'Contacts'].map((tab) => (
                            <button
                                key={tab}
                                className={`flex-1 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${tab === 'Chats' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 sm:px-6 space-y-2">
                    {chatList.map((chat) => (
                        <div key={chat.id} className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-3xl transition-all cursor-pointer ${chat.active ? 'bg-white/60 shadow-sm border border-white' : 'hover:bg-white/30'}`}>
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 font-bold border border-white shadow-sm">
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

                    {/* Jarvis Queries in Sidebar */}
                    <div className="mt-8 px-2 pb-10">
                        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Jarvis Intelligence</p>
                        <div className="flex flex-wrap gap-2">
                            {quickQueries.map((query, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleBotQuery(query.q, query.a)}
                                    className="px-3 sm:px-4 py-2 bg-white/60 text-slate-600 rounded-full text-[10px] sm:text-[11px] font-black tracking-tight border border-white hover:bg-white transition-all shadow-sm"
                                >
                                    {query.q}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative w-full min-w-0">
                {/* Chat Header */}
                <header className="h-20 sm:h-24 bg-white/30 backdrop-blur-md border-b border-white/50 flex items-center justify-between px-4 sm:px-10 z-20">
                    <div className="flex items-center gap-3 sm:gap-5">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 hover:bg-white/50 rounded-xl">
                            <Menu size={22} />
                        </button>
                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/60 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-lg sm:text-xl border border-white shadow-sm">
                            {room[0]?.toUpperCase() || '#'}
                        </div>
                        <div>
                            <h2 className="text-sm sm:text-lg font-black text-slate-800 tracking-tight">{room}</h2>
                            <p className="text-[9px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Connected</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={onStartCall}
                            className="p-2 sm:p-3 bg-indigo-500 text-white rounded-2xl border border-indigo-400 shadow-lg shadow-indigo-200/50 hover:bg-indigo-600 transition-all active:scale-95"
                            title="Start Video Call"
                        >
                            <Video size={18} sm:size={20} />
                        </button>
                        <button className="p-2 sm:p-3 bg-white/60 text-slate-400 rounded-2xl border border-white shadow-sm">
                            <MoreVertical size={18} sm:size={20} />
                        </button>
                    </div>
                </header>

                {/* Messages Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-8 scroll-smooth pb-40"
                >
                    <div className="flex justify-center mb-10">
                        <span className="px-4 py-2 bg-white/50 backdrop-blur-sm text-slate-400 text-[10px] font-black rounded-full border border-white shadow-sm uppercase tracking-widest">Today</span>
                    </div>

                    <AnimatePresence initial={false}>
                        {messages.map((msg, idx) => {
                            const isJarvis = msg.username === 'Jarvis AI';
                            const isMe = msg.username === username && !isJarvis;

                            // Check if message content indicates it's a voice message (logic to be improved)
                            const isVoice = msg.content.startsWith('VOICE|');

                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-3`}
                                >
                                    {!isMe && (
                                        <div className="w-10 h-10 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center text-slate-400 font-bold text-xs border border-white shadow-sm">
                                            {msg.username[0]}
                                        </div>
                                    )}

                                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[70%]`}>
                                        <div className={`group relative px-5 py-4 rounded-[1.8rem] shadow-sm transition-all border border-white ${isMe ? 'bg-indigo-500 text-white rounded-br-none border-indigo-400' :
                                            isJarvis ? 'bg-[#ede9fe]/80 text-[#1e293b] rounded-bl-none shadow-violet-100/50' :
                                                'bg-white/60 text-slate-600 rounded-bl-none'
                                            }`}>
                                            {isVoice ? (
                                                <div className="flex items-center gap-4 min-w-[200px]">
                                                    <button className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center">
                                                        <Zap size={14} fill="white" />
                                                    </button>
                                                    <Waveform active={false} />
                                                    <span className="text-[10px] font-bold text-slate-400">0:23</span>
                                                </div>
                                            ) : msg.type === 'image' ? (
                                                <img src={msg.content} alt="sent" className="max-w-full rounded-lg shadow-sm border border-white/20" />
                                            ) : msg.type === 'file' ? (
                                                <a
                                                    href={msg.content}
                                                    download={msg.fileName || 'document'}
                                                    className="flex items-center gap-3 underline decoration-white/30"
                                                >
                                                    <Paperclip size={16} />
                                                    <span className="text-[13px] font-bold truncate">{msg.fileName || 'Download File'}</span>
                                                </a>
                                            ) : (
                                                <p className="text-[13px] sm:text-[14px] leading-relaxed font-semibold break-words">{msg.content}</p>
                                            )}
                                        </div>
                                        <span className="text-[8px] sm:text-[9px] font-black text-slate-400 mt-1.5 px-2 uppercase tracking-widest">{msg.timestamp || '09:00 AM'}</span>
                                    </div>
                                    {isMe && (
                                        <div className="w-10 h-10 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center text-indigo-500 font-bold text-xs border border-white shadow-sm">
                                            {username[0]}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}

                        {isJarvisTyping && (
                            <motion.div key="jarvis-typing" initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="flex justify-start items-end gap-3">
                                <div className="w-10 h-10 bg-[#ede9fe] rounded-2xl flex items-center justify-center text-indigo-500 font-bold border border-white shadow-sm">J</div>
                                <div className="bg-white/80 backdrop-blur-sm border border-white px-6 py-4 rounded-[1.8rem] rounded-bl-none shadow-sm h-14 flex items-center">
                                    <div className="flex gap-1.5 px-1"><Waveform active={true} /></div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* UI Fixed Section */}
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 pointer-events-none">
                    <div className="max-w-4xl mx-auto flex flex-col gap-6 pointer-events-auto">
                        {/* Input Row */}
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="w-14 h-14 bg-white/60 backdrop-blur-md border border-white rounded-full flex items-center justify-center text-slate-600 shadow-xl shadow-slate-200/20 active:scale-95 transition-all"
                            >
                                <Paperclip size={24} />
                            </button>
                            <form onSubmit={handleSubmit} className="flex-1 flex items-center bg-white/70 backdrop-blur-xl border border-white rounded-full px-6 py-4 shadow-2xl shadow-slate-200/30">
                                {isRecording ? (
                                    <div className="flex-1 flex items-center gap-4">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        <Waveform active={true} />
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Recording...</span>
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type a Message..."
                                        className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-bold text-sm sm:text-base placeholder:text-slate-400"
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={toggleRecording}
                                    className={`transition-all duration-300 ${isRecording ? 'text-red-500' : input.trim() ? 'text-indigo-500 scale-125 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 'text-slate-400 hover:text-indigo-500'}`}
                                >
                                    <Zap size={20} fill={(isRecording || input.trim()) ? "currentColor" : "none"} />
                                </button>
                            </form>
                        </div>

                        {/* Control Row - ONLY visible when recording */}
                        <AnimatePresence>
                            {isRecording && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="flex justify-center gap-3 sm:gap-4 overflow-x-auto py-2 no-scrollbar"
                                >
                                    {[Zap, Circle, Square, X, Zap, ArrowDown].map((Icon, i) => (
                                        <button
                                            key={i}
                                            onClick={i === 2 ? toggleRecording : undefined} // Square = Stop
                                            className={`w-12 h-12 flex-shrink-0 bg-white/60 backdrop-blur-md border border-white rounded-full flex items-center justify-center text-slate-600 shadow-lg shadow-slate-200/20 hover:bg-white transition-all relative`}
                                        >
                                            <Icon size={20} fill={i < 3 ? "currentColor" : "none"} />
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Simple icon mappings for the mock loop
const Square = ({ size, fill }) => <div style={{ width: size, height: size, background: fill === "currentColor" ? "currentColor" : "transparent", border: "2px solid currentColor", borderRadius: "4px" }} />;
const ArrowDown = ({ size }) => <motion.div animate={{ y: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}><svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13l5 5 5-5M12 6v12" /></svg></motion.div>;

export default ChatRoom;
