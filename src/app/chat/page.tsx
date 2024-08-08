// pages/chat.tsx
"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import { useSession } from "next-auth/react";


export default function Chat() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chats, setChats] = useState ([]); 

  console.log(chats,'in main componenet')


  

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
    if (storedChatId) {
      setActiveChatId(storedChatId);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };


    // This function is called whenever a new chat is created
    const handleNewChatCreated = () => {
      console.log("handleNewChatCreated function called"); // Check if the function is called
    
      const userId = localStorage.getItem('activeUserId');
      console.log("User ID:", userId); // Verify that userId is not null or undefined
    
      fetch(`/api/chat/history/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => {
          console.log("Fetch response:", response); // Log the response
          return response.json();
        })
        .then((data) => {
          console.log(data, 'data fetched from fetch history'); // Log the fetched data
          setChats(data);
        })
        .catch((error) => {
          console.error("Error fetching chat history:", error);
        });
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
          chats= {chats}
        />
      </div>
      <div className="flex-grow h-full overflow-hidden">
        <ChatArea
          toggleSidebar={toggleSidebar}
          sidebarVisible={sidebarVisible}
          activeChatId={activeChatId}
          onNewChatCreated={handleNewChatCreated} 
        />
      </div>
    </div>
  );
}
