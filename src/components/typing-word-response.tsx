import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const MarkdownTypingEffect = ({ text, messageId, speed = 100 }:any) => {
  const [visibleText, setVisibleText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  useEffect(() => {
    const completedMessages = JSON.parse(localStorage.getItem("completedMessages") || "{}");
    if (completedMessages[messageId]) {
      setVisibleText(text);
      return;
    }

    let index = 0;
    const words = text.split(" ");
    const intervalId = setInterval(() => {
      if (index < words?.length) {
        setVisibleText((prev):any => `${prev} ${words[index]}`);
        index++;
      } else {
        clearInterval(intervalId);
        setIsCompleted(true);
        // Save the completed state to localStorage
        completedMessages[messageId] = true;
        localStorage.setItem("completedMessages", JSON.stringify(completedMessages));
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [messageId, text, speed]);

  return <ReactMarkdown>{visibleText}</ReactMarkdown>;
};

export default MarkdownTypingEffect;