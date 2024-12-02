"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Transaction {
  _id: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  dateAndTime: string;
  sendToken: string;
  receiveToken: string;
}

interface Contact {
  userId: string;
  name: string;
  lastTransaction: Transaction;
  totalTransactions: number;
}

export function RecentContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchRecentContacts = async () => {
      try {
        // Fetch all transactions
        const transactionsResponse = await fetch('/api/transactions');
        const transactions = await transactionsResponse.json();

        // Get unique addresses that the user has interacted with
        const uniqueContacts = new Map<string, Transaction[]>();
        
        transactions.forEach((transaction: Transaction) => {
          // Assuming the current user's address is stored somewhere in the session
          const isReceiver = transaction.toAddress === session?.user?.email;
          const contactAddress = isReceiver ? transaction.fromAddress : transaction.toAddress;
          
          if (!uniqueContacts.has(contactAddress)) {
            uniqueContacts.set(contactAddress, []);
          }
          uniqueContacts.get(contactAddress)?.push(transaction);
        });

        // Fetch user details for each contact
        const contactsData = await Promise.all(
          Array.from(uniqueContacts.entries()).map(async ([address, transactions]) => {
            // Fetch user details from your users API
            const userResponse = await fetch(`/api/users?address=${address}`);
            const userData = await userResponse.json();
            console.log("userData from api", userData);
            return {
              userId: userData._id,
              name: userData.name || 'Unknown User',
              lastTransaction: transactions[0], // Most recent transaction
              totalTransactions: transactions.length
            };
          })
        );
        console.log("conntactData", contactsData);
        setContacts(contactsData.slice(0, 5)); // Show only top 5 recent contacts

      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    if (session) {
      fetchRecentContacts();
    }
  }, [session]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleContactClick = (userId: string) => {
    router.push(`/user/${userId}`);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Recent Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact.userId}
              onClick={() => handleContactClick(contact.userId)}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10">
                  {getInitials(contact.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {contact.name}
                </p>
                <p className="text-sm text-gray-500">
                  Last transaction: {new Date(contact.lastTransaction.dateAndTime).toLocaleDateString()}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {contact.totalTransactions} transactions
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 