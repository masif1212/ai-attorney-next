"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatArea from '@/components/ChatArea';

export default function Chat() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);

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

  if (isInitialRender) {
    return null; // Prevent rendering during the initial check
  }

  return (
    <div className="relative flex flex-col md:flex-row h-screen overflow-hidden bg-back">
      <div className={`fixed inset-0 bg-gray-900 bg-opacity-75 z-10 md:hidden ${sidebarVisible ? 'block' : 'hidden'}`} onClick={toggleSidebar}></div>
      <div className={`fixed inset-y-0 left-0 transform md:transform-none md:static transition-transform duration-300 ease-in-out z-20 ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar sidebarVisible={sidebarVisible} toggleSidebar={toggleSidebar} />
      </div>
      <div className="flex-grow h-full overflow-hidden">
        <ChatArea toggleSidebar={toggleSidebar} sidebarVisible={sidebarVisible} />
      </div>
    </div>
  );
}
