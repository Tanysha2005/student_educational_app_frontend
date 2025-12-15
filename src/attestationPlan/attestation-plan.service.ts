import { api } from "../api/axios";

export interface AttestationPlanRow {
    subject_name: string;
    attestation_type: string;
}

export const getAttestationPlan = async (
    id_speciality: number,
    semester: number
): Promise<AttestationPlanRow[]> => {
    const res = await api.get("/reports/attestation-plan/", {
        params: { id_speciality, semester },
    });
    return res.data;
};

export const downloadAttestationPlanXlsx = async (
    id_speciality: number,
    semester: number
) => {
    const res = await api.get("/reports/attestation-plan/xlsx", {
        params: { id_speciality, semester },
        responseType: "blob",
    });

    const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `attestation-plan-${id_speciality}-sem${semester}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
};
