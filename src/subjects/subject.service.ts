import { api } from "../api/axios";
import type { Subject } from "./subject.types";

export const getSubjects = async (): Promise<Subject[]> => {
    const res = await api.get("/subjects/");
    return res.data;
};

export const createSubject = async (data: Subject): Promise<Subject> => {
    const res = await api.post("/subjects/", {
        id_subject: data.id_subject,
        subject_name: data.subject_name,
        hours_amount: data.hours_amount,
        attestation_type: data.attestation_type,
    });
    return res.data;
};

export const updateSubject = async (
    id_subject: number,
    data: Subject
): Promise<Subject> => {
    const res = await api.put(`/subjects/${id_subject}`, {
        id_subject: data.id_subject,
        subject_name: data.subject_name,
        hours_amount: data.hours_amount,
        attestation_type: data.attestation_type,
    });
    return res.data;
};

export const deleteSubject = async (id: number) => {
    await api.delete(`/subjects/${id}`);
};
