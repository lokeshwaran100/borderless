"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSendMessage: (message: string) => Promise<void>;
}

export default function SearchBar({ onSendMessage }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sendQuery = query;
    setQuery("");

    if (!query.trim()) return;

    await onSendMessage(sendQuery);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pb-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
        <div className="flex gap-3 items-center bg-white rounded-2xl shadow-lg border border-gray-200 p-3 hover:shadow-xl transition-shadow duration-200">
          <Input
            type="text"
            placeholder="Type your message..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-base"
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
