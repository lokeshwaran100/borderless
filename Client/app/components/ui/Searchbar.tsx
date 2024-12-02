import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  phone: string;
}

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTerm.length > 0) {
        try {
          const response = await fetch('http://localhost:3000/api/users');
          const data = await response.json();
          const filteredUsers = data.filter((user: User) => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.toString().includes(searchTerm)
          );
          setUsers(filteredUsers);
          setShowDropdown(true);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      } else {
        setUsers([]);
        setShowDropdown(false);
      }
    };

    const debounceTimeout = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  const handleUserClick = (userId: string) => {
    router.push(`/pay/${userId}`);
    setShowDropdown(false);
    setSearchTerm('');
  };

  return (
    <div className="relative w-96">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
          placeholder="Search users by name or phone..."
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {showDropdown && users.length > 0 && (
        <div className="absolute w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto z-50">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user._id)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">{user.phone}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}