import { api } from "../api/axios";
import type { Statement } from "./statements.types";

export const getStatements = async (): Promise<Statement[]> => {
  const { data } = await api.get("/statements/");
  return data;
};

export const createStatement = async (payload: Statement): Promise<Statement> => {
  const { data } = await api.post("/statements/", payload);
  return data;
};

export const updateStatement = async (
  id: number,
  payload: Statement
): Promise<Statement> => {
  const { data } = await api.put(`/statements/${id}`, payload);
  return data;
};

export const deleteStatement = async (id: number): Promise<void> => {
  await api.delete(`/statements/${id}`);
};
