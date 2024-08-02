"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatArea from '@/components/ChatArea';
import { v4 as uuidv4 } from 'uuid'; // Import UUID

export default function Chat() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [chatSessions, setChatSessions] = useState<{ id: string, name: string, history: { sender: string, text: string }[] }[]>([]); // State to store chat sessions

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarVisible(true);
      } else {
        setSidebarVisible(false);
      }
    };

    handleResize(); // Call initially to set the correct sidebar state based on the initial window size
    setIsInitialRender(false);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSessionId(sessionId);
  };

  useEffect(() => {
    // Automatically create a new session if none exists
    if (chatSessions.length === 0) {
      createNewSession();
    }
  }, []);

  const createNewSession = () => {
    // Check if there is an empty session
    const existingEmptySession = chatSessions.find(session => session.history.length === 0);

    if (existingEmptySession) {
      setSelectedSessionId(existingEmptySession.id);
      return;
    }

    const newSessionId = uuidv4(); // Use UUID for sessionId
    const newSession = { id: newSessionId, name: `New Chat`, history: [] };
    setChatSessions([...chatSessions, newSession]);
    setSelectedSessionId(newSessionId);
  };

  if (isInitialRender) {
    return null; // Prevent rendering during the initial check
  }

  const selectedSession = chatSessions.find(session => session.id === selectedSessionId);

  return (
    <div className="relative flex flex-col md:flex-row h-screen overflow-hidden bg-back">
      <div className={`fixed inset-0 bg-gray-900 bg-opacity-75 z-10 md:hidden ${sidebarVisible ? 'block' : 'hidden'}`} onClick={toggleSidebar}></div>
      <div className={`fixed inset-y-0 left-0 transform md:transform-none md:static transition-transform duration-300 ease-in-out z-20 ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar sidebarVisible={sidebarVisible} toggleSidebar={toggleSidebar} chatSessions={chatSessions} onSessionSelect={handleSessionSelect} createNewSession={createNewSession} />
      </div>
      <div className="flex-grow h-full overflow-hidden">
        <ChatArea toggleSidebar={toggleSidebar} sidebarVisible={sidebarVisible} selectedSession={selectedSession} setChatSessions={setChatSessions} />
      </div>
    </div>
  );
}
