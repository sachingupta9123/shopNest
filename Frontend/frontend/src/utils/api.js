export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const authHeaders = () => {
  try {
    
    // Check both possible localStorage keys
    const userData =
      localStorage.getItem('userInfo') ||
      localStorage.getItem('user');

    if (!userData) {
      return {
        'Content-Type': 'application/json',
      };
    }

    const user = JSON.parse(userData);

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
    };
  } catch (error) {
    console.error('Token error:', error);

    return {
      'Content-Type': 'application/json',
    };
  }
};