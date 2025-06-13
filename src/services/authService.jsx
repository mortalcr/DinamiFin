import axios from "axios";

const API_URL = "http://localhost:8000";

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const register = async (formData) => {
  const response = await axios.post(`${API_URL}/register`, formData);
  return response.data;
};

export const getDashboard = async (token) => {
  const response = await axios.get(`${API_URL}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

