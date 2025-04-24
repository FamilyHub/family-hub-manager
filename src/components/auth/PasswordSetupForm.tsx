'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/utils/auth';
import Modal from '../common/Modal';

interface PasswordSetupFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordSetupForm({ isOpen, onClose }: PasswordSetupFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsSubmitting(true);

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:8080/api/family-member/set-up-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        })
      });

      if (!response.ok) {
        throw new Error('Failed to set up password');
      }

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
      } else {
        throw new Error(data.message || 'Failed to set up password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set up password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToHome = () => {
    router.push('/');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Up Password">
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* New Password Field */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter new password"
            required
          />
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Confirm new password"
            required
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-900/30 p-3 text-sm text-red-400 border border-red-800">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="rounded-lg bg-green-900/30 p-3 text-sm text-green-400 border border-green-800">
            Password set up successfully!
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          {!success ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:cursor-pointer"
            >
              {isSubmitting ? 'Setting Up Password...' : 'Set Up Password'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGoToHome}
              className="w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors hover:cursor-pointer"
            >
              Go to Home
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
} 