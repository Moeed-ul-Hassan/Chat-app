import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, VideoOff, Phone, PhoneOff } from 'lucide-react';

const VideoCall = ({ localStream, remoteStream, isCalling, onStart, onEnd }) => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl aspect-video bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                {/* Remote Video (Full Screen) */}
                <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                    {remoteStream ? (
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-white/40">
                            <Video size={48} strokeWidth={1} />
                            <p className="text-sm font-medium">Waiting for peer...</p>
                        </div>
                    )}
                </div>

                {/* Local Video (PIP) */}
                <div className="absolute top-6 right-6 w-48 aspect-video bg-neutral-700/50 backdrop-blur-md rounded-lg overflow-hidden border border-white/20 shadow-lg">
                    {localStream ? (
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                            <VideoOff size={24} />
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-4 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
                    <button
                        onClick={onEnd}
                        className="p-4 bg-rose-500 hover:bg-rose-600 rounded-full text-white shadow-lg transition-all active:scale-95"
                    >
                        <PhoneOff size={24} fill="currentColor" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
