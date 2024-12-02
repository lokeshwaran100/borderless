"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import axios from "axios";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function RequestModal({ isOpen, onClose, userId }: RequestModalProps) {
  const [amount, setAmount] = useState("");

  const handleSubmit = async (data: any) => {
    try {
      // Fetch receiver's token preference
      const receiverResponse = await axios.get(`/api/users/${data.toAddress}`);
      const receiverToken = receiverResponse.data.recieveToken;

      await axios.post('/api/transactions', {
        fromAddress: data.toAddress, // The person who will pay
        toAddress: userId, // The person requesting
        amount: data.amount,
        fee: 0, // Calculate fee if needed
        dateAndTime: new Date(),
        message: data.message || "Payment request",
        sendToken: "TBD", // Will be selected by payer
        receiveToken: receiverToken,
        type: "request",
        status: "pending"
      });
      onClose();
    } catch (error) {
      console.error("Failed to create request:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Payment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <DialogFooter>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Request
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
} 