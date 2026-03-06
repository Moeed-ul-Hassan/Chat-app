import { useState, useEffect, useCallback, useRef } from 'react';

export const useVideoCall = (socket, room, username) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isCalling, setIsCalling] = useState(false);
    const peerConnection = useRef(null);

    const configuration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
        ],
    };

    const startCall = async (callType = 'video') => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: callType === 'video', audio: true });
            setLocalStream(stream);
            setIsCalling(true);

            peerConnection.current = new RTCPeerConnection(configuration);
            stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

            peerConnection.current.ontrack = (event) => {
                setRemoteStream(event.streams[0]);
            };

            peerConnection.current.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.send(JSON.stringify({
                        type: 'candidate',
                        room,
                        username,
                        content: JSON.stringify(event.candidate),
                    }));
                }
            };

            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);

            const offerPayload = {
                sdp: offer,
                callType: callType
            };

            socket.send(JSON.stringify({
                type: 'offer',
                room,
                username,
                content: JSON.stringify(offerPayload),
            }));
        } catch (err) {
            console.error('Error starting call:', err);
        }
    };

    const handleOffer = useCallback(async (offerContent) => {
        try {
            const parsed = JSON.parse(offerContent);
            const isRichOffer = parsed.sdp && parsed.callType;
            const callType = isRichOffer ? parsed.callType : 'video';
            const offerSdp = isRichOffer ? parsed.sdp : parsed;

            const stream = await navigator.mediaDevices.getUserMedia({ video: callType === 'video', audio: true });
            setLocalStream(stream);
            setIsCalling(true);

            peerConnection.current = new RTCPeerConnection(configuration);
            stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

            peerConnection.current.ontrack = (event) => {
                setRemoteStream(event.streams[0]);
            };

            peerConnection.current.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.send(JSON.stringify({
                        type: 'candidate',
                        room,
                        username,
                        content: JSON.stringify(event.candidate),
                    }));
                }
            };

            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offerSdp));
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);

            socket.send(JSON.stringify({
                type: 'answer',
                room,
                username,
                content: JSON.stringify(answer),
            }));
        } catch (err) {
            console.error('Error handling offer:', err);
        }
    }, [socket, room, username]);

    const handleAnswer = useCallback(async (answer) => {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer)));
    }, []);

    const handleCandidate = useCallback(async (candidate) => {
        try {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(JSON.parse(candidate)));
        } catch (err) {
            console.error('Error adding ICE candidate:', err);
        }
    }, []);

    const endCall = () => {
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
        }
        if (peerConnection.current) {
            peerConnection.current.close();
        }
        setLocalStream(null);
        setRemoteStream(null);
        setIsCalling(false);
    };

    return { localStream, remoteStream, isCalling, startCall, endCall, handleOffer, handleAnswer, handleCandidate };
};
