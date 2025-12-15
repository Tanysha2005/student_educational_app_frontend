import { useEffect, useState } from "react";
import { getSpecialities } from "../speciality/speciality.service";
import type { Speciality } from "../speciality/speciality.types";

import {
  getAttestationPlan,
  downloadAttestationPlanXlsx,
  type AttestationPlanRow,
} from "./attestation-plan.service";

export default function AttestationPlan() {
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [idSpeciality, setIdSpeciality] = useState<number>(0);
  const [semester, setSemester] = useState<number>(1);
  const [rows, setRows] = useState<AttestationPlanRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSpecialities().then(setSpecialities);
  }, []);

  const load = async () => {
    if (!idSpeciality || !semester) return;

    setLoading(true);
    setRows(await getAttestationPlan(idSpeciality, semester));
    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-4">Аттестационный план</h4>

      <div className="row g-3 align-items-end mb-4">
        <div className="col-md-5">
          <label className="form-label">Специальность</label>
          <select
            className="form-select"
            value={idSpeciality}
            onChange={e => setIdSpeciality(Number(e.target.value))}
          >
            <option value={0}>Выберите специальность</option>
            {specialities.map(s => (
              <option key={s.id_speciality} value={s.id_speciality}>
                {s.id_speciality} - {s.speciality_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label">Семестр</label>
          <input
            type="number"
            className="form-control"
            value={semester}
            onChange={e => setSemester(Number(e.target.value))}
          />
        </div>

        <div className="col-md-2">
          <button
            className="btn btn-primary w-100"
            onClick={load}
            disabled={!idSpeciality}
          >
            Показать
          </button>
        </div>

        {rows.length > 0 && (
          <div className="col-md-3">
            <button
              className="btn btn-success w-100"
              onClick={() =>
                downloadAttestationPlanXlsx(idSpeciality, semester)
              }
            >
              Скачать XLSX
            </button>
          </div>
        )}
      </div>

      {loading && <div>Загрузка...</div>}

      {rows.length > 0 && (
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Предмет</th>
              <th>Тип аттестации</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.subject_name}</td>
                <td>{r.attestation_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
