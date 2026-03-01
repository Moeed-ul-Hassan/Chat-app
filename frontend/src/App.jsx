import React, { useState } from 'react';
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

  if (!userAuth) {
    return <Login onJoin={handleJoin} />;
  }

  return (
    <div className="min-h-screen bg-chat-bg text-white">
      <ChatRoom
        room={userAuth.room}
        username={userAuth.username}
        messages={messages}
        connected={connected}
        onSendMessage={sendMessage}
      />
      {error && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-rose-500/90 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-medium shadow-xl">
          {error} - Retrying in 3s...
        </div>
      )}
    </div>
  );
}

export default App;
