import { api } from "../api/axios";
import type { Speciality } from "./speciality.types";

export const getSpecialities = async (): Promise<Speciality[]> => {
  const res = await api.get("/speciality/");
  return res.data;
};

export const createSpeciality = async (speciality_name: string): Promise<Speciality> => {
  const res = await api.post("/speciality/", {speciality_name });
  return res.data;
};

export const updateSpeciality = async (id_speciality: number, speciality_name: string): Promise<Speciality> => {
  const res = await api.put(`/speciality/${id_speciality}`, { speciality_name });
  return res.data;
};

export const deleteSpeciality = async (id_speciality: number) => {
  await api.delete(`/speciality/${id_speciality}`);
};
