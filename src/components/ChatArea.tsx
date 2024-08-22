'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Logo from '@/images/logo/black.svg'
import whitLogo from '@/images/logo/logo-white-white.png'
import { BsFillSendFill } from 'react-icons/bs'
import { RiMenu3Fill } from 'react-icons/ri'
import clsx from 'clsx'
import { redirect, useRouter } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import DarkModeToggle from './darkmodebutton'
import MarkdownTypingEffect from './typing-word-response'

const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleDropdown = () => setIsOpen(!isOpen)
  const closeDropdown = () => setIsOpen(false)
  return { isOpen, toggleDropdown, closeDropdown }
}

// const formatResponseText = (inputMessage: string): string => {
//   const linePattern = /^-\s*(.*?):/gm;
//   const headingPattern = /^###\s*(.*?):?/gm;
//   const caseNumberPattern = /Case\s[1-9]+:/g;
//   const urlPattern = /\[(.*?)\]\((https?:\/\/[^\s]+)\)/g;
//   const numberingPattern = /^(\d+)\.\s+/gm;
//   const sectionsToBold = [
//     'Case Title',
//     'Citation',
//     'Court',
//     'Key Facts',
//     'Proceedings',
//     "Judge's Decision",
//     'Reference URL',
//   ];

//   let finalText = inputMessage.replace(headingPattern, (match, p1) => {
//     return `<h3 style="font-size: 1.5em; margin-top: 10px;">${p1.trim()}</h3>`;
//   });

//   finalText = finalText.replace(linePattern, (match, p1) => {
//     if (sectionsToBold.includes(p1.trim())) {
//       return `<p style="font-size: 1.2em;"><span style="font-weight: 600;">• ${p1.trim()}:</span>`;
//     }
//     return `<p style="font-size: 1em;">${p1.trim()}:`;
//   });
//   finalText = finalText.replace(caseNumberPattern, match => {
//     return `<span style="font-weight: 700; font-size: 1.3em;">&#8226; ${match}</span>`;
//   });
//   sectionsToBold.forEach(section => {
//     const sectionPattern = new RegExp(`(${section}):`, 'g');
//     finalText = finalText.replace(
//       sectionPattern,
//       '<span style="font-weight: 600;">$1:</span>'
//     );
//   });

// finalText = finalText.replace(numberingPattern, (match, p1) => {
//     return `<p><strong>${p1}.</strong> `;
//   });
//   finalText = finalText.replace(urlPattern, (match, text, url) => {
//     return `<a style="color: #2980B9;" href="${url}" target="_blank">Download Case</a></p>`;
//   });
//   finalText = finalText.replace(/^- (.*)/gm, (match, p1) => {
//     return `<p>${p1.trim()}</p>`;
//   });
//   finalText = finalText.replace(/\n{2,}/g, '\n\n');
//   finalText = finalText.replace(/^\n+|\n+$/g, '');
//   finalText = finalText.replace(/(<\/p>)(?=<strong>)/g, '</p>\n<p>');
//   finalText = finalText.replace(/\*\*(.*?)\*\*/g, '$1');
//   return finalText;
// };

const ChatArea: React.FC<{
  toggleSidebar: () => void
  sidebarVisible: boolean
  activeChatId: string | null
  activeUserId: string | null
  onNewChatCreated: () => void
}> = ({
  toggleSidebar,
  sidebarVisible,
  activeChatId,
  onNewChatCreated,
  activeUserId,
}) => {
  const router = useRouter()
  const { isOpen, toggleDropdown, closeDropdown } = useDropdown()
  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark'
    }
    return false
  })
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleSignOut = async () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
    await signOut({ redirect: true })
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
        throw new Error(`Failed to fetch chat messages: ${response.statusText}`)
      }
      const data = await response.json()
      if (data.chat_history && data.chat_history.length > 0) {
        setChatMessages(
          data?.chat_history?.map((msg: { message: string; type: string }) => ({
            content: msg.message,
            senderType: msg.type,
          })),
        )
      } else {
        setChatMessages([])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!activeUserId || !message.trim()) return

    let chatIdToUse = activeChatId

    if (!chatIdToUse) {
      onNewChatCreated()
      chatIdToUse = localStorage.getItem('activeChatId')
    }

    if (!chatIdToUse) {
      console.error('Failed to create or retrieve chat ID')
      return
    }

    const token = localStorage.getItem('token')
    const newUserMessage = {
      senderType: 'user',
      content: message,
    }

    setChatMessages((prev) => [...prev, newUserMessage])
    setMessage('')
    try {
      setLoading(true)
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId: chatIdToUse,
          query: message,
          userId: activeUserId,
        }),
      })

      const result = await response.json()
      if (result && result.pair) {
        const { aiMessage } = result.pair
        setChatMessages((prev) => [
          ...prev,
          {
            senderType: 'AI',
            content: aiMessage.content || 'Error receiving response.',
          },
        ])
      } else {
        console.error('Unexpected API response format', result)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeChatId) {
      fetchMessages(activeChatId)
    }
  }, [activeChatId])

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, loading])
  const dropDown = () => (
    <div className="absolute right-0 z-10 mt-2 w-32 rounded-md border border-gray-900 bg-black shadow-lg">
      <button
        onClick={() => router.push('/payment')}
        className={clsx(
          'flex w-full items-center border-b-2 border-gray-600 px-4 py-2 text-sm font-thin text-white hover:bg-gray-800',
        )}
      >
        Payments
      </button>
      <button
        onClick={handleSignOut}
        className={clsx(
          'flex w-full items-center border-b-2 border-gray-600 px-4 py-2 text-sm font-thin text-white',
        )}
      >
        Sign out
      </button>
    </div>
  )

  const handleResize = (e: any) => {
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }
  function formatResponseText(inputText: string): string {
    const headingPattern = /(Key Facts of the Case:|Proceedings:|Judge's Decision:)/g;
    const quotesPattern = /"([^"]+)"/g;
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const textToRemove = /undefined/g;
    let formattedText = inputText.replace(headingPattern, '\n\n## **$1');
    formattedText = formattedText.replace(quotesPattern, '***"$1"**');
    formattedText = formattedText.replace(urlPattern, `🗂️[***Click Here 👈***]($1)`);
    formattedText = formattedText.replace(textToRemove, '');
    formattedText = formattedText.replace(/\n/g, '\n\n');
    
    return formattedText;
  }
  return (
    <div className="relative flex h-screen flex-1 flex-col bg-chatbg p-5 text-black dark:bg-gray-900">
      <div className="flex items-center justify-between">
        {!sidebarVisible && (
          <div className="flex space-x-2 text-lg font-bold">
            <button
              onClick={toggleSidebar}
              className="rounded bg-chatbg p-1 hover:bg-gray-300"
            >
              <RiMenu3Fill size={25} color="#000" />
            </button>
          </div>
        )}
        <Link href="/searchcases">
          <button className="flex h-8 items-center justify-center rounded-full border-black bg-black hover:bg-buttonHover dark:bg-white sm:h-10 sm:px-5">
            <p className="text-xs text-white dark:text-black sm:text-base">
              Search Cases
            </p>
          </button>
        </Link>
        <div className="ml-auto flex flex-row items-center justify-center gap-2">
          <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />

          <div className={clsx('relative', sidebarVisible ? 'ml-auto' : '')}>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full border-black bg-black hover:bg-buttonHover dark:bg-white sm:h-10 sm:w-10"
              onClick={toggleDropdown}
            >
              <p className="text-xs text-white dark:text-black sm:text-base">
                M
              </p>
            </button>
            {isOpen && dropDown()}
          </div>
        </div>
      </div>

      <div className="mt-2 flex w-full flex-1 flex-col overflow-y-auto pr-2">
        {chatMessages?.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex h-full flex-col justify-center text-center">
              <div className="flex items-center justify-center">
                <Image
                  src={isDarkMode ? whitLogo : Logo}
                  alt="Ai-Attorney Logo"
                  width={200}
                  height={200}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-grow flex-col  items-center overflow-y-auto">
            <div className="w-5/6 flex-col space-y-4">
              {chatMessages?.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-1 ${
                    msg.senderType === 'AI' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.senderType === 'AI' ? (
                    <Image
                      src={Logo}
                      alt="Ai-Attorney Logo"
                      width={10}
                      className='flex p-1 h-8 w-8 items-center justify-center rounded-full dark:bg-white border-black  sm:h-10 sm:w-10'
                      height={10}
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-black bg-black dark:bg-white  hover:bg-buttonHover sm:h-10 sm:w-10">
                      <p className="text-xs text-white dark:text-black sm:text-base">M</p>
                    </div>
                  )}
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      msg.senderType === 'AI'
                        ? 'bg-white text-black dark:bg-gray-800 dark:text-white shadow-lg'
                        : 'bg-black dark:bg-gray-700  dark:text-white text-white'
                    } text-sm sm:text-base`}
                  >
                     <MarkdownTypingEffect
                        text={formatResponseText(msg?.content)}
                        messageId={msg?.question}
                        speed={50}
                      />
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

        <div className="flex w-full items-center justify-center">
          <div
            className={`mr-2 flex w-5/6 items-center space-x-2 rounded-2xl border-2 border-black dark:border-gray-700 bg-chatbg dark:bg-gray-800 p-2 ${
              sidebarVisible ? 'max-w-6xl' : 'max-w-7xl'
            }`}
          >
            <textarea
              placeholder="Enter prompt here ..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                handleResize(e)
              }}
              onKeyDown={handleKeyDown}
              className="ml-4 flex-grow resize-none overflow-y-auto bg-chatbg dark:bg-gray-800 text-base dark:text-white text-gray-900 outline-none"
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
              className="flex items-center justify-center rounded bg-chatbg p-2 hover:bg-gray-300"
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
