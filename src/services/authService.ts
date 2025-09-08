import axios from "../api/axios";
import { LoginData, RegisterData } from "../types/components/Auth/auth";

export const login = (data: LoginData) => {
  return axios.post("/login", data);
};

export const register = (data: RegisterData) => {
  return axios.post("/register", data);
};

export const getGoogleRedirectUrl = () => {
  return axios.get("/auth/google/redirect");
};

export const resetPassword = (data: {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}) => {
  return axios.post("/reset-password", data);
};

export const getCurrentUser = () => {
  return axios.get("/me");
};
