"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";

interface PayRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
  onPaymentComplete: () => void;
}

export function PayRequestDialog({ isOpen, onClose, transaction, onPaymentComplete }: PayRequestDialogProps) {
  const [senderToken, setSenderToken] = useState("USDC");

  const handlePay = async () => {
    try {
      await axios.put('/api/transactions', {
        id: transaction._id,
        status: "done"
      });
      onPaymentComplete();
      onClose();
    } catch (error) {
      console.error("Failed to process payment:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p>Amount: {transaction?.amount}</p>
            <p>Receiver: {transaction?.toAddress}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Select Token</label>
            <Select value={senderToken} onValueChange={setSenderToken}>
              <SelectTrigger>
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USDC">USDC (Solana)</SelectItem>
                <SelectItem value="USDT">USDT (Solana)</SelectItem>
                <SelectItem value="SOL">Solana</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handlePay}>Pay</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 