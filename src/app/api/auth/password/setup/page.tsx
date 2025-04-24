'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authenticatedFetch } from '@/utils/auth';
import { getAuthToken } from '@/utils/auth';

export default function SetupPasswordPage() {
  const router = useRouter();
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setError('Invalid or missing setup token');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch email
        const emailResponse = await fetch('http://localhost:8080/api/token/email', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const emailData = await emailResponse.json();

        // Fetch phone number
        const phoneResponse = await fetch('http://localhost:8080/api/token/phone-number', {
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
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsSubmitting(false);
      return;
    }

    try {
      if (!token) {
        throw new Error('No setup token found');
      }

      const response = await fetch('http://localhost:8080/api/family-member/set-up-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          newPassword: password,
          confirmPassword: confirmPassword
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to setup password');
      }

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setPassword('');
        setConfirmPassword('');
      } else {
        throw new Error(data.message || 'Failed to setup password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToHome = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Set Up Your Password</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 text-red-400 rounded-lg border border-red-800">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-900/30 text-green-400 rounded-lg border border-green-800">
              Password set up successfully!
            </div>
          )}

          <div className="mb-6">
            <p className="text-gray-300 mb-2">Email: {userData.email}</p>
            <p className="text-gray-300">Phone: {userData.phoneNumber}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={8}
              />
            </div>

            {!success ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Setting Up Password...' : 'Set Up Password'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGoToHome}
                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
              >
                Go to Home
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
} 