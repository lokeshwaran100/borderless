"use client";
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function PaymentModal({ isOpen, onClose, userId }: PaymentModalProps) {
  const [blockchain, setBlockchain] = useState('Ethereum');
  const [amount, setAmount] = useState('');
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAddress: session?.user?.email,
          toAddress: userId,
          amount: parseFloat(amount),
          sendToken: 'USDC',
          receiveToken: 'USDC',
          dateAndTime: new Date(),
          status: 'pending',
          fee: 0,
          message: `Payment of ${amount} USDC`,
        }),
      });

      if (response.ok) {
        onClose();
        // Optionally refresh the transaction history
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Blockchain</label>
            <Select
              value={blockchain}
              onValueChange={setBlockchain}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select blockchain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ethereum">Ethereum</SelectItem>
                <SelectItem value="Solana">Solana</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount (USDC)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter amount"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Send Payment
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 