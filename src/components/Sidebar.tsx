"use client";
import React from 'react';
import { RiMenu2Line } from "react-icons/ri";
import { MdOutlineAddComment } from "react-icons/md";
import ButtonForBlackScreen from './ButtonForBlackScreen';
import '../styles/custom.css'; // Import the custom CSS file

const Sidebar = ({ sidebarVisible, toggleSidebar, chatSessions, onSessionSelect, createNewSession }: { sidebarVisible: boolean, toggleSidebar: () => void, chatSessions: { id: string, name: string, history: { text: string, details: string }[] }[], onSessionSelect: (sessionId: string) => void, createNewSession: () => void }) => {
  if (!sidebarVisible) {
    return null;
  }

  return (
    <div className="w-60 h-screen text-white flex flex-col py-3 px-3 border-black border-2 bg-black">
      <div className='flex flex-row justify-between font-bold'>
        <ButtonForBlackScreen onClick={toggleSidebar}>
          <RiMenu2Line size={23} color='#faf5f5' />
        </ButtonForBlackScreen>
        <ButtonForBlackScreen onClick={createNewSession}>
          <MdOutlineAddComment size={25} color='#faf5f5' />
        </ButtonForBlackScreen>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {chatSessions.length > 0 && (
          <div className='mt-5'>
            <div className="text-sm mb-2 font-bold">Chat Sessions</div>
            <ul className="space-y-2">
              {chatSessions.map(session => (
                <li key={session.id} className='hover:bg-gray-900 rounded px-1 mr-1'>
                  <button onClick={() => onSessionSelect(session.id)} className="flex justify-between text-sm text-gray-400 rounded">
                    <span className="truncate">{session.name}</span>
                  </button>
                  <ul className="mt-1">
                    {session.history.map((chat, index) => (
                      <li key={index} className="text-gray-400 hover:text-white cursor-pointer" onClick={() => onSessionSelect(session.id)}>
                        <span className="truncate">{chat.text}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
