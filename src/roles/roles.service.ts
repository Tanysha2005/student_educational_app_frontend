import { api } from "../api/axios";
import type { Role } from "./roles.types";

export const getRoles = async (): Promise<Role[]> => {
  const res = await api.get("/roles/");
  return res.data;
};

export const getRole = async (id: string): Promise<Role> => {
  const res = await api.get(`/roles/${id}`);
  return res.data;
};

export const createRole = async (name: string): Promise<Role> => {
  const res = await api.post("/roles/", { name });
  return res.data;
};

export const updateRole = async (id: string, name: string): Promise<Role> => {
  const res = await api.put(`/roles/${id}`, { name });
  return res.data;
};

export const deleteRole = async (id: string) => {
  await api.delete(`/roles/${id}`);
};
