"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Check } from 'lucide-react';

interface Transaction {
  _id: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  dateAndTime: string;
  status: string;
  sendToken: string;
}

export function TransactionHistory({ userId }: { userId: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions');
        const allTransactions = await response.json();
        
        // Filter transactions involving the current user and the selected user
        const relevantTransactions = allTransactions.filter((t: Transaction) => 
          (t.fromAddress === session?.user?.email && t.toAddress === userId) ||
          (t.fromAddress === userId && t.toAddress === session?.user?.email)
        );
        
        setTransactions(relevantTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    if (session) {
      fetchTransactions();
    }
  }, [userId, session]);

  return (
    <div className="space-y-4 mb-20">
      {transactions.map((transaction) => {
        const isSender = transaction.fromAddress === session?.user?.email;
        
        return (
          <div
            key={transaction._id}
            className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`rounded-lg p-4 max-w-[80%] ${
              isSender ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">
                  ₹{transaction.amount}
                </span>
                {transaction.status === 'done' && (
                  <Check className="h-4 w-4" />
                )}
              </div>
              <div className="text-sm opacity-80">
                {new Date(transaction.dateAndTime).toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}