'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getAuthToken } from '@/utils/auth';
import Modal from '../common/Modal';

interface AddNewMemberFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  roles: string[];
  userLevel: string;
}

export default function AddNewMemberForm({ isOpen, onClose }: AddNewMemberFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    roles: [],
    userLevel: 'SON'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        roles: [],
        userLevel: 'SON'
      });
      setError('');
      setSuccess(false);
      setIsSubmitting(false);
      setParentId(null);
      setHasInteracted(false);
      setFetchError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchParentId = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:8080/api/token/user-id', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          console.error('API Response not OK:', response.status, response.statusText);
          throw new Error('Failed to fetch user ID');
        }

        // Get the response as text since it's a plain string
        const userId = await response.text();
        console.log('API Response (User ID):', userId);
        
        if (!userId || userId.trim() === '') {
          throw new Error('No user ID received');
        }

        setParentId(userId.trim());
        setFetchError(null);
      } catch (err) {
        console.error('Error in fetchParentId:', err);
        setFetchError('Failed to fetch user information');
      }
    };

    if (isOpen) {
      fetchParentId();
    }
  }, [isOpen]);

  const handleRoleChange = (role: string) => {
    setHasInteracted(true);
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setHasInteracted(true);
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasInteracted(true);
    setError('');
    setSuccess(false);
    setIsSubmitting(true);

    // Validate form
    if (!formData.name || !formData.email || !formData.phoneNumber || formData.roles.length === 0) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    if (!parentId) {
      setError('Unable to determine parent user');
      setIsSubmitting(false);
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:8080/api/family-member/add-new-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: uuidv4(),
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          roles: formData.roles.map(role => `ROLE_${role}`),
          userLevel: formData.userLevel,
          parentId: parentId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add new member');
      }

      const data = await response.json();
      setSuccess(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add new member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Member">
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter full name"
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter email address"
          />
        </div>

        {/* Phone Number Field */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter phone number"
          />
        </div>

        {/* Roles Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Roles
          </label>
          <div className="space-y-2">
            {['USER', 'ADMIN'].map((role) => (
              <label key={role} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.roles.includes(role)}
                  onChange={() => handleRoleChange(role)}
                  className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-300">{role}</span>
              </label>
            ))}
          </div>
        </div>

        {/* User Level Field */}
        <div>
          <label htmlFor="userLevel" className="block text-sm font-medium text-gray-300">
            User Level
          </label>
          <select
            id="userLevel"
            name="userLevel"
            value={formData.userLevel}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ADMIN">Admin</option>
            <option value="GRANDMOTHER">Grandmother</option>
            <option value="GRANDFATHER">Grandfather</option>
            <option value="SON">Son</option>
            <option value="DAUGHTER">Daughter</option>
            <option value="BROTHER">Brother</option>
            <option value="SISTER">Sister</option>
          </select>
        </div>

        {/* Error Message */}
        {error && hasInteracted && (
          <div className="rounded-lg bg-red-900/30 p-3 text-sm text-red-400 border border-red-800">
            {error}
          </div>
        )}

        {/* Fetch Error Message */}
        {fetchError && (
          <div className="rounded-lg bg-red-900/30 p-3 text-sm text-red-400 border border-red-800">
            {fetchError}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="rounded-lg bg-green-900/30 p-3 text-sm text-green-400 border border-green-800">
            Member added successfully!
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || !parentId}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:cursor-pointer"
          >
            {isSubmitting ? 'Adding Member...' : 'Add Member'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 