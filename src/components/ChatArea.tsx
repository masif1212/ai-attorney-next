'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Logo from '@/images/logo/black.svg'
import { BsFillSendFill } from 'react-icons/bs'
import { CgAttachment } from 'react-icons/cg'
import { RiMenu3Fill } from 'react-icons/ri'
import clsx from 'clsx'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MdOutlineLogout } from 'react-icons/md'
import { VscSettingsGear } from 'react-icons/vsc'
import { MdOutlinePayment } from 'react-icons/md'

import Link from 'next/link';

const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const closeDropdown = () => {
    setIsOpen(false)
  }

  return { isOpen, toggleDropdown, closeDropdown }
}

const ChatArea: React.FC<{
  toggleSidebar: () => void
  sidebarVisible: boolean
  activeChatId: string | null
  onNewChatCreated: () => void
}> = ({ toggleSidebar, sidebarVisible, activeChatId, onNewChatCreated }) => {
  const router = useRouter()
  const { isOpen, toggleDropdown, closeDropdown } = useDropdown()
  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  const fetchMessages = async (chatId: string) => {
    if (!chatId) return
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`/api/chat/messages/${chatId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch chat messages')
      }

      const data = await response.json()
      setChatMessages(data.messages)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!activeChatId || !message.trim()) return

    // Logic to determine if a new chat is created
    onNewChatCreated()

    const token = localStorage.getItem('token')
    const newUserMessage = {
      senderType: 'user',
      content: message,
    }

    setChatMessages((prev) => [...prev, newUserMessage])
    setMessage('') // Clear the input field after sending

    try {
      setLoading(true) // Set loading to true when API call starts

      const response = await fetch('/api/chat/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId: activeChatId,
          content: message,
        }),
      })

      const result = await response.json()

      if (result && result.pair) {
        const { userMessage, aiMessage } = result.pair

        setChatMessages((prev) => [
          ...prev.map((msg) =>
            msg === newUserMessage
              ? {
                ...msg,
                content: userMessage.content || 'Message sent',
              }
              : msg,
          ),
          {
            senderType: 'AI',
            content: aiMessage.content || 'Loading response...',
          },
        ])
      } else {
        console.error('Unexpected API response format', result)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false) // Reset loading to false once API call is complete
    }
  }

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault() // Prevent the default behavior of adding a new line
      handleSendMessage()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (activeChatId) {
      fetchMessages(activeChatId)
    }
  }, [activeChatId])

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, loading])

  const dropDown = () => (
    <div className="w absolute right-0 z-10 mt-2 rounded-md border border-gray-900 bg-black shadow-lg">
      <button
        onClick={() => router.push('/payment')}
        className={clsx(
          'flex w-32 items-center border-b-2 border-gray-600 px-4 py-2 text-sm font-thin text-white hover:bg-gray-800',
        )}
      >
        <MdOutlinePayment size={18} className="mr-2" />
        Payments
      </button>

      {/* <button
        className={clsx(
          'flex w-32 items-center border-b-2 border-gray-600 px-4 py-2 text-sm font-thin text-white hover:bg-gray-800',
        )}
      >
        <VscSettingsGear size={18} className="mr-2" />
        Settings
      </button> */}

      <button
        onClick={handleSignOut}
        className={clsx(
          'flex w-32 items-center border-b-2 border-gray-600 px-4 py-2 text-sm font-thin text-white',
        )}
      >
        <MdOutlineLogout size={18} className="mr-2" />
        Sign out
      </button>
    </div>
  )

  const handleResize = (e: any) => {
    e.target.style.height = 'auto' // Reset the height to auto
    e.target.style.height = `${e.target.scrollHeight}px` // Set the height to the scrollHeight
  }

  return (
    <div className="relative flex h-screen flex-1 flex-col bg-white p-5 text-black ">

      <div className="flex items-center justify-between">
        {!sidebarVisible && (
          <div className="flex space-x-2 text-lg font-bold">
            <button
              onClick={toggleSidebar}
              className="rounded bg-white p-1 hover:bg-gray-300"
            >
              <RiMenu3Fill size={25} color="#000" />
            </button>
          </div>
        )}

        <div className="ml-auto flex flex-row justify-center items-cente">
          <Link href="/searchcases">
            <button className="mr-2 flex h-8 sm:h-10 px-3 sm:px-5 items-center justify-center rounded-4xl border-black bg-black hover:bg-buttonHover">
              <p className="text-xs sm:text-base text-white">Search Cases</p>
            </button>
          </Link>

          <div className={clsx('relative', sidebarVisible ? 'ml-auto' : '')}>
            <button
              className="flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-full border-black bg-black hover:bg-buttonHover"
              onClick={toggleDropdown}
            >
              <p className="text-xs sm:text-base text-white">M</p>
            </button>
            {isOpen && dropDown()}
          </div>
        </div>


      </div>

      <div className="mt-2 flex w-full flex-1 flex-col overflow-y-auto ">
        {chatMessages?.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex h-full flex-col justify-center text-center">
              <div className="flex items-center justify-center">
                <Image
                  src={Logo}
                  alt="Ai-Attorney Logo"
                  width={200}
                  height={200}
                />
              </div>
              <div className="flex flex-wrap justify-center space-x-4">
                {/* <h1 className="m-2 rounded p-4 text-3xl font-bold md:text-5xl">
                  Ai-Attorney
                </h1> */}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-grow flex-col items-center overflow-y-auto px-4">
            <div className="w-5/6 flex-col space-y-4">
              {chatMessages?.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg?.senderType === 'AI' ? 'justify-end' : 'justify-start'}`}
                >
                  <div>
                    <div
                      className={`rounded-lg py-1 px-3 ${msg?.senderType === 'AI'
                        ? 'flex justify-end bg-gray-100 text-black shadow-lg text-sm sm:text-base'
                        : 'text-md sm:text-base bg-black text-white text-sm '
                        }`}
                    >
                      {msg?.content}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex w-full justify-start">
                  <div className="loading-container flex w-full flex-col">
                    <div className="loading-bar h-3 justify-center"></div>
                    <div className="loading-bar h-3"></div>
                    <div className="loading-bar h-3"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        <div className="flex w-full items-center justify-center p-4">
         
          <div className="flex w-full max-w-5xl items-center space-x-2 rounded-2xl border-2 border-black bg-white px-2 py-2">
            <textarea
              placeholder="Enter prompt here ..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                handleResize(e)
              }}
              onKeyDown={handleKeyDown}
              className="ml-4 flex-grow resize-none overflow-y-auto bg-white text-base text-gray-900 outline-none"
              style={{
                height: 'auto',
                minHeight: '24px',
                maxHeight: '72px',
                fontWeight: '500',
              }}
              rows={1}
            />

            <button
              onClick={handleSendMessage}
              className="flex items-center justify-center rounded bg-white p-2 hover:bg-gray-300"
              disabled={message.trim() === ''}
            >
              <BsFillSendFill size={20} color="#000" />
            </button>
          </div>



        </div>
      </div>
    </div>
  )
}

export default ChatArea
