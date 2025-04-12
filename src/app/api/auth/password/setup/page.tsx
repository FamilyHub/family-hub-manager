'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { authenticatedFetch } from '@/utils/auth';

export default function SetupPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [userData, setUserData] = useState({
    email: 'Data not available',
    phoneNumber: 'Data not available'
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setError('Invalid or missing setup token');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch email
        const emailResponse = await fetch('http://localhost:8080/api/token/emaill', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const emailData = await emailResponse.json();

        // Fetch phone number
        const phoneResponse = await fetch('http://localhost:8080/api/token/phone-numberl', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const phoneData = await phoneResponse.json();

        setUserData({
          email: emailData.email || 'Data not available',
          phoneNumber: phoneData.phoneNumber || 'Data not available'
        });
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user information');
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      const response = await fetch('http://localhost:3030/api/auth/password/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: password
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to setup password');
      }

      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to setup password. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading user information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-md w-full p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
            <p className="text-gray-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-extrabold text-white">
            Setup Your Password
          </h2>
          <p className="mt-2 text-gray-300">
            Please set a new password for your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-2xl shadow-sm space-y-6 bg-white/10 backdrop-blur-lg p-6 border border-white/20">
            {/* Email Field (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="mt-1 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300">
                {userData.email}
              </div>
            </div>

            {/* Phone Number Field (Read-only) */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300">
                Phone Number
              </label>
              <div className="mt-1 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300">
                {userData.phoneNumber}
              </div>
            </div>

            {/* New Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your new password"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm your new password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/30 p-3 rounded-lg border border-red-800">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-400 text-sm text-center bg-green-900/30 p-3 rounded-lg border border-green-800">
              Password has been set up successfully!
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Setup Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 