import { api } from "../api/axios";
import type { Curriculum } from "./curriculums.types";

export async function getCurriculums(): Promise<Curriculum[]> {
  const { data } = await api.get<Curriculum[]>("/curriculums/");
  return data;
}

export async function createCurriculum(payload: Curriculum): Promise<Curriculum> {
  const { data } = await api.post<Curriculum>("/curriculums/", payload);
  return data;
}

export async function updateCurriculum(
  id: number,
  payload: Curriculum
): Promise<Curriculum> {
  const { data } = await api.put<Curriculum>(`/curriculums/${id}`, payload);
  return data;
}

export async function deleteCurriculum(id: number): Promise<void> {
  await api.delete(`/curriculums/${id}`);
}

export interface SchoolPlanRow {
  subject_name: string;
  semester: number;
  hours_amount: number;
  attestation_type: string;
}

export const getSchoolPlan = async (
  id_speciality: number,
  start_year: number
): Promise<SchoolPlanRow[]> => {
  const res = await api.get("/reports/school-plan", {
    params: { id_speciality, start_year },
  });
  return res.data;
};

export const downloadSchoolPlanXlsx = async (
  id_speciality: number,
  start_year: number
) => {
  const res = await api.get("/reports/school-plan/xlsx", {
    params: { id_speciality, start_year },
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = `school-plan-${id_speciality}-${start_year}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};
