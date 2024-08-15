"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";

export default function Chat() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]); 
  const [error, setError] = useState<string | null>(null);


  interface Chat {
    id: string;
    latestMessage: string;
    createdAt: string;
    messages: Message[];
    fullContext: { content: string }[];
  }
  
  interface Message {
    senderId: string;
    content: string;
    timestamp: string;
  }
  

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarVisible(true);
      } else {
        setSidebarVisible(false);
      }
    };
    handleResize();
    setIsInitialRender(false);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const storedChatId = localStorage.getItem("activeChatId");
    const storedUserId = localStorage.getItem("activeUserId");

    if (storedChatId) {
      setActiveChatId(storedChatId);
    }

    if (storedUserId) {
      setActiveUserId(storedUserId);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // This function is called whenever a new chat is created
  const handleNewChatCreated = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token is not available');
      return;
    }
  
    try {
      const response = await fetch('/api/chat/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const newChat: Chat = {
          id: data.chatId, // assuming your API response returns `chatId`
          latestMessage: '',
          createdAt: new Date().toISOString(),
          messages: [],
          fullContext: [{ content: '' }],
        };
  
        setChats((prevChats) => [newChat, ...prevChats]); // Update the chat list immediately
        setActiveChatId(data.chatId);
        localStorage.setItem('activeChatId', data.chatId);
      } else {
        console.error('Error response data:', data);
        setError(data.message || 'Failed to create chat');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Caught error:', error);
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };
  
  

  if (isInitialRender) {
    return null;
  }

  return (
    <div className="relative flex flex-col md:flex-row h-screen overflow-hidden bg-back">
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-75 z-10 md:hidden ${
          sidebarVisible ? "block" : "hidden"
        }`}
        onClick={toggleSidebar}
      ></div>
      <div
        className={`fixed inset-y-0 left-0 transform md:transform-none md:static transition-transform duration-300 ease-in-out z-20 ${
          sidebarVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          sidebarVisible={sidebarVisible}
          toggleSidebar={toggleSidebar}
          setActiveChatId={setActiveChatId}
          chats={chats}
        />
      </div>
      <div className="flex-grow h-full overflow-hidden">
        <ChatArea
          toggleSidebar={toggleSidebar}
          sidebarVisible={sidebarVisible}
          activeChatId={activeChatId}
          onNewChatCreated={handleNewChatCreated}
          activeUserId={activeUserId}
        />
      </div>
    </div>
  );
}
