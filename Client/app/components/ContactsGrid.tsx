"use client";

import { useState } from "react";
import { TransferDialog } from "./TransferDialog";

interface Contact {
  id: string;
  name: string;
  initial: string;
  imageUrl?: string;
}

const contacts: Contact[] = [
  { id: "1", name: "Robert Tay", initial: "R" },
  { id: "2", name: "Sarah", initial: "S" },
  { id: "3", name: "Gabriel", initial: "G" },
  { id: "4", name: "Isabella", initial: "I" },
  { id: "5", name: "Daniel", initial: "D" },
  { id: "6", name: "Thomas", initial: "T" },
  { id: "7", name: "Alice", initial: "A" },
  { id: "8", name: "More", initial: "+" },
];

export default function ContactsGrid() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Quick Transfer
        </h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-6 justify-items-center">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              className="flex flex-col items-center space-y-2 group transition-transform duration-200 hover:scale-105"
              onClick={() => setSelectedContact(contact)}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-100 to-violet-200 shadow-md flex items-center justify-center text-lg font-semibold text-gray-700 group-hover:shadow-lg transition-shadow duration-200">
                {contact.imageUrl ? (
                  <img
                    src={contact.imageUrl}
                    alt={contact.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  contact.initial
                )}
              </div>
              <span className="text-sm text-gray-700 font-medium">
                {contact.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedContact && (
        <TransferDialog
          isOpen={!!selectedContact}
          onClose={() => setSelectedContact(null)}
          contact={selectedContact}
        />
      )}
    </>
  );
}
