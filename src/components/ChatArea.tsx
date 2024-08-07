'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Logo from '@/images/logo/logo.svg';
import { BsFillSendFill } from 'react-icons/bs';
import { CgAttachment } from 'react-icons/cg';
import { RiMenu3Fill } from 'react-icons/ri';
import clsx from 'clsx';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MdOutlineLogout } from 'react-icons/md';
import { VscSettingsGear } from 'react-icons/vsc';
import { MdOutlinePayment } from 'react-icons/md';

const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return { isOpen, toggleDropdown, closeDropdown };
};

const ChatArea: React.FC<{
  toggleSidebar: () => void;
  sidebarVisible: boolean;
  activeChatId: string | null;
  onNewChatCreated: () => void;
}> = ({ toggleSidebar, sidebarVisible, activeChatId,onNewChatCreated  }) => {
  const router = useRouter();
  const { isOpen, toggleDropdown, closeDropdown } = useDropdown();
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };


  const fetchMessages = async (chatId: string) => {
    if (!chatId) return;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`/api/chat/messages/${chatId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat messages');
      }

      const data = await response.json();
      setChatMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!activeChatId || !message.trim()) return;
    const token = localStorage.getItem('token');

    const newUserMessage = {
      senderType: 'user',
      content: message,
    };

    setChatMessages((prev) => [...prev, newUserMessage]);
    setMessage(''); // Clear the input field after sending

    try {
      setLoading(true);
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
      });

      const result = await response.json();

      if (result && result.pair) {
        const { userMessage, aiMessage } = result.pair;
        onNewChatCreated();
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
        ]);
      } else {
        console.error('Unexpected API response format', result);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false); // Reset loading to false once API call is complete
    }
  };

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeChatId) {
      fetchMessages(activeChatId);
    }
  }, [activeChatId]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, loading]);

  const dropDown = () => (
    <div className="w absolute right-0 z-10 mt-2 rounded-md border border-gray-900 bg-black shadow-lg">
      <button
        className={clsx(
          'flex w-32 items-center border-b-2 border-gray-600 px-4 py-2 text-sm font-thin text-white hover:bg-gray-800',
        )}
      >
        <MdOutlinePayment size={18} className="mr-2" />
        Plans
      </button>

      <button
        className={clsx(
          'flex w-full items-center border-b-2 border-gray-600 px-4 py-2 text-sm font-thin text-white hover:bg-gray-800',
        )}
      >
        <VscSettingsGear size={18} className="mr-2" />
        Settings
      </button>

      <button
        onClick={handleSignOut}
        className={clsx(
          'flex w-full items-center px-4 py-2 text-sm font-thin text-white hover:bg-gray-800',
        )}
      >
        <MdOutlineLogout size={18} className="mr-2" />
        Sign out
      </button>
    </div>
  );

  return (
    <div className="relative flex h-screen flex-1 flex-col bg-test p-5 text-black">
      <div className="flex items-center justify-between">
        {!sidebarVisible && (
          <div className="flex space-x-2 text-lg font-bold">
            <button
              onClick={toggleSidebar}
              className="rounded bg-white p-2 hover:bg-gray-300"
            >
              <RiMenu3Fill size={25} color="#000" />
            </button>
          </div>
        )}

        <div className={clsx('relative', sidebarVisible ? 'ml-auto' : '')}>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border-black bg-black hover:bg-buttonHover"
            onClick={toggleDropdown}
          >
            <p className="text-white">User</p>
          </button>
          {isOpen && dropDown()}
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col overflow-y-auto">
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
                <h1 className="m-2 rounded p-4 text-3xl font-bold md:text-5xl">
                  Ai-Attorney
                </h1>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-grow flex-col overflow-y-auto p-4 items-center">
            <div className="flex-col w-5/6 pl-5 space-y-4">
              {chatMessages?.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg?.senderType === 'AI' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div>
                    <div
                      className={`rounded-lg p-2 ${
                        msg?.senderType === 'AI'
                          ? 'flex justify-end bg-gray-100 text-black shadow-lg'
                          : 'bg-black text-white text-md'
                      }`}
                    >
                      {msg?.content}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-end">
                  <div className="rounded-lg bg-blue-500 p-2 text-white">
                    Loading...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        <div className="flex w-full items-center justify-center p-4">
          <div className="flex w-full max-w-4xl items-center space-x-2 rounded-2xl border-2 border-black bg-white px-2 py-2">
            <button className="flex-shrink-0 rounded bg-white p-1 hover:bg-gray-300">
              <CgAttachment size={25} color="#000" />
            </button>
            <input
              type="text"
              placeholder="Write here ..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow bg-white text-base text-gray-900 outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="flex-shrink-0 rounded bg-white p-1 hover:bg-gray-300"
              disabled={loading}
            >
              <BsFillSendFill size={23} color="#000" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
