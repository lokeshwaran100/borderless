"use client";
import { useParams } from 'next/navigation';
import { UserNavbar } from '@/components/ui/UserNavbar';
import { TransactionHistory } from '@/components/TransactionHistory';
import { PaymentModal } from '@/components/PaymentModal';
import { RequestModal } from '@/components/RequestModal';
import { useState } from 'react';

export default function UserPage() {
  const { userId } = useParams();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNavbar userId={userId as string} />
      <div className="max-w-3xl mx-auto p-4">
        <TransactionHistory userId={userId as string} />
        <div className="fixed max-w-3xl mx-auto bottom-0 left-0 right-0 p-4 border-t flex gap-4">
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="px-8 py-2 bg-blue-500 text-white w-full rounded-full hover:bg-blue-600"
          >
            Pay
          </button>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="px-8 py-2 bg-blue-100 text-blue-500 w-full rounded-full hover:bg-blue-200"
          >
            Request
          </button>
        </div>
      </div>
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)}
        userId={userId as string}
      />
      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        userId={userId as string}
      />
    </div>
  );
} 