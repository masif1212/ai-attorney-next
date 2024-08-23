'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { RiMenu2Line } from 'react-icons/ri'
import { MdOutlineAddComment } from 'react-icons/md'
import ButtonForBlackScreen from './ButtonForBlackScreen'
import '../styles/custom.css'
import {  useRouter } from 'next/navigation'

// Interface for chat items
interface ChatItem {
  latestMessage: string
  id: string
  createdAt: string
  messages: Message[]
  fullContext: { content: string }[]
}

// Interface for messages within chat items
interface Message {
  senderId: string
  content: string
  timestamp: string
}

// Props interface for Sidebar component
interface SidebarProps {
  sidebarVisible: boolean
  toggleSidebar: () => void
  setActiveChatId: (chatId: string) => void
  chats: ChatItem[]
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarVisible,
  toggleSidebar,
  setActiveChatId,
  chats

}) => {
  const [chatItems, setChatItems] = useState<ChatItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [todayChats, setTodayChats] = useState<ChatItem[]>([])
  const [previousChats, setPreviousChats] = useState<ChatItem[]>([])
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('activeUserId')
  const completeMsg = localStorage.getItem('completedMessages')

  const fetchChatHistory = useCallback(async () => {
    console.log('fetching chat history');
    if (!chats) return;
 

    try {
      const response = await fetch(`/api/chat/history/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch chat history')
      }

      const data = await response.json()
      setTodayChats(data?.today)
      setPreviousChats(data.previous)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
    }
  }, [userId, token, chats,completeMsg])

  useEffect(() => {
    fetchChatHistory()
  }, [fetchChatHistory, sidebarVisible])

  const handleCreateOrFetchChat = async () => {
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
        const newChat: ChatItem = {
          id: data.chatId,
          latestMessage: '',
          createdAt: new Date().toISOString(),
          messages: [],
          fullContext: [{ content: '' }],
        };
  
        setActiveChatId(data.chatId);
        localStorage.setItem('activeChatId', data.chatId);
  
        setChatItems((prevChats) => [newChat, ...prevChats]);
        setTodayChats((prevChats) => [newChat, ...prevChats]);
  
        await fetchChatHistory();
      } else {
        console.error('Error response data:', data);
        setError(data.message || 'Failed to create chat');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Caught error:', error);
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };
  

 

  useEffect(() => {
    fetchChatHistory()
  }, [fetchChatHistory, chats])

  if (!sidebarVisible) {
    return null
  }

  return (
    <div className="flex dark:bg-gray-800 h-screen w-60 flex-col border-2 border-black dark:border-gray-900 bg-black px-3 py-3 text-white">
      <div className="flex flex-row  justify-between pt-3" >
        <ButtonForBlackScreen onClick={toggleSidebar}>
          <RiMenu2Line size={25} color="#faf5f5" />
        </ButtonForBlackScreen>

        <ButtonForBlackScreen onClick={handleCreateOrFetchChat}>
          <MdOutlineAddComment size={25} color="#faf5f5"  />
        </ButtonForBlackScreen>
      </div>

      <div className="custom-scrollbar px-3 py-3 flex-1  overflow-y-auto">
        {todayChats?.length > 0 && (
          <div className="mt-5">
            <div className="text-sm font-bold gap-y-2  border-b-2 border-zinc-400 ">Today</div>
            <ul>
              {todayChats?.map((item, index) => (
                <li
                  key={index}
                  className="mr-1 px-1 py-1 mb-1 rounded hover:bg-gray-900"
                >
                  <button
                    className="rounded text-sm text-gray-400 w-full"
                    onClick={() => setActiveChatId(item?.id)}
                  >
                    <span className="flex justify-start text-white w-full  px-1">
                      {
                        item.fullContext[0]?.content.length <= 25
                          ? item.fullContext[0]?.content
                          : item.fullContext[0]?.content.substring(0, 25) + "..."
                      }
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {previousChats?.length > 0 && (
          <div className="mt-5">
            <div className="text-sm font-bold gap-y-2  border-b-2 border-zinc-400 ">Previous Day</div>
            <ul className="space-y-2">
              {previousChats?.map((item, index) => (
                <li
                  key={index}
                  className="mr-1 px-1 py-1 mb-1 rounded hover:bg-gray-900"
                >
                  <button
                    className="rounded text-sm text-gray-400 w-full"
                    onClick={() => setActiveChatId(item?.id)}
                  >
                    <span className="flex justify-start text-white w-full  px-1">
                      {
                        item?.fullContext[0]?.content?.length <= 25
                          ? item.fullContext[0]?.content
                          : item.fullContext[0]?.content.substring(0, 25) + "..."
                      }
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    
    </div>
  )
}

export default Sidebar
