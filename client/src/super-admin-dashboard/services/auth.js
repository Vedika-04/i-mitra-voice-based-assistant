import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

export const authService = {
  login: async (credentials) => {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      credentials,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  },

  logout: async () => {
    const response = await axios.get(`${API_BASE_URL}/auth/logout`, {
      withCredentials: true,
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      withCredentials: true,
    });
    return response.data;
  },
};
