'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { RiMenu2Line } from 'react-icons/ri'
import { MdOutlineAddComment } from 'react-icons/md'
import ButtonForBlackScreen from './ButtonForBlackScreen'
import Popup from './Popup'
import '../styles/custom.css'

interface SidebarProps {
  sidebarVisible: boolean
  toggleSidebar: () => void
  setActiveChatId: (chatId: string) => void
}

interface ChatItem {
  latestMessage: string
  id: string
  createdAt: string
  messages: any[]
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarVisible,
  toggleSidebar,
  setActiveChatId,
}) => {
  const [chatItems, setChatItems] = useState<ChatItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [todayChats, setTodayChats] = useState<ChatItem[]>([])
  const [previousChats, setPreviousChats] = useState<ChatItem[]>([])

  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('activeUserId')

  const fetchChatHistory = useCallback(async () => {
    if (!userId || !token) {
      setError('User ID or token is not available')
      return
    }

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
      setTodayChats(data.today)
      setPreviousChats(data.previous)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
    }
  }, [userId, token])

  const handleCreateOrFetchChat = async () => {
    if (!token) {
      setError('Token is not available')
      return
    }

    try {
      const response = await fetch('/api/chat/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (response.ok) {
        setActiveChatId(data.chatId)
        localStorage.setItem('activeChatId', data.chatId)
        await fetchChatHistory() // Fetch history immediately after creating chat
      } else {
        console.error('Error response data:', data)
        setError(data.message || 'Failed to create chat')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Caught error:', error)
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
    }
  }

  useEffect(() => {
    if (sidebarVisible) {
      fetchChatHistory() // Fetch chat history only when the sidebar is visible
    }
  }, [fetchChatHistory, sidebarVisible])

  const closeError = () => {
    setError(null)
  }

  if (!sidebarVisible) {
    return null
  }

  return (
    <div className="flex h-screen w-60 flex-col border-2 border-black bg-black px-3 py-3 text-white">
      <div className="flex flex-row justify-between">
        <ButtonForBlackScreen onClick={toggleSidebar}>
          <RiMenu2Line size={23} color="#faf5f5" />
        </ButtonForBlackScreen>
        <ButtonForBlackScreen onClick={handleCreateOrFetchChat}>
          <MdOutlineAddComment size={25} color="#faf5f5" />
        </ButtonForBlackScreen>
      </div>
      <div className="custom-scrollbar flex-1 overflow-y-auto">
        {todayChats.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 text-sm font-bold">Today</div>
            <ul className="space-y-2">
              {todayChats.map((item, index) => (
                <li
                  key={index}
                  className="mr-1 rounded px-1 hover:bg-gray-900"
                >
                  <button
                    className="flex justify-between rounded text-sm text-gray-400"
                    onClick={() => setActiveChatId(item.id)}
                  >
                    <span className="truncate font-semibold text-slate-100">
                      {item.latestMessage}...
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {previousChats.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 text-sm font-bold">Previous Day</div>
            <ul className="space-y-2">
              {previousChats.map((item, index) => (
                <li
                  key={index}
                  className="mr-1 rounded px-1 hover:bg-gray-900"
                >
                  <button
                    className="flex justify-between text-sm text-gray-400"
                    onClick={() => setActiveChatId(item.id)}
                  >
                    <span className="truncate">{item.latestMessage}...</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {error && <Popup message={error} onClose={closeError} />}
    </div>
  )
}

export default Sidebar
