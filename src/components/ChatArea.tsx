"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Logo from "@/images/logo/logo.svg";
import { BsFillSendFill } from "react-icons/bs";
import { CgAttachment } from "react-icons/cg";
import { RiMenu3Fill } from "react-icons/ri";
import clsx from 'clsx';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MdOutlineLogout } from "react-icons/md";
import { VscSettingsGear } from "react-icons/vsc";
import { MdOutlinePayment } from "react-icons/md";

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

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
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
    <div className="flex-1 bg-test text-black h-screen flex flex-col relative p-5">
      <div className="flex justify-between items-center">
        {!sidebarVisible && (
          <div className="text-lg font-bold flex space-x-2 ">
            <button onClick={toggleSidebar} className="p-2 bg-white hover:bg-gray-300 rounded">
              <RiMenu3Fill size={25} color="#000" />
            </button>
          </div>
        )}

        {session && (
          <div className={clsx("relative", sidebarVisible ? "ml-auto" : "")}>
            <button
              className='flex items-center justify-center  border-black rounded-full w-10 h-10 bg-black hover:bg-buttonHover'
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

      <div className="flex-1 w-full flex flex-col">
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center flex flex-col h-full justify-center">
            <div className="flex items-center justify-center">
              <Image src={Logo} alt="Ai-Attorney Logo" width={200} height={200} />
            </div>
            <div className="flex flex-wrap justify-center space-x-4">
              <h1 className="p-4 m-2 rounded font-bold text-3xl md:text-5xl">Ai-Attorney</h1>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center items-center p-4">
          <div className="flex items-center w-full max-w-4xl bg-white rounded-2xl border-black border-2 px-2 py-2 space-x-2">
            <button className="p-1 bg-white hover:bg-gray-300 rounded flex-shrink-0">
              <CgAttachment size={25} color="#000" />
            </button>
            <input
              type="text"
              placeholder="write here ..."
              className="flex-grow bg-white outline-none text-gray-900 text-base"
            />
            <button className="p-1 bg-white hover:bg-gray-300 rounded flex-shrink-0">
              <BsFillSendFill size={23} color="#000" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
