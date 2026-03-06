import React, { useState, useEffect, useRef } from 'react';
import { Send, Hash, User, Circle, Users, Shield, Zap, Check, CheckCheck, Search, MoreVertical, Plus, Smile, Paperclip, Mic, Phone, Video, Menu, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatRoom = ({ room, username, messages, connected, onSendMessage, sendTyping, sendReaction, typingUsers, onStartVideoCall, onStartVoiceCall, onClearChat, onLogout }) => {
    const [input, setInput] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isJarvisTyping, setIsJarvisTyping] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [activeTab, setActiveTab] = useState('Chats');
    const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
    const scrollRef = useRef(null);
    const fileInputRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const reactionEmojis = ["👍", "❤️", "😂", "🚀"];

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        processFile(file);
    };

    const processFile = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            const type = file.type.startsWith('image/') ? 'image' : 'file';
            onSendMessage(reader.result, type, file.name);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        if (!isDragging) setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
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
        if (isRecording) {
            if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
            setIsRecording(false);
        } else {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                const recorder = new MediaRecorder(stream);
                audioChunksRef.current = [];
                recorder.ondataavailable = e => audioChunksRef.current.push(e.data);
                recorder.onstop = () => {
                    const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const reader = new FileReader();
                    reader.onload = () => {
                        onSendMessage(reader.result, 'voice', 'Voice Record');
                    };
                    reader.readAsDataURL(blob);
                    stream.getTracks().forEach(t => t.stop());
                };
                recorder.start();
                mediaRecorderRef.current = recorder;
                setIsRecording(true);
            }).catch(e => console.error(e));
        }
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

                    <div className="flex p-1.5 bg-slate-100/50 rounded-2xl mb-6 sm:mb-8 relative">
                        {['Chats', 'Updates', 'Contacts'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative flex-1 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className="absolute inset-0 bg-white rounded-xl shadow-sm border border-white"
                                        style={{ zIndex: 0 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{tab}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 sm:px-6 space-y-2 pb-6">
                    <AnimatePresence mode="wait">
                        {activeTab === 'Chats' && (
                            <motion.div key="chats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                                {chatList.map((chat, i) => (
                                    <motion.div
                                        key={chat.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-3xl transition-all cursor-pointer ${chat.active ? 'bg-white/60 shadow-sm border border-white' : 'hover:bg-white/30'}`}
                                    >
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
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'Updates' && (
                            <motion.div
                                key="updates"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="p-4 bg-indigo-50/50 rounded-3xl border border-indigo-100/50 text-center shadow-sm"
                            >
                                <h4 className="text-sm font-black text-indigo-900 mb-1">Status Updates</h4>
                                <div className="mt-3 flex items-center justify-center">
                                    <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">Moeed added a new Echo 🔒</span>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'Contacts' && (
                            <motion.div key="contacts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-4 text-xs font-bold text-slate-400">
                                Loading Contacts...
                            </motion.div>
                        )}
                    </AnimatePresence>

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

                    <div className="mt-auto px-6 py-4 text-center border-t border-white/50 bg-white/30 backdrop-blur-md">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Developed By</span>
                        <p className="text-sm font-black text-indigo-600 drop-shadow-sm">Moeed ul Hassan</p>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main
                className="flex-1 flex flex-col relative w-full min-w-0"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {/* Drag Overlay */}
                <AnimatePresence>
                    {isDragging && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-[100] bg-indigo-500/20 backdrop-blur-sm border-2 border-dashed border-indigo-400 flex flex-col items-center justify-center m-4 rounded-3xl"
                        >
                            <div className="w-24 h-24 bg-white shadow-2xl rounded-full flex items-center justify-center text-indigo-500 mb-4 animate-bounce">
                                <Upload size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-indigo-700 drop-shadow-md">Drop to Send</h2>
                            <p className="text-indigo-900 font-bold mt-2 bg-white/50 px-4 py-1 rounded-full">Share any image or document instantly</p>
                        </motion.div>
                    )}
                </AnimatePresence>
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
                    <div className="flex items-center gap-2 sm:gap-4 relative">
                        <button
                            onClick={onStartVoiceCall}
                            className="p-2 sm:p-3 bg-indigo-500 text-white rounded-2xl border border-indigo-400 shadow-lg shadow-indigo-200/50 hover:bg-indigo-600 transition-all active:scale-95"
                            title="Start Voice Call"
                        >
                            <Phone size={18} sm:size={20} />
                        </button>
                        <button
                            onClick={onStartVideoCall}
                            className="p-2 sm:p-3 bg-violet-500 text-white rounded-2xl border border-violet-400 shadow-lg shadow-violet-200/50 hover:bg-violet-600 transition-all active:scale-95"
                            title="Start Video Call"
                        >
                            <Video size={18} sm:size={20} />
                        </button>
                        <div className="relative">
                            <button onClick={() => setHeaderMenuOpen(!headerMenuOpen)} className="p-2 sm:p-3 bg-white/60 text-slate-400 rounded-2xl border border-white shadow-sm hover:bg-white transition-colors relative z-50">
                                <MoreVertical size={18} sm:size={20} />
                            </button>
                            <AnimatePresence>
                                {headerMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        className="absolute right-0 top-14 w-48 bg-white/90 backdrop-blur-[16px] rounded-2xl shadow-xl border border-white p-2 z-[60]"
                                    >
                                        <button onClick={() => { setHeaderMenuOpen(false); if (onClearChat) onClearChat(); }} className="w-full text-left px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl flex items-center gap-2"><Search size={14} />Clear Chat</button>
                                        <button onClick={() => { setHeaderMenuOpen(false); if (onLogout) onLogout(); }} className="w-full text-left px-4 py-2 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl mt-1 flex items-center gap-2"><Zap size={14} />Logout</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
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
                            const isVoice = msg.type === 'voice' || msg.content.startsWith('VOICE|') || msg.content.startsWith('data:audio');

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
                                                    <audio controls src={msg.content} className="h-8 max-w-[200px] outline-none" />
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

                                            {/* Hover Reaction Bar */}
                                            {msg.id && (
                                                <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-slate-100 flex gap-1 p-1 z-10 ${isMe ? '-left-20' : '-right-20'}`}>
                                                    {reactionEmojis.map(emoji => (
                                                        <button
                                                            key={emoji}
                                                            onClick={() => sendReaction && sendReaction(msg.id, emoji)}
                                                            className="hover:scale-125 transition-transform text-sm"
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Render Reactions */}
                                            {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                                <div className={`absolute -bottom-3 ${isMe ? 'right-4' : 'left-4'} bg-white px-2 py-0.5 rounded-full shadow-sm border border-slate-100 flex items-center gap-1 text-[10px] z-10`}>
                                                    {Array.from(new Set(Object.values(msg.reactions))).map((emoji, idx) => (
                                                        <span key={idx}>{emoji}</span>
                                                    ))}
                                                    <span className="font-bold text-slate-500 ml-0.5">{Object.keys(msg.reactions).length}</span>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[8px] sm:text-[9px] font-black text-slate-400 mt-1.5 px-2 uppercase tracking-widest flex items-center gap-1">
                                            {msg.timestamp || '09:00 AM'}
                                            {isMe && (
                                                msg.read ? <CheckCheck size={12} className="text-blue-500" /> : <Check size={12} className="text-slate-400" />
                                            )}
                                        </span>
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
                        {typingUsers && typingUsers.length > 0 && (
                            <motion.div key="user-typing" initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="flex justify-start items-end gap-3 text-slate-400 font-bold text-xs pl-12">
                                {typingUsers.length === 1 ? `${typingUsers[0]} is typing...` : 'Multiple people typing...'}
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
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => fileInputRef.current.click()}
                                className="w-14 h-14 bg-white/60 backdrop-blur-md border border-white rounded-full flex items-center justify-center text-slate-600 shadow-xl shadow-slate-200/20 transition-all"
                            >
                                <Paperclip size={24} />
                            </motion.button>
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
                                        onChange={(e) => {
                                            setInput(e.target.value);
                                            if (sendTyping) sendTyping();
                                        }}
                                        placeholder="What's on your mind"
                                        className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-bold text-sm sm:text-base placeholder:text-slate-400"
                                    />
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    onClick={toggleRecording}
                                    className={`transition-all duration-300 flex items-center justify-center ${isRecording ? 'text-red-500' : input.trim() ? 'text-indigo-500 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 'text-slate-400 hover:text-indigo-500'}`}
                                >
                                    <Zap size={20} fill={(isRecording || input.trim()) ? "currentColor" : "none"} />
                                </motion.button>
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
