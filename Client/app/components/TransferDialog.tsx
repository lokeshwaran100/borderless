"use client"

import * as React from "react"
import { Send } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TransferDialogProps {
  isOpen: boolean
  onClose: () => void
  contact: {
    name: string
    initial: string
    imageUrl?: string
  }
}

export function TransferDialog({ isOpen, onClose, contact }: TransferDialogProps) {
  const [amount, setAmount] = React.useState("")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-center text-white/90 text-2xl font-semibold">
            Send Money to {contact.name}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-8 py-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-400/80 to-violet-600/80 shadow-lg flex items-center justify-center text-3xl font-semibold text-white border-2 border-white/20">
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
          <div className="w-full space-y-4">
            <div className="relative">
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 text-lg h-14 px-4 rounded-xl focus:ring-2 focus:ring-violet-500/50 transition-all duration-200"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-lg">
                USD
              </span>
            </div>
            <Button 
              className="w-full h-14 bg-gradient-to-r from-violet-400/90 to-violet-600/90 hover:from-violet-500/90 hover:to-violet-700/90 text-white/90 rounded-xl text-lg font-medium shadow-lg hover:shadow-violet-500/25 transition-all duration-200 border border-white/10"
              onClick={() => {
                // Handle transfer logic here
                onClose()
              }}
            >
              <Send className="w-5 h-5 mr-2" />
              Send Money
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

