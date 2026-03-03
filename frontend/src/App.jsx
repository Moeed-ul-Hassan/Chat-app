import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import { useChat } from './hooks/useChat';

function App() {
  const [userAuth, setUserAuth] = useState(null);

  // Custom hook for WebSocket management
  const { messages, connected, error, sendMessage } = useChat(
    userAuth?.room,
    userAuth?.username
  );

  const handleJoin = (username, room) => {
    setUserAuth({ username, room });
  };

  return (
    <div className="min-h-screen bg-chat-bg">
      <AnimatePresence mode="wait">
        {!userAuth ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Login onJoin={handleJoin} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-screen w-full"
          >
            <ChatRoom
              room={userAuth.room}
              username={userAuth.username}
              messages={messages}
              connected={connected}
              onSendMessage={sendMessage}
            />
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-rose-500/90 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-medium shadow-xl text-white z-50"
              >
                {error} - Retrying in 3s...
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
