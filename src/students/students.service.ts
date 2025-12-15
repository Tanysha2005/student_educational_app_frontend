import { api } from "../api/axios";
import type { StudentForm } from "./Students";

export const getStudents = async (): Promise<StudentForm[]> => {
  const res = await api.get("/students/");
  return res.data;
};

export const createStudent = async (
  data: Omit<StudentForm, "id_student">
): Promise<StudentForm> => {
  const res = await api.post("/students/", data);
  return res.data;
};

export const updateStudent = async (
  id: string,
  data: Omit<StudentForm, "id_student">
): Promise<StudentForm> => {
  const res = await api.put(`/students/${id}`, data);
  return res.data;
};

export const deleteStudent = async (id: string) => {
  await api.delete(`/students/${id}`);
};
