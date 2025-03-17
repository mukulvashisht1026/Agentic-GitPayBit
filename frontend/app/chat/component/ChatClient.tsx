"use client";

import { useAIResponse } from "@/app/context/dynamicAIContentContext";
import { useSession } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";


// API URLs
// const primaryApiUrl = "http://localhost:3001/chat";
const primaryApiUrl = (process.env.NEXT_PUBLIC_API_URL_BACKEND || "https://gitbit-9138f8eb30be.herokuapp.com") + "/chat";
const fallbackApiUrl = "https://autonome.alt.technology/test-njlolw/chat";
const fallbackApiAuth = "Basic dGVzdDpYVUxaQWlHR3B0";

// 
// const apiUrl = process.env.NEXT_PUBLIC_API_URL_BACKEND || "https://gitbit-9138f8eb30be.herokuapp.com";
// const response = await fetch(`${apiUrl}/get-code?message=${encodeURIComponent(message)}`);

// Message Type
type Message = {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
};

// API call to the primary chat server
const callPrimaryApi = async (message: string, threadId?: string) => {
  try {
    const url = threadId ? `${primaryApiUrl}/${threadId}` : primaryApiUrl;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) throw new Error("Primary API call failed");
    const data = await response.json();

    if (!threadId && data.threadId) {
      return { data, threadId: data.threadId };
    }

    return { data, threadId };
  } catch (error) {
    console.error("Primary API error:", error);
    return { data: null, threadId };
  }
};

// API call to the fallback chat server
const callFallbackApi = async (message: string) => {
  try {
    const response = await fetch(fallbackApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: fallbackApiAuth,
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) throw new Error("Fallback API call failed");
    const data = await response.json();
    return data.response[0];
  } catch (error) {
    console.error("Fallback API error:", error);
    return "Sorry, I couldn't process your message. Please try again.";
  }
};

const ChatClient = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [sender, setSender] = useState("User");
  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isClicked, setIsClicked] = useState(true);
  const { data: session } = useSession();
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const { setAiResponse } = useAIResponse();

  // Send message function
  const sendMessage = async () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: new Date().toISOString(),
        text: messageInput,
        sender,
        timestamp: new Date().toISOString(),
      };
      setSender(sender);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessageInput("");

      const { data: primaryApiResponse, threadId: newThreadId } = await callPrimaryApi(messageInput, threadId);

      if (newThreadId && !threadId) {
        setThreadId(newThreadId);
      }

      if (primaryApiResponse) {
        const responseMessage: Message = {
          id: new Date().toISOString(),
          text: primaryApiResponse.response,
          sender: "Bot",
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, responseMessage]);
      } else {
        const fallbackMessage = await callFallbackApi(messageInput);
        const responseMessage: Message = {
          id: new Date().toISOString(),
          text: fallbackMessage,
          sender: "Bot",
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, responseMessage]);
      }
      setAiResponse(primaryApiResponse.response);
    }
    setIsClicked(true)
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      setIsClicked(!isClicked)
      e.preventDefault();
      sendMessage(); // Call sendMessage when Enter is pressed
    }
  };

  return (
  <>
  {session ? ( <div className="flex flex-col h-full bg-black">
      <div className="flex-1 h-[70vh] p-4 overflow-y-auto bg-black">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex w-full ${message.sender === sender ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-lg max-w-[75%] break-words text-white border border-b-8 border-r-8 rounded-lg border-yellow-400 bg-gray-900 hover:bg-blue-900 hover:border-yellow-100 ${message.sender === sender ? "self-end" : "self-start"}`}>
                <p className="font-semibold text-sm">{message.sender}</p>
                <ReactMarkdown
                  className="markdown-content"
                  components={{
                    a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                  }}
                >
                  {message.text}
                </ReactMarkdown>
                <span className="text-xs text-gray-400">{new Date(message.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 bg-black border rounded-lg">
        <div className="flex gap-2">
          <textarea
            className="w-full p-2 border bg-black rounded-lg focus:outline-none resize-none h-16 text-white"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Shift+Enter for new line)"

          />
          <button 
          // onClick={sendMessage} 
          disabled={!isClicked}
          onClick={() => {
            setIsClicked(!isClicked)
            sendMessage()
          }}
          
       className={`bg-red-900 text-white  mr-5 rounded-md transition border-yellow-200 px-6 py-[12px] hover:bg-gray-900 hover:border-[3px]
       ${isClicked ? " border border-b-[5px] border-r-[5px] " : "bg-gray-900   border-[3px]"}`}
          // className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>):(<><div className="flex flex-col h-full bg-black w-full justify-center text-center font-bold text-white">
      
      
      Sign-in to continue...
      
      </div></>)}
   </>
   )
};

export default ChatClient;