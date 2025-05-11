import axios from 'axios';
import { getAuthToken } from '@/utils/auth';

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  reactions?: { emoji: string; count: number }[];
}

const API_BASE_URL = 'http://localhost:8085/api';

export const chatService = {
  async getMessageHistory(userId: string, options: { limit?: number, beforeTimestamp?: string, afterTimestamp?: string } = {}): Promise<{
    messages: ChatMessage[];
    nextCursor?: string;
    previousCursor?: string;
    hasMore?: boolean;
    hasPrevious?: boolean;
    totalMessages?: number;
  }> {
    const token = getAuthToken();
    console.log('Token being used for API call:', token);
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const params = new URLSearchParams();
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.beforeTimestamp) params.append('beforeTimestamp', options.beforeTimestamp);
      if (options.afterTimestamp) params.append('afterTimestamp', options.afterTimestamp);

      // Configure axios defaults for this request
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        withCredentials: true
      };

      const response = await axios.get(
        `${API_BASE_URL}/chat/enhanced-history/${userId}?${params}`,
        config
      );

      return {
        messages: response.data.messages,
        nextCursor: response.data.nextCursor,
        previousCursor: response.data.previousCursor,
        hasMore: response.data.hasMore,
        hasPrevious: response.data.hasPrevious,
        totalMessages: response.data.totalMessages
      };
    } catch (error) {
      console.error('Error fetching enhanced message history:', error);
      throw error;
    }
  },

  async sendMessage(receiverId: string, content: string): Promise<ChatMessage> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/chat/send`,
        { receiverId, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async addReaction(messageId: string, emoji: string): Promise<void> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      await axios.post(
        `${API_BASE_URL}/chat/reaction`,
        { messageId, emoji },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  },

  async deleteMessage(messageId: string, deleteForEveryone: boolean = false): Promise<void> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/chat/message/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            deleteForEveryone
          }
        }
      );
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
}; 