'use client';
import React from 'react';
import { format } from 'date-fns';
import { RiMenu2Line } from "react-icons/ri";
import { MdOutlineAddComment } from "react-icons/md";
import ButtonForBlackScreen from './ButtonForBlackScreen';
import '../styles/custom.css'; // Import the custom CSS file

const chatItems = [
  { text: 'New chat', date: '2024-07-30' },
  { text: 'Modal Message Centering', date: '2024-07-30' },
  { text: 'Dropdown Positioning Fix', date: '2024-07-30' },
  { text: 'Migrate Branch to Main', date: '2024-07-30' },
  { text: 'Migrate Branch to Main', date: '2024-07-30' },
  { text: 'Header Responsive Design', date: '2024-07-25' },
  { text: 'Dropdown Cutoff Issue', date: '2024-07-25' },
  { text: 'Calendly 15-Minute Setup', date: '2024-07-25' },
  { text: 'FormData Type Handling', date: '2024-07-21' },
  { text: 'Dropdown Positioning Fix', date: '2024-07-21' },
  { text: 'Creating Logo in Figma', date: '2024-07-20' },
  { text: 'Dynamic Dropdown Menu Positioning', date: '2024-07-20' },
  { text: 'Reset MySQL Root Password', date: '2024-07-19' },
  { text: 'Dynamic Dropdown Menu Positioning Fix', date: '2024-07-19' },
  { text: 'GitHub Connection Issues', date: '2024-07-18' },
  { text: 'Modal Message Centering', date: '2024-07-18' },
  { text: 'Migrate Branch to Main', date: '2024-07-17' },
  { text: 'Dynamic Dropdown Menu Positioning', date: '2024-07-20' },
  { text: 'Reset MySQL Root Password', date: '2024-07-19' },
  { text: 'Dynamic Dropdown Menu Positioning Fix', date: '2024-07-19' },
  { text: 'GitHub Connection Issues', date: '2024-07-18' },
  { text: 'Modal Message Centering', date: '2024-07-18' },
  { text: 'Migrate Branch to Main', date: '2024-07-17' },
  { text: 'Migrate Branch to Main', date: '2024-07-17' },
  { text: 'Migrate Branch to Main', date: '2024-07-17' },
];

const Sidebar = ({ sidebarVisible, toggleSidebar, onChatSelect }: { toggleSidebar: () => void, sidebarVisible: boolean, onChatSelect: (chatText: string) => void }) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todaysChats = chatItems.filter(item => item.date === today);
  const previousChats = chatItems.filter(item => item.date !== today);

  if (!sidebarVisible) {
    return null; 
  }

  return (
    <div className="w-60 h-screen text-white flex flex-col py-3 px-3 border-black border-2 bg-black">

      <div className='flex flex-row justify-between font-bold'>
       
        <ButtonForBlackScreen onClick={toggleSidebar}>
          <RiMenu2Line   size={23} color='#faf5f5' />
        </ButtonForBlackScreen>

        <ButtonForBlackScreen>
          <MdOutlineAddComment  size={25} color='#faf5f5' />
        </ButtonForBlackScreen>

      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {todaysChats.length > 0 && (
          <div className='mt-5'>
            <div className="text-sm mb-2 font-bold">Today</div>
            <ul className="space-y-2">
              {todaysChats.map((item, index) => (
                <li key={index} className='hover:bg-gray-900 rounded px-1 mr-1'>
                  <button onClick={() => onChatSelect(item.text)} className="flex justify-between text-sm text-gray-400  rounded">
                    <span className="truncate">{item.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {previousChats.length > 0 && (
          <div className="mt-5">
            <div className="text-sm mb-2 font-bold">Previous Day</div>
            <ul className="space-y-2">
              {previousChats.map((item, index) => (
                <li key={index} className=' hover:bg-gray-900 rounded px-1 mr-1'>
                  <button onClick={() => onChatSelect(item.text)} className="flex justify-between text-sm text-gray-400 ">
                    <span className="truncate">{item.text}</span>
                  </button>
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
