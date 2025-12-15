import { api } from "../api/axios";

export const login = (login: string, password: string) =>
  api.post("auth/login", { login, password });
