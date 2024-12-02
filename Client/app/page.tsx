"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import { LoginButton } from "./components/LoginButton";
import GetButton from "./components/GetButton";
import TransferTokens from "./components/TransferTokens";
import { useAppContext } from "./components/AppContext";
import AuthButton from "./components/AuthButton";
import SendRawTransaction from "./components/SendRawTransaction";
import { RecentContacts } from './components/RecentTransactions';
import Navbar from "./components/ui/Navbar";
import SearchBar from "./components/SearchBar";
import ContactsGrid from "./components/ContactsGrid";
import { useAuthStore } from "../store/store";

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
};

export default function Home() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const idToken = useMemo(() => (session?.id_token || null), [session]);
  const setAuthToken = useAuthStore((state) => state.setAuthToken);

  useEffect(() => {
    const fetchAuthorization = async () => {
      if (session) {
        console.log(idToken);

        try {
          const response = await fetch("https://sandbox-api.okto.tech/api/v2/authenticate", {
            method: 'POST',
            headers: {
              "X-Api-Key": "e9ff25cc-46f3-4d3b-a37e-991558acf41c" || '',
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id_token: idToken,
            }),
          });

          const data = await response.json();
          console.log("Authorization Response:", data);
          setAuthToken(data.data.auth_token);

        } catch (error) {
          console.error("Error during authorization:", error);
        }
      }
    };

    fetchAuthorization();
  }, [session, idToken]);

  const callChat = async (messageToSend: string) => {
    try {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: messageToSend, sender: "user" },
      ]);

      const response2 = await fetch("/api/check-name-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data2 = await response2.json();
      console.log("RES ", data2);
      const name = data2.parsedJson.name;


      let updatedMessage = "";

      if (name) {
        const address = "0x2b089f3dd0831077446a78a4c6632a14f72690d2"; // call db function to get address
        const response = await fetch("/api/switch-name-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: messageToSend, address }),
        });

        const data = await response.json();
        console.log("Name replacement response:", data);
        
        if (data.success && data.parsedJson && data.parsedJson.updatedMessage) {
          updatedMessage = data.parsedJson.updatedMessage;
        } else {
          console.error("Name replacement failed:", data.error);
          updatedMessage = messageToSend; // fallback to original message
        }
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: updatedMessage || messageToSend }),
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
      <Navbar />
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