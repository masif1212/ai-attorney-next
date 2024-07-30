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

const ChatArea: React.FC<{ toggleSidebar: () => void, sidebarVisible: boolean }> = ({ toggleSidebar, sidebarVisible }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { isOpen, toggleDropdown, closeDropdown } = useDropdown();

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [casesToShow, setCasesToShow] = useState<any[]>([]);

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

  const handleSend = () => {
    setIsMessageSent(true);
    setCasesToShow(cases); // Show cases when the message is sent
  };

  const cases = [
    {
      title: "Brown v. Board of Education (1954) - United States",
      summary: "This landmark Supreme Court case declared state laws establishing separate public schools for black and white students to be unconstitutional. It overturned the Plessy v. Ferguson decision of 1896, which allowed state-sponsored segregation.",
      significance: "It was a major victory in the Civil Rights Movement and paved the way for integration and the civil rights legislation of the 1960s."
    },
    {
      title: "Roe v. Wade (1973) - United States",
      summary: "The Supreme Court ruled that a state law that banned abortions (except to save the life of the mother) was unconstitutional. The decision legalized abortion nationwide, establishing a woman's right to choose as protected under the right to privacy.",
      significance: "This case has been a focal point in the debate over reproductive rights and continues to be a contentious issue in American politics."
    },
    {
      title: "Miranda v. Arizona (1966) - United States",
      summary: "The Supreme Court held that detained criminal suspects must be informed of their rights to an attorney and against self-incrimination prior to police questioning.",
      significance: "This case led to the creation of the 'Miranda Rights' that must be recited by law enforcement officers when arresting someone."
    },
    {
      title: "The People v. O.J. Simpson (1995) - United States",
      summary: "Former NFL player O.J. Simpson was tried and acquitted for the murders of his ex-wife, Nicole Brown Simpson, and her friend, Ronald Goldman.",
      significance: "This case was highly publicized and raised issues regarding race, celebrity, and the criminal justice system in the United States."
    },
    {
      title: "The People v. O.J. Simpson (1995) - United States",
      summary: "Former NFL player O.J. Simpson was tried and acquitted for the murders of his ex-wife, Nicole Brown Simpson, and her friend, Ronald Goldman.",
      significance: "This case was highly publicized and raised issues regarding race, celebrity, and the criminal justice system in the United States."
    },
    {
      title: "The People v. O.J. Simpson (1995) - United States",
      summary: "Former NFL player O.J. Simpson was tried and acquitted for the murders of his ex-wife, Nicole Brown Simpson, and her friend, Ronald Goldman.",
      significance: "This case was highly publicized and raised issues regarding race, celebrity, and the criminal justice system in the United States."
    },
    {
      title: "The People v. O.J. Simpson (1995) - United States",
      summary: "Former NFL player O.J. Simpson was tried and acquitted for the murders of his ex-wife, Nicole Brown Simpson, and her friend, Ronald Goldman.",
      significance: "This case was highly publicized and raised issues regarding race, celebrity, and the criminal justice system in the United States."
    },

  ];

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
              {casesToShow.map((caseItem, index) => (
                <div key={index} className="mb-4">
                  <h2 className="font-bold">{caseItem.title}</h2>
                  <p>{caseItem.summary}</p>
                  <p><em>{caseItem.significance}</em></p>
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
