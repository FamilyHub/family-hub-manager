import axios from 'axios';
import { getAuthToken } from '@/utils/auth';

export interface User {
  userId: string;
  name: string;
  familyName: string;
  email: string;
  mobileNumber: string;
  userLevel: string;
  roleTypes: string[];
  customFields: any;
}

const API_BASE_URL = 'http://localhost:8080/api';

export const userService = {
  async getOtherUsers(): Promise<User[]> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/users/except-me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
}; 