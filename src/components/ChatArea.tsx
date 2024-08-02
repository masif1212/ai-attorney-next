// ChatArea.tsx

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "@/images/logo/logo-black.png";
import { BsFillSendFill } from "react-icons/bs";
import { CgAttachment } from "react-icons/cg";
import { RiMenu3Fill } from "react-icons/ri";
import { MdOutlineClose, MdOutlineLogout, MdOutlinePayment } from "react-icons/md";
import clsx from "clsx";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { VscSettingsGear } from "react-icons/vsc";
import { FaRegFileImage, FaRegFileAlt } from "react-icons/fa";
import "../styles/custom.css";

interface Chat {
  sender: string;
  text: string;
}

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
  selectedSession: { id: string; name: string; history: Chat[] } | null;
  setChatSessions: React.Dispatch<React.SetStateAction<{ id: string; name: string; history: Chat[] }[]>>;
}> = ({ toggleSidebar, sidebarVisible, selectedSession, setChatSessions }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { isOpen, toggleDropdown, closeDropdown } = useDropdown();

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [apiResponse, setApiResponse] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  console.log("API RESPONSE \n ", chatHistory);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const newFiles = selectedFiles.filter((file) =>
      validTypes.includes(file.type)
    );
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    if (newFiles.length !== selectedFiles.length) {
      setErrorMessage("Please select a valid format (image, PDF, or DOC)");
    }

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
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
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || !selectedSession) return; // Ensure there's a session selected

    // Immediately add the user's message to the chat history
    const newChat: Chat = { sender: "user", text: inputMessage };
    setChatHistory((prevChatHistory) => [...prevChatHistory, newChat]);

    setInputMessage(""); // Clear the input field after sending

    setIsLoading(true); // Start loading

    try {
      const response = await fetch(
        "https://91a9-2407-aa80-314-fe1a-5517-b6d9-648b-6321.ngrok-free.app/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: inputMessage, chat_id: selectedSession.id }), // Ensure chat_id is passed
        }
      );

      const data = await response.json();
      console.log("API response data:", data); // Log the entire response

      if (data && typeof data.response === "string") {
        setApiResponse(formatResponseText(data.response));
        const updatedHistory = [
          ...selectedSession.history,
          { sender: "user", text: inputMessage },
          { sender: "bot", text: data.response },
        ];
        setChatSessions((prevSessions) =>
          prevSessions.map((session) =>
            session.id === selectedSession.id
              ? { ...session, history: updatedHistory }
              : session
          )
        );
        const newResponseChat: Chat = {
          sender: "bot",
          text: data.response,
        };
        setChatHistory((prevChatHistory) => [...prevChatHistory, newResponseChat]);
      } else {
        console.error("Unexpected response format:", data); // Log the problematic response
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Failed to fetch cases:", error);
      setErrorMessage("Failed to load data");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  function formatResponseText(inputMessage: string): string {
    const boldPattern = /\*\*(.*?)\*\*/g;
    const superBoldPattern = /###\s*(.*?)(?=\n|$)/g;
    const dashBeforeHeadingPattern = /-\s*\*\*(.*?)\*\*/g;
    const textToRemove = /undefined/g;

    let urlIndex = 1;
    const formattedText = inputMessage.replace(/(https?:\/\/[^\s]+)/g, (match) => {
      const linkHtml = `<a class="response-link" href="${match}" target="_blank">Link ${urlIndex}</a>`;
      urlIndex++;
      return linkHtml;
    });

    let finalText = formattedText.replace(dashBeforeHeadingPattern, '**$1**');
    finalText = finalText.replace(boldPattern, '<strong>$1</strong>');
    finalText = finalText.replace(superBoldPattern, '<strong><span style="font-weight: 900;">$1</span></strong>');
    finalText = finalText.replace(textToRemove, "");
    finalText = finalText.replace(/\n{2,}/g, "\n\n");
    finalText = finalText.replace(/^\n+|\n+$/g, "");

    return finalText;
  }

  const name = session?.user?.email?.slice(0, 1).toLocaleUpperCase();

  const dropDown = () => (
    <div className="absolute right-0 mt-2 w-40 bg-black border border-gray-900 rounded-md shadow-lg z-10">
      <button className="w-full px-4 py-2 text-sm text-white hover:bg-gray-800 flex items-center border-b border-gray-600 font-thin">
        <MdOutlinePayment size={18} className="mr-2" />
        Plans
      </button>

      <button className="w-full px-4 py-2 text-sm text-white hover:bg-gray-800 flex items-center border-b border-gray-600 font-thin">
        <VscSettingsGear size={18} className="mr-2" />
        Settings
      </button>

      <button
        onClick={handleSignOut}
        className="w-full px-4 py-2 text-sm text-white hover:bg-gray-800 flex items-center font-thin"
      >
        <MdOutlineLogout size={18} className="mr-2" />
        Sign out
      </button>
    </div>
  );

  return (
    <div className="flex-1 bg-white text-black h-screen flex flex-col relative">
      <div className="flex justify-between items-center p-3">
        {!sidebarVisible && (
          <button
            onClick={toggleSidebar}
            className="p-2 bg-white hover:bg-gray-200 rounded"
          >
            <RiMenu3Fill size={23} color="#000" />
          </button>
        )}

        {session && (
          <div className={clsx("relative", sidebarVisible ? "ml-auto" : "")}>
            <button
              className="p-2 flex items-center justify-center rounded-full w-10 h-10 bg-black hover:bg-gray-700 border-2 border-black"
              onClick={toggleDropdown}
            >
              <p className="text-white">{name}</p>
            </button>
            {isOpen && dropDown()}
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="flex justify-center items-center w-full">
          <div className="w-1/4 bg-red-400 text-white text-center p-2 rounded absolute z-10">
            {errorMessage}
          </div>
        </div>
      )}

      <div className="flex-1 w-full flex flex-col justify-center items-center relative overflow-y-auto">
        {!chatHistory.length ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Image src={Logo} alt="Ai-Attorney Logo" width={200} height={200} />
            <h1 className="m-2 rounded font-bold text-3xl md:text-4xl text-center">
              Ai-Attorney
            </h1>
          </div>
        ) : (
          <div className="flex-1 w-full p-5 pr-0 overflow-y-auto" style={{ maxHeight: "84vh" }}>
            <div className="max-w-4xl mx-auto w-full">
              {apiResponse && (
                <div className="mb-4">
                  <h2 className="font-bold">Case Details</h2>
                  <div
                    className="response-text"
                    dangerouslySetInnerHTML={{ __html: apiResponse }}
                  />
                </div>
              )}

              {selectedSession?.history.map((chat, index) => (
                <div
                  key={index}
                  className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"} mt-1 pt-3`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg max-w-2/3 max-w-full text-chattext text-base ${
                      chat.sender === "user" ? "bg-gray-50 border flex justify-end" : "bg-gray-50 border"
                    }`}
                    style={{ width: "auto", maxWidth: "66%", minWidth: "10%" }}
                  >
                    <div className="whitespace-pre-wrap break-words p-2">
                      {chat.sender === "user" ? (
                        chat.text
                      ) : (
                        <div
                          className="response-text"
                          dangerouslySetInnerHTML={{
                            __html: formatResponseText(chat.text),
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {isLoading && (
          <div className="absolute bottom-20 left-0 right-0 flex justify-center items-center">
            <div className="loader"></div>
          </div>
        )}
      </div>

      {previews.length > 0 && (
        <div
          className="absolute w-full max-w-4xl mx-auto border-gray-300 rounded-lg flex overflow-x-auto"
          style={{ top: "auto", bottom: "5rem" }}
        >
          <div className="flex flex-nowrap">
            {previews.map((preview, index) => (
              <div
                key={index}
                className="relative p-2 flex items-center border border-gray-300 rounded-lg bg-gray-100 w-40 mr-2"
              >
                {files[index].type.startsWith("image/") ? (
                  <FaRegFileImage size={30} className="mr-2" />
                ) : (
                  <FaRegFileAlt size={30} className="mr-2" />
                )}
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium truncate">
                    {files[index].name}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    {files[index].type.split("/").pop()?.toUpperCase()}
                  </span>
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
        <div className="flex items-center w-full max-w-4xl bg-white rounded-2xl border border-black p-1 relative mx-5">
          <label className="p-2 bg-white hover:bg-gray-200 rounded flex-shrink-0 cursor-pointer">
            <CgAttachment size={25} color="#000" />
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <div className="flex-grow">
            <input
              type="text"
              placeholder="write here ..."
              className="w-full bg-white outline-none text-gray-900 text-base sm:px-2 md:px-2 lg:px-2"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>
          <button
            className="p-2 bg-white hover:bg-gray-200 rounded flex-shrink-0"
            onClick={handleSend}
          >
            <BsFillSendFill size={23} color="#000" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
