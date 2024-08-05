"use client";
import React from "react";
import { RiMenu2Line } from "react-icons/ri";
import { MdOutlineAddComment } from "react-icons/md";
import ButtonForBlackScreen from "./ButtonForBlackScreen";
import "../styles/custom.css"; // Import the custom CSS file

interface Chat {
  sender: string;
  text: string;
}

interface SidebarProps {
  sidebarVisible: boolean;
  toggleSidebar: () => void;
  chatSessions: { id: string; name: string; history: Chat[] }[];
  onSessionSelect: (sessionId: string) => void;
  createNewSession: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarVisible,
  toggleSidebar,
  chatSessions,
  onSessionSelect,
  createNewSession,
}) => {
  if (!sidebarVisible) {
    return null;
  }


  console.log("Hello Session : " , chatSessions)

  return (
    <div className="w-60 h-screen text-white flex flex-col py-3 px-3 border-black border-2 bg-black">
      <div className="flex flex-row justify-between font-bold">
        <ButtonForBlackScreen onClick={toggleSidebar}>
          <RiMenu2Line size={25} color="#faf5f5" />
        </ButtonForBlackScreen>
        <ButtonForBlackScreen onClick={createNewSession}>
          <MdOutlineAddComment size={25} color="#faf5f5" />
        </ButtonForBlackScreen>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {chatSessions.length > 0 && (
          <div className="mt-5">
            <div className="text-sm mb-2 font-bold">Chat Sessions</div>
            <ul className="space-y-2">
              {chatSessions.map((session) => (
                <li key={session.id} className="hover:bg-gray-900 rounded px-1 mr-1">
                  <button
                    onClick={() => onSessionSelect(session.id)}
                    className="flex justify-between text-sm text-gray-400 rounded"
                  >
                    <span className="truncate">
                      {session.history.length > 0 ? session.history[0].text : session.name}
                    </span>
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
