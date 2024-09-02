'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Logo from '@/images/logo/black.svg'
import loader from '@/images/loaderlogo.png'
import classes from '../styles/scrolebar.module.css'
import whitLogo from '@/images/logo/logo-white-white.png'
import { BsFillSendFill } from 'react-icons/bs'
import { RiMenu3Fill } from 'react-icons/ri'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import DarkModeToggle from './darkmodebutton'
import WordByWordTypingEffect from './typing-word-response'
import { useChatMessages, useSendMessage } from '@/pages/api/rtq-query/Messages'
import { motion } from 'framer-motion'
const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleDropdown = () => setIsOpen(!isOpen)
  const closeDropdown = () => setIsOpen(false)
  return { isOpen, toggleDropdown, closeDropdown }
}

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
  const [chatMessges, setChatMessages] = useState<any[]>([])
  const [loadingBrowser, setLoadingBrowser] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const userName = localStorage.getItem('name')
  const firstLetter = userName ? userName.charAt(0).toUpperCase() : ''
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark'
    }
    return false
  })
  const {
    data: chatMessages = [],
    isLoading: loading,
    error,
  } = useChatMessages(activeChatId)
  const sendMessageMutation = useSendMessage()

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

  const handleSendMessage = async () => {
    if (!activeUserId || !message.trim()) return

    let chatIdToUse = activeChatId

    if (!chatIdToUse) {
      await onNewChatCreated()
      chatIdToUse = localStorage.getItem('activeChatId')
    }

    if (!chatIdToUse) {
      console.error('Failed to create or retrieve chat ID')
      return
    }

    const newUserMessage = {
      senderType: 'user',
      content: message,
    }
    setChatMessages((prevMessages: any) => [...prevMessages, newUserMessage])

    setMessage('')

    sendMessageMutation.mutate({
      chatId: chatIdToUse,
      query: message,
      userId: activeUserId,
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  useEffect(() => {
    if (chatMessages && chatMessages.length > 0) {
      setChatMessages(
        chatMessages.map((msg: { message: string; type: string }) => ({
          content: msg.message,
          senderType: msg.type,
        })),
      )
    } else {
      setChatMessages([])
    }
  }, [activeChatId, chatMessages])

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const dropDown = () => (
    <div className="absolute right-0 z-10 mt-2 w-32 rounded-md border border-gray-900 bg-black shadow-lg">
      <button
        onClick={() => router.push('/profile')}
        className={clsx(
          'flex w-full items-center border-b-2 border-gray-600 px-4 py-2 text-sm font-thin text-white hover:bg-gray-800',
        )}
      >
        Profile
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
    const quotesPattern = /"([^"]+)"/g
    const urlPattern = /(https?:\/\/[^\s]+)/g
    const textToRemove = /undefined/g
    const casePattern = /(Case \d+:)/g

    let formattedText = inputText.replace(
      casePattern,
      (match) => `\n\n**${match}**\n\n`,
    )
    formattedText = formattedText.replace(quotesPattern, '**"$1"**')
    formattedText = formattedText.replace(
      urlPattern,
      `🗂️[**Download 👈**]($1)\n\n`,
    )
    formattedText = formattedText.replace(textToRemove, '')
    formattedText = formattedText.replace(/\n/g, '\n\n')

    return formattedText
  }

  const handlenavigate = () => {
    setLoadingBrowser(true)
  }
  return (
    <div className="relative flex h-screen flex-1 flex-col bg-white p-2 text-black dark:bg-gray-900">
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
          <button
            onClick={handlenavigate}
            className="ml-4 flex h-8 items-center justify-center rounded-full border-black bg-black px-4 hover:bg-buttonHover dark:bg-white sm:ml-0 sm:h-10 sm:px-5"
          >
            <p className="text-xs text-white dark:text-black sm:text-base">
              {loadingBrowser ? 'Loading...' : 'Browse Cases'}
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
              <p className="text-xs font-medium text-white dark:text-black sm:text-base">
                {firstLetter}
              </p>
            </button>

            {isOpen && dropDown()}
          </div>
        </div>
      </div>

      <div
        className={`mt-8 flex w-full flex-1 flex-col items-center gap-y-2 overflow-y-auto pr-2`}
      >
        {loading ? (
          <div className="flex flex-1">
            <div className="flex h-full flex-col justify-center text-center">
              <div className="flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: [0, 1, 0.5] }}
                  transition={{
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: 4,
                    ease: 'easeInOut',
                  }}
                  style={{ display: 'inline-block' }} // Ensuring the div behaves like an image element
                >
                  <Image
                    src={isDarkMode ? whitLogo : loader}
                    alt="Ai-Attorney Logo"
                    width={200}
                    height={200}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        ) : chatMessages?.length === 0 ? (
          <div className="flex flex-1">
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
          <div
            className={`${classes.sidebar} flex w-full flex-grow flex-col overflow-y-auto px-4`}
          >
            <div className="w-full flex-col space-y-4">
              {chatMessges?.map((msg, index) => (
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
                      className="flex h-8 w-8 justify-center rounded-full border-black p-1 dark:bg-white sm:h-10 sm:w-10"
                      height={10}
                    />
                  ) : (
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-black bg-black hover:bg-buttonHover dark:bg-white sm:h-10 sm:w-10">
                      <p className="px-1 text-xs font-medium text-white dark:text-black sm:px-2 sm:text-base">
                        {firstLetter}
                      </p>
                    </div>
                  )}
                  <div
                    className={`rounded-lg px-4 py-1 sm:py-2 ${
                      msg?.senderType === 'AI'
                        ? 'w-full bg-white text-black shadow-sm dark:bg-gray-800 dark:text-white'
                        : 'bg-black text-white dark:bg-gray-700 dark:text-white'
                    } text-sm sm:text-base`}
                  >
                    {msg?.senderType === 'AI' ? (
                      <WordByWordTypingEffect
                        text={formatResponseText(msg?.content)}
                        speed={50}
                        id={msg?.id}
                      />
                    ) : (
                      <div className="first-letter:capitalize">
                        {msg?.content}
                      </div>
                    )}
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
            className={`mr-2 flex w-5/6 items-center space-x-2 rounded-2xl border-2 border-black bg-chatbg p-2 dark:border-gray-700 dark:bg-gray-800 ${
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
              className="ml-4 flex-grow resize-none overflow-y-auto bg-chatbg text-base text-gray-900 outline-none dark:bg-gray-800 dark:text-white"
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
