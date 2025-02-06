'use client'
// ChatServer.tsx
import React from 'react';
import ChatClient from './component/ChatClient';
import { SessionProvider } from 'next-auth/react';

const Chat = () => {
  return (
    <div className="flex flex-col h-[70vh] w-full max-w-screen-md mx-auto bg-gray-50 shadow-lg rounded-lg">
      <ChatClient />
    </div>
  );
};

export default Chat;
