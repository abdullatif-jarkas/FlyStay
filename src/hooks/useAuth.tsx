import { useState } from "react";
import { toast } from "sonner";
import {
  login,
  register,
  getGoogleRedirectUrl,
  getCurrentUser,
} from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/userSlice";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await login({ email, password });
      
      toast.success("Login successful!");

      const token = response.data.data.token;
      const role = response.data.data.roles[0];
      
      localStorage.setItem("token", token);

      dispatch(setUser({ role }));
      
      localStorage.setItem("role", role);

      // Fetch user data after successful login
      try {
        const userResponse = await getCurrentUser();
        localStorage.setItem(
          "userData",
          JSON.stringify(userResponse.data.data[0])
        );
      } catch (err) {
        console.error("Error fetching user data after login:", err);
      }

      navigate("/");
      return response.data;
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || "Invalid credentials");
      } else {
        toast.error("An error occurred during login.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (formData: any) => {
    setLoading(true);
    try {
      const response = await register(formData);
      toast.success("Registration successful!");
      const token = response.data.data.token;
      localStorage.setItem("token", token);

      // Fetch user data after successful registration
      try {
        const userResponse = await getCurrentUser();
        localStorage.setItem(
          "userData",
          JSON.stringify(userResponse.data.data)
        );
      } catch (err) {
        console.error("Error fetching user data after registration:", err);
      }

      navigate("/");
      return response.data;
    } catch (error: any) {
      const data = error.response?.data;
      if (data?.message) toast.error(data.message);
      if (data?.errors) {
        Object.values(data.errors)
          .flat()
          .forEach((msg) => toast.error(msg as string));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRedirect = async () => {
    try {
      const res = await getGoogleRedirectUrl();
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Google redirect URL not found.");
      }
    } catch (err) {
      toast.error("Failed to get Google redirect URL.");
    }
  };

  return {
    loading,
    handleLogin,
    handleRegister,
    handleGoogleRedirect,
  };
};
