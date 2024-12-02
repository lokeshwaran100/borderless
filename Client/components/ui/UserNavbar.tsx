"use client";
import { useEffect, useState } from 'react';
import { ChevronLeft, Phone, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from './avatar';

interface User {
  _id: string;
  name: string;
  phone: string;
  oktoId: string;
}

export function UserNavbar({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) return null;

  return (
    <div className="bg-gray-900 text-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-800 rounded-full"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-blue-500">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="text-lg font-semibold">{user.name}</h1>
            <p className="text-sm text-gray-400">{user.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}