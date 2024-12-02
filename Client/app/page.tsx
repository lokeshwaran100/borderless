"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { LoginButton } from "./components/LoginButton";
import { useOkto, OktoContextType, BuildType } from "okto-sdk-react";
import GetButton from "./components/GetButton";
import TransferTokens from "./components/TransferTokens";
import { useAppContext } from "./components/AppContext";
import AuthButton from "./components/AuthButton";
import SendRawTransaction from "./components/SendRawTransaction";
import { RecentContacts } from './components/RecentTransactions';
import Navbar from "./components/ui/Navbar";
import SearchBar from "./components/SearchBar";
import ContactsGrid from "./components/ContactsGrid";

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
};

export default function Home() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);

  const callChat = async (messageToSend: string) => {
    try {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: messageToSend, sender: "user" },
      ]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!data.success) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: data.fullResponse.choices[0].message.content,
          sender: "ai",
        },
      ]);

      if (data.parsedJson) {
        console.log("Parsed JSON:", data.parsedJson);
      }
    } catch (error) {
      console.error("Error in callChat:", error);
      // Optionally add error handling UI here
    }
  };

  return (
    <>
    <Navbar/>
      
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-violet-50/90 via-violet-100/80 to-violet-200/90 backdrop-blur-sm">
      <main className="flex-1">
        <div className="h-full p-12">
        {session && <RecentContacts />}

          {/* Messages display */}
          <div className="max-w-4xl mx-auto space-y-4 mb-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-violet-500/90 text-white ml-auto max-w-[80%]"
                    : "bg-white/10 backdrop-blur-md border border-white/20 max-w-[80%]"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
        </div>
      </main>
      <SearchBar onSendMessage={callChat} />
    </div>
    </>
  );
}
