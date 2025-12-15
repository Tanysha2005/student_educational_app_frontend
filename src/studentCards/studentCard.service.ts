import { api } from "../api/axios";

export interface StudentShort {
  id_student: number;
  record_book_number: number;
  surname: string;
  otchectvo: string;
  name: string;
}

export interface StudentCardRow {
  surname: string;
  name: string;
  otchectvo: string;
  speciality_name: string;
  group_full: string;
  subject_name: string;
  semester: number;
  attestation_type: string;
  grade: string;
}

export const getStudentsShort = async (): Promise<StudentShort[]> => {
  const res = await api.get("/students/");
  return res.data;
};

export const getStudentCard = async (
  recordBookNumber: number
): Promise<StudentCardRow[]> => {
  const res = await api.get(
    `/reports/student-card/${recordBookNumber}`
  );
  return res.data;
};

export const downloadStudentCardXlsx = async (
  recordBookNumber: number
) => {
  const res = await api.get(
    `/reports/student-card/${recordBookNumber}/xlsx`,
    { responseType: "blob" }
  );

  const url = window.URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = `student-card-${recordBookNumber}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};
