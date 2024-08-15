'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Logo from '@/images/logo/black.svg'
import { BsFillSendFill } from 'react-icons/bs'
import { RiMenu3Fill } from 'react-icons/ri'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleDropdown = () => setIsOpen(!isOpen)
  const closeDropdown = () => setIsOpen(false)
  return { isOpen, toggleDropdown, closeDropdown }
}

const formatResponseText = (inputMessage: string): string => {
  const linePattern = /^-\s*(.*?):/gm;
  const headingPattern = /^###\s*(.*?):?/gm;
  const caseNumberPattern = /Case\s[1-9]+:/g;
  const urlPattern = /\[(.*?)\]\((https?:\/\/[^\s]+)\)/g;
  const numberingPattern = /^(\d+)\.\s+/gm; // Pattern to match numbering like 1. 2. 3. etc.

  // Sections to format
  const sectionsToBold = [
    'Case Title',
    'Citation',
    'Court',
    'Key Facts',
    'Proceedings',
    "Judge's Decision",
    'Reference URL',
  ];

  // Replace headings with formatted HTML and make the font larger
  let finalText = inputMessage.replace(headingPattern, (match, p1) => {
    return `<h3 style="font-size: 1.5em; margin-top: 10px;">${p1.trim()}</h3>`;
  });

  // Replace lines starting with - and apply semi-bold formatting to specified sections with slightly larger text
  finalText = finalText.replace(linePattern, (match, p1) => {
    if (sectionsToBold.includes(p1.trim())) {
      return `<p style="font-size: 1.2em;"><span style="font-weight: 600;">• ${p1.trim()}:</span>`;
    }
    return `<p style="font-size: 1em;">${p1.trim()}:`;
  });

  // Apply bold, large font size, and add a black bullet before "Case 1", "Case 2", "Case 3", etc.
  finalText = finalText.replace(caseNumberPattern, match => {
    return `<span style="font-weight: 700; font-size: 1.3em;">&#8226; ${match}</span>`;
  });

  // Apply semi-bold formatting with a colon after the specified sections
  sectionsToBold.forEach(section => {
    const sectionPattern = new RegExp(`(${section}):`, 'g');
    finalText = finalText.replace(
      sectionPattern,
      '<span style="font-weight: 600;">$1:</span>'
    );
  });

  // Format numbered lists, bolding the numbers and keeping them on the same line with the text
  finalText = finalText.replace(numberingPattern, (match, p1) => {
    return `<p><strong>${p1}.</strong> `;
  });

  // Replace URLs with "Download Case" text that links to the actual URL
  finalText = finalText.replace(urlPattern, (match, text, url) => {
    return `<a style="color: #2980B9;" href="${url}" target="_blank">Download Case</a></p>`;
  });

  // Replace any lines starting with `- ` (in case there are items not captured by the above patterns)
  finalText = finalText.replace(/^- (.*)/gm, (match, p1) => {
    return `<p>${p1.trim()}</p>`;
  });

  // Clean up any excessive new lines
  finalText = finalText.replace(/\n{2,}/g, '\n\n');
  finalText = finalText.replace(/^\n+|\n+$/g, '');

  // Ensure proper paragraph closing tags
  finalText = finalText.replace(/(<\/p>)(?=<strong>)/g, '</p>\n<p>');

  // Remove any remaining ** markers from the text
  finalText = finalText.replace(/\*\*(.*?)\*\*/g, '$1');

  return finalText;
};



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
        throw new Error(`Failed to fetch chat messages: ${response.statusText}`)
      }
      const data = await response.json()
      if (data.chat_history && data.chat_history.length > 0) {
        setChatMessages(
          data.chat_history.map((msg: { message: string; type: string }) => ({
            content: formatResponseText(msg.message),
            senderType: msg.type,
          }))
        )
      } else {
        setChatMessages([])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!activeUserId || !message.trim()) return;
  
    let chatIdToUse = activeChatId;
  
    if (!chatIdToUse) {
      onNewChatCreated();
      chatIdToUse = localStorage.getItem('activeChatId');
    }
  
    if (!chatIdToUse) {
      console.error('Failed to create or retrieve chat ID');
      return;
    }
  
    const token = localStorage.getItem('token');
    const newUserMessage = {
      senderType: 'user',
      content: message,
    };
  
    setChatMessages(prev => [...prev, newUserMessage]);
  
    setMessage('');
  
    try {
      setLoading(true);
  
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
      });
  
      const result = await response.json();
  
      if (result && result.pair) {
        const { aiMessage } = result.pair;
  
        setChatMessages(prev => [
          ...prev,
          {
            senderType: 'AI',
            content: formatResponseText(aiMessage.content || 'Error receiving response.'),
          },
        ]);
      } else {
        console.error('Unexpected API response format', result);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (activeChatId) {
      fetchMessages(activeChatId)
    }
  }, [activeChatId])

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
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
          'flex w-full items-center border-b-2 border-gray-600 px-4 py-2 text-sm font-thin text-white hover:bg-gray-800'
        )}
      >
        Payments
      </button>
      <button
        onClick={handleSignOut}
        className={clsx(
          'flex w-full items-center border-b-2 border-gray-600 px-4 py-2 text-sm font-thin text-white'
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

  return (
    <div className="relative flex h-screen flex-1 flex-col bg-chatbg p-5 text-black">
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

        <div className="ml-auto flex flex-row items-center justify-center">
          <Link href="/searchcases">
            <button className="mr-2 flex h-8 items-center justify-center rounded-4xl border-black bg-black px-3 hover:bg-buttonHover sm:h-10 sm:px-5">
              <p className="text-xs text-white sm:text-base">Search Cases</p>
            </button>
          </Link>

          <div className={clsx('relative', sidebarVisible ? 'ml-auto' : '')}>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full border-black bg-black hover:bg-buttonHover sm:h-10 sm:w-10"
              onClick={toggleDropdown}
            >
              <p className="text-xs text-white sm:text-base">M</p>
            </button>
            {isOpen && dropDown()}
          </div>
        </div>
      </div>

      <div className="mt-2 flex w-full flex-1 flex-col overflow-y-auto pr-2">
        {chatMessages?.length === 0 && !loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex h-full flex-col justify-center text-center">
              <div className="flex items-center justify-center">
                <Image src={Logo} alt="Ai-Attorney Logo" width={200} height={200} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-grow flex-col items-center overflow-y-auto">
            <div className="w-5/6 flex-col space-y-4">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.senderType === 'AI' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`rounded-lg py-2 px-3 ${
                      msg.senderType === 'AI'
                        ? 'bg-white text-black shadow-lg'
                        : 'bg-black text-white'
                    } text-sm sm:text-base`}
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                  />
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
            className={`mr-2 flex w-5/6 items-center space-x-2 rounded-2xl border-2 border-black bg-chatbg p-2 ${
              sidebarVisible ? 'max-w-6xl' : 'max-w-7xl'
            }`}
          >
            <textarea
              placeholder="Enter prompt here ..."
              value={message}
              onChange={e => {
                setMessage(e.target.value)
                handleResize(e)
              }}
              onKeyDown={handleKeyDown}
              className="ml-4 flex-grow resize-none overflow-y-auto bg-chatbg text-base text-gray-900 outline-none"
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
