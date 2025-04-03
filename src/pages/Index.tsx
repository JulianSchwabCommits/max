
import React from 'react';
import ChatInterface from '@/components/ChatInterface';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-apple-black">
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <ChatInterface />
      </main>
    </div>
  );
};

export default Index;
