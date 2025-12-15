import { useEffect, useState } from "react";
import {
  getStudentCard,
  downloadStudentCardXlsx,
  getStudentsShort,
  type StudentCardRow,
  type StudentShort,
} from "./studentCard.service";

export default function StudentCard() {
  const [students, setStudents] = useState<StudentShort[]>([]);
  const [recordBook, setRecordBook] = useState<number>(0);
  const [rows, setRows] = useState<StudentCardRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStudentsShort().then(setStudents);
  }, []);

  const load = async () => {
    if (!recordBook) return;

    try {
      setLoading(true);
      setError(null);
      setRows(await getStudentCard(recordBook));
    } catch {
      setError("Карточка не найдена");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Личная карточка студента</h4>

      {/* SELECT */}
      <div className="row g-2 align-items-end mb-4">
        <div className="col-md-5">
          <label className="form-label">Номер зачётной книжки</label>
          <select
            className="form-select"
            value={recordBook}
            onChange={e => setRecordBook(Number(e.target.value))}
          >
            <option value={0}>Выберите студента</option>
            {students.map(s => (
              <option
                key={s.id_student}
                value={s.record_book_number}
              >
                {s.record_book_number} — {s.name} {s.surname} {s.otchectvo}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <button
            className="btn btn-primary w-100"
            onClick={load}
            disabled={!recordBook}
          >
            Показать
          </button>
        </div>

        {rows.length > 0 && (
          <div className="col-md-3">
            <button
              className="btn btn-success w-100"
              onClick={() => downloadStudentCardXlsx(recordBook)}
            >
              Скачать XLSX
            </button>
          </div>
        )}
      </div>

      {/* ERROR */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* TABLE */}
      {loading && <div>Загрузка...</div>}

      {rows.length > 0 && (
        <>
          <div className="mb-3">
            <strong>
              {rows[0].surname} {rows[0].name} {rows[0].otchectvo}
            </strong>
            <br />
            Специальность: {rows[0].speciality_name}
            <br />
            Группа: {rows[0].group_full}
          </div>

          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Предмет</th>
                <th>Семестр</th>
                <th>Тип аттестации</th>
                <th>Оценка</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>{r.subject_name}</td>
                  <td>{r.semester}</td>
                  <td>{r.attestation_type}</td>
                  <td>{r.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
