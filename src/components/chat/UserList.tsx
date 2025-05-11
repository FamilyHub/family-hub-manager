'use client';

import React, { useEffect, useState } from 'react';
import { User, userService } from '../../services/userService';
import Image from 'next/image';

interface UserListProps {
  onSelectUser: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.getOtherUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        setError('Failed to load users');
        console.error(err);
      }
    };

    if (mounted) {
      fetchUsers();
    }
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="rounded-full bg-gray-700 h-12 w-12"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 p-4">{error}</div>;
  }

  return (
    <div className="overflow-y-auto">
      {users.map((user) => (
        <div
          key={user.userId}
          className="p-4 hover:bg-[#2c3544] cursor-pointer transition-colors duration-200"
          onClick={() => onSelectUser(user)}
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 relative">
              <div className="w-12 h-12 rounded-full bg-[#2c3544] flex items-center justify-center overflow-hidden">
                <span className="text-gray-300 font-medium text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1e2632]"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-200 font-medium truncate">
                {user.name}
              </p>
              <p className="text-gray-400 text-sm truncate">
                {user.familyName}
              </p>
            </div>
            {/* Message count indicator */}
            <div className="ml-2">
              <div className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-white text-xs">2</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList; 