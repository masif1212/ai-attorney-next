"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from "@/images/logo/logo-black.png"
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

const ChatArea: React.FC<{ toggleSidebar: () => void, sidebarVisible: boolean }> = ({ toggleSidebar, sidebarVisible }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { isOpen, toggleDropdown, closeDropdown } = useDropdown();

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    <div className="flex-1 bg-white text-black h-screen flex flex-col relative p-5">
      <div className="flex justify-between items-center">
        {!sidebarVisible && (
          <div className="text-lg font-bold flex space-x-2">
            <button onClick={toggleSidebar} className="p-2 bg-white hover:bg-gray-200 rounded">
              <RiMenu3Fill size={25} color="#000" />
            </button>
          </div>
        )}

        {session && (
          <div className={clsx("relative", sidebarVisible ? "ml-auto" : "")}>
            <button
              className='flex items-center justify-center border-black rounded-full w-10 h-10 bg-black hover:bg-gray-700'
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

      <div className="flex-1 w-full flex flex-col">
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center flex flex-col h-full justify-center">
            <div className="flex items-center justify-center">
              <Image src={Logo} alt="Ai-Attorney Logo" width={200} height={200} />
            </div>
            <div className="flex flex-wrap justify-center space-x-4">
              <h1 className="m-2 rounded font-bold text-3xl md:text-4xl">Ai-Attorney</h1>
            </div>
          </div>
        </div>

        {previews.length > 0 && (
          <div className="relative w-full max-w-4xl mx-auto border-gray-300 rounded-lg mb-2 flex overflow-x-auto">
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
                    className="absolute top-0 right-0 mt-1 mr-1 p-1 bg-black text-white rounded-full hover:bg-gray-700"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <MdOutlineClose size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-full flex justify-center items-center">
          <div className="flex items-center w-full max-w-4xl bg-white rounded-2xl border-black border-2 p-2 space-x-2 relative">
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
            />
            <button className="p-2 bg-white hover:bg-gray-200 rounded flex-shrink-0">
              <BsFillSendFill size={23} color="#000" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
