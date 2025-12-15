import { api } from "../api/axios";

export const login = async (login: string, password: string) => {
  const res = await api.post("auth/login", { login, password });

  sessionStorage.setItem("access_token", res.data.access_token);
  localStorage.setItem("refresh_token", res.data.refresh_token);

  return res.data;
};

export const isAuthenticated = (): boolean => {
  return Boolean(localStorage.getItem("access_token"));
};

export const logout = () => {
  sessionStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
};