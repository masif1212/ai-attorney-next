"use client"

import React from "react";
import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';


const WordByWordTypingEffect = ({ text, id, speed = 50 }: { text: string; id: string; speed?: number }) => {
  const [visibleText, setVisibleText] = useState('');

  useEffect(() => {
    const chatMsgIds = JSON.parse(localStorage.getItem("chatMsgIds") || "{}");

    if (chatMsgIds[id]) {
      setVisibleText(text);
      return;
    }

    let index = 0;
    const words = text.split(" ");
    const intervalId = setInterval(() => {
      if (index < words.length) {
        setVisibleText((prev) => (prev ? `${prev} ${words[index]}` : words[index]));
        index++;
      } else {
        clearInterval(intervalId);

        chatMsgIds[id] = true;
        localStorage.setItem("chatMsgIds", JSON.stringify(chatMsgIds));
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, id, speed]);

  return <ReactMarkdown>{visibleText}</ReactMarkdown>
};

export default WordByWordTypingEffect;
