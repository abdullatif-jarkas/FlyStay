import { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';
import { toast } from 'sonner';

export interface UserData {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  profile_image?: string;
  // Add other user properties as needed
}

export const useUser = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const response = await getCurrentUser();
      const userData = response.data.data[0];
      setUser(userData);
      
      // Store user data in localStorage for persistence
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return { user, loading, refetchUser: fetchUserData };
};