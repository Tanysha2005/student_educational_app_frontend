import axios from "axios";

export const api = axios.create({
  baseURL: "https://studenteducationalapp-production.up.railway.app",
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});