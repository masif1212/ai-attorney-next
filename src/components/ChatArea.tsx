"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from "@/images/logo/logo-black.png";
import { BsFillSendFill } from "react-icons/bs";
import { CgAttachment } from "react-icons/cg";
import { RiMenu3Fill } from "react-icons/ri";
import { MdOutlineClose } from "react-icons/md";
import clsx from 'clsx';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MdOutlineLogout } from "react-icons/md";
import { VscSettingsGear } from "react-icons/vsc";
import { MdOutlinePayment } from "react-icons/md";
import { FaRegFileImage } from "react-icons/fa";
import { FaRegFileAlt } from "react-icons/fa";
import '../styles/custom.css'; // Import the custom CSS file

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

const ChatArea: React.FC<{ toggleSidebar: () => void, sidebarVisible: boolean, selectedChat: string | null }> = ({ toggleSidebar, sidebarVisible, selectedChat }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { isOpen, toggleDropdown, closeDropdown } = useDropdown();

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [apiResponse, setApiResponse] = useState([]);
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  console.log(apiResponse,'muzamil ')



  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    const newFiles = selectedFiles.filter(file => validTypes.includes(file.type));
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    if (newFiles.length !== selectedFiles.length) {
      setErrorMessage('Please select a valid format (image, PDF, or DOC)');
    }

    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;  // Prevent sending empty messages
    setIsMessageSent(true);
    try {
      const response = await fetch('https://516d-2407-aa80-314-fe1a-c0c9-feaf-16df-d8ed.ngrok-free.app/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: inputMessage, chat_id: 2 })
      });
      const data = await response.json();
      if (data) {
        setApiResponse(data.response);  // Handle the specific response for the cases
        setChatHistory(data.chatHistory);  // Store chat history
        setInputMessage('');  // Clear the input after sending
      }
    } catch (error) {
      console.error('Failed to fetch cases:', error);
      setErrorMessage('Failed to load data');
    }
  };

  function formatResponseText(inputMessage : any) {
    const headingPattern = /(Key Facts|Proceedings|Judge's Decision)/g;
    const quotesPattern = /"([^"]+)"/g;
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const textToRemove = /undefined/g;
  
    let formattedText = inputMessage.replace(headingPattern, '\n\n## **$1**');
    formattedText = formattedText.replace(quotesPattern, '**"$1"**');
    formattedText = formattedText.replace(urlPattern, `🗂️[***Click Here 👈***]($1)`);
    formattedText = formattedText.replace(textToRemove, '');
    formattedText = formattedText.replace(/\n/g, '\n\n');
  
    return formattedText;
  }
  

  const name = session?.user?.email?.slice(0, 1).toLocaleUpperCase();

  const dropDown = () => (
    <div className="absolute right-0 mt-2 w bg-black border border-gray-900 rounded-md shadow-lg z-10">
      <button
        className={clsx(
          'w-32 px-4 py-2 text-sm text-white hover:bg-gray-800 flex items-center border-b-2 border-gray-600 font-thin'
        )}
      >
        <MdOutlinePayment size={18} className="mr-2" />
        Plans
      </button>

      <button
        className={clsx(
          'w-full px-4 py-2 text-sm text-white hover:bg-gray-800  flex items-center border-b-2 border-gray-600 font-thin'
        )}
      >
        <VscSettingsGear size={18} className="mr-2" />
        Settings
      </button>

      <button
        onClick={handleSignOut}
        className={clsx(
          'w-full px-4 py-2 text-sm text-white hover:bg-gray-800  flex items-center font-thin'
        )}
      >
        <MdOutlineLogout size={18} className="mr-2" />
        Sign out
      </button>
    </div>
  );

  return (
    <div className="flex-1 bg-white text-black h-screen flex flex-col relative ">
      <div className="flex justify-between items-center">
        {!sidebarVisible && (
          <div className="text-lg font-bold flex space-x-2 pt-3 pl-2">
            <button onClick={toggleSidebar} className="p-2 bg-white hover:bg-gray-200 rounded">
              <RiMenu3Fill size={25} color="#000" />
            </button>
          </div>
        )}

        {session && (
          <div className={clsx("relative pr-4", sidebarVisible ? "ml-auto pr-4 pt-3" : "")}>
            <button
              className='flex items-center justify-center border-black rounded-full w-8 h-8 bg-black hover:bg-gray-700'
              onClick={toggleDropdown}
            >
              <p className='text-white'>{name}</p>
            </button>
            {isOpen && (
              dropDown()
            )}
          </div>
        )}
      </div>

      {errorMessage && (
        <div className='flex justify-center items-center w-full'>
          <div className="w-1/4 bg-red-400 text-white text-center p-2 rounded absolute z-10">
            {errorMessage}
          </div>
        </div>
      )}

      <div className="flex-1 w-full flex flex-col justify-center items-center relative">
        {!isMessageSent ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Image src={Logo} alt="Ai-Attorney Logo" width={200} height={200} />
            <h1 className="m-2 rounded font-bold text-3xl md:text-4xl text-center">Ai-Attorney</h1>
          </div>
        ) : (
          <div className="flex-1 w-full p-5 pr-0 overflow-y-auto" style={{ maxHeight: '84vh' }}>
            <div className="max-w-4xl mx-auto w-full">
              {apiResponse && (
                <div className="mb-4">
                  <h2 className="font-bold">Case Details</h2>
                  <p>{apiResponse}</p>
                </div>
              )}
               {chatHistory.map((chat, index) => (
               <div key={index} className={`${chat.sender === 'user' ? 'text-left' : 'text-left'}`}>
          <p className={`${chat.sender === 'user' ? 'font-semibold' : 'text-sm'}`}>
            {chat.text}
          </p>
        </div>
      ))}
            </div>
          </div>
        )}
      </div>

      {previews.length > 0 && (
        <div className="absolute w-full max-w-4xl mx-auto border-gray-300 rounded-lg flex overflow-x-auto" style={{ top: 'auto', bottom: '5rem' }}>
          <div className="flex flex-nowrap">
            {previews.map((preview, index) => (
              <div key={index} className="relative p-2 flex items-center border border-gray-300 rounded-lg bg-gray-100 w-40 mr-2">
                {files[index].type.startsWith('image/') ? (
                  <FaRegFileImage size={30} className="mr-2" />
                ) : (
                  <FaRegFileAlt size={30} className="mr-2" />
                )}
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium truncate">{files[index].name}</span>
                  <span className="text-xs text-gray-500 truncate">{files[index].type.split('/').pop()?.toUpperCase()}</span>
                </div>
                <button
                  className="absolute top-0 right-0 mr-1 mt-1 p-1 bg-black text-white rounded-full hover:bg-gray-700"
                  onClick={() => handleRemoveFile(index)}
                >
                  <MdOutlineClose size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative w-full flex justify-center items-center z-10 pb-5">
        <div className="flex items-center w-full max-w-4xl bg-white rounded-2xl border-black border p-2 space-x-2 relative">
          <label className="p-2 bg-white hover:bg-gray-200 rounded flex-shrink-0 cursor-pointer">
            <CgAttachment size={25} color="#000" />
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <input
            type="text"
            placeholder="write here ..."
            className="flex-grow bg-white outline-none text-gray-900 text-base"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { // Checks if the Enter key is pressed without the Shift key
                e.preventDefault();  // Prevents the default action of the enter key which is to insert a newline
                handleSend();        // Calls the send function
              }
            }}
          />
          <button className="p-2 bg-white hover:bg-gray-200 rounded flex-shrink-0" onClick={handleSend}>
            <BsFillSendFill size={23} color="#000" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
