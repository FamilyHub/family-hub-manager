// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

export const getAuthToken = () => {
  if (!isBrowser) return null;
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string) => {
  if (!isBrowser) return;
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = () => {
  if (!isBrowser) return;
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
};

export const isAuthenticated = () => {
  if (!isBrowser) return false;
  return !!getAuthToken();
};

// Utility function for making authenticated API calls
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  if (!isBrowser) {
    throw new Error('Cannot make authenticated fetch on server side');
  }

  const token = getAuthToken();
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    // Token might be expired
    removeAuthToken();
    window.location.href = '/login';
    throw new Error('Authentication expired');
  }

  return response;
};

export const getUserLevel = async (): Promise<string> => {
  if (!isBrowser) return 'USER';

  try {
    const token = getAuthToken();
    if (!token) {
      console.log('No token found, returning USER');
      return 'USER';
    }

    const response = await fetch('http://localhost:8080/api/token/user-level', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log('Response not ok:', response.status);
      throw new Error('Failed to fetch user level');
    }

    // Get the response as text instead of JSON
    const level = await response.text();
    console.log('API Response:', level);
    
    return level || 'USER';
  } catch (error) {
    console.error('Error fetching user level:', error);
    return 'USER';
  }
}; 