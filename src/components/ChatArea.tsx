"use client";

import React from 'react';
import Image from 'next/image';
import Logo from "@/images/logo/logo.svg";
import { BsFillSendFill } from "react-icons/bs";
import { CgAttachment } from "react-icons/cg";
import { RiMenu3Fill } from "react-icons/ri";

const ChatArea: React.FC<{ toggleSidebar: () => void, sidebarVisible: boolean }> = ({ toggleSidebar, sidebarVisible }) => {
  return (
    <div className="flex-1 bg-test text-black h-screen flex flex-col relative p-5">
      <div className="flex-1 w-full flex flex-col">
        {!sidebarVisible && (
          <div className="absolute top-2 left-2 text-lg font-bold flex space-x-2">
            <button onClick={toggleSidebar} className="p-2 bg-white hover:bg-gray-300 rounded">
              <RiMenu3Fill size={25} color='#000' />
            </button>
          </div>
        )}

        <div className="flex-1 flex justify-center items-center">
          <div className="text-center flex flex-col h-full justify-center">
            <div className='flex items-center justify-center'>
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
              <CgAttachment size={25} color='#000' />
            </button>
            <input
              type="text"
              placeholder="write here ..."
              className="flex-grow bg-white outline-none text-gray-900 text-base"
            />
            <button className="p-1 bg-white hover:bg-gray-300 rounded flex-shrink-0">
              <BsFillSendFill size={23} color='#000' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
