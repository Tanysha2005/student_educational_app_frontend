import { useEffect, useState } from "react";
import {
  getCurriculums,
  createCurriculum,
  updateCurriculum,
  deleteCurriculum,
  getSchoolPlan,
  downloadSchoolPlanXlsx,
  type SchoolPlanRow,
} from "./curriculums.service";
import { getSubjects } from "../subjects/subject.service";
import { getSpecialities } from "../speciality/speciality.service";

import type { Curriculum } from "./curriculums.types";
import type { Subject } from "../subjects/subject.types";
import type { Speciality } from "../speciality/speciality.types";

export default function Curriculums() {
  const [items, setItems] = useState<Curriculum[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);

  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<Curriculum | null>(null);

  const [id, setId] = useState<number>(0);
  const [subjectId, setSubjectId] = useState<number>(0);
  const [specialityId, setSpecialityId] = useState<number>(0);
  const [semester, setSemester] = useState<number>(1);

  const [cardSubject, setCardSubject] = useState<Subject | null>(null);
  const [cardSpeciality, setCardSpeciality] = useState<Speciality | null>(null);

  const [planSpeciality, setPlanSpeciality] = useState<number>(0);
  const [startYear, setStartYear] = useState<number>(
    new Date().getFullYear()
  );
  const [planRows, setPlanRows] = useState<SchoolPlanRow[]>([]);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const loadPlan = async () => {
    if (!planSpeciality || !startYear) return;

    setLoadingPlan(true);
    setPlanRows(
      await getSchoolPlan(planSpeciality, startYear)
    );
    setLoadingPlan(false);
  };

  const load = async () => {
    const [c, s, sp] = await Promise.all([
      getCurriculums(),
      getSubjects(),
      getSpecialities(),
    ]);

    setItems(c);
    setSubjects(s);
    setSpecialities(sp);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setId(0);
    setSubjectId(0);
    setSpecialityId(0);
    setSemester(1);
    setShow(true);
  };

  const openEdit = (c: Curriculum) => {
    setEditing(c);
    setId(c.id_curriculum);
    setSubjectId(c.id_subject);
    setSpecialityId(c.id_speciality);
    setSemester(c.semester);
    setShow(true);
  };

  const save = async () => {
    if (!id || !subjectId || !specialityId) return;

    const payload = {
      id_curriculum: id,
      id_subject: subjectId,
      id_speciality: specialityId,
      semester,
    };

    if (editing) {
      await updateCurriculum(id, payload);
    } else {
      await createCurriculum(payload);
    }

    setShow(false);
    load();
  };

  const remove = async (id: number) => {
    if (!window.confirm("Вы уверены?")) return;
    await deleteCurriculum(id);
    load();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h4>Учебные планы</h4>
        <button className="btn btn-primary" onClick={openCreate}>
          Добавить учебный план
        </button>
      </div>

      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Предмет</th>
            <th>Специальность</th>
            <th>Семестр</th>
            <th style={{ width: 210 }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {items.map(c => (
            <tr key={c.id_curriculum}>
              <td>{c.id_curriculum}</td>

              <td>
                <button
                  className="btn btn-link p-0"
                  onClick={() =>
                    setCardSubject(
                      subjects.find(s => s.id_subject === c.id_subject) || null
                    )
                  }
                >
                  {c.id_subject}
                </button>
              </td>

              <td>
                <button
                  className="btn btn-link p-0"
                  onClick={() =>
                    setCardSpeciality(
                      specialities.find(s => s.id_speciality === c.id_speciality) || null
                    )
                  }
                >
                  {c.id_speciality}
                </button>
              </td>

              <td>{c.semester}</td>

              <td className="text-end">
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => openEdit(c)}
                >
                  Редактировать
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => remove(c.id_curriculum)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL CREATE / EDIT */}
      {show && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editing ? "Редактировать учебный план" : "Добавить учебный план"}
                </h5>
                <button className="btn-close" onClick={() => setShow(false)} />
              </div>

              <div className="modal-body row g-2">
                <div className="col-md-6">
                  <label className="form-label">ID учебного плана</label>
                  <input
                    type="number"
                    className="form-control"
                    value={id}
                    onChange={e => setId(Number(e.target.value))}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Семестр</label>
                  <input
                    type="number"
                    className="form-control"
                    value={semester}
                    onChange={e => setSemester(Number(e.target.value))}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Предмет</label>
                  <select
                    className="form-select"
                    value={subjectId}
                    onChange={e => setSubjectId(Number(e.target.value))}
                  >
                    <option value={0}>Выберите предмет</option>
                    {subjects.map(s => (
                      <option key={s.id_subject} value={s.id_subject}>
                        {s.id_subject} - {s.subject_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Специальность</label>
                  <select
                    className="form-select"
                    value={specialityId}
                    onChange={e => setSpecialityId(Number(e.target.value))}
                  >
                    <option value={0}>Выберите специальность</option>
                    {specialities.map(s => (
                      <option key={s.id_speciality} value={s.id_speciality}>
                        {s.id_speciality} - {s.speciality_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShow(false)}>
                  Отмена
                </button>
                <button className="btn btn-primary" onClick={save}>
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBJECT CARD */}
      {cardSubject && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Карточка предмета</h5>
                <button className="btn-close" onClick={() => setCardSubject(null)} />
              </div>
              <div className="modal-body">
                <pre className="mb-0">
                  {JSON.stringify(cardSubject, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SPECIALITY CARD */}
      {cardSpeciality && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Карточка специальности</h5>
                <button className="btn-close" onClick={() => setCardSpeciality(null)} />
              </div>
              <div className="modal-body">
                <pre className="mb-0">
                  {JSON.stringify(cardSpeciality, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      <hr className="my-5" />

      <h4 className="mb-3">Учебный план специальности</h4>

      <div className="row g-3 align-items-end mb-4">
        <div className="col-md-4">
          <label className="form-label">Специальность</label>
          <select
            className="form-select"
            value={planSpeciality}
            onChange={e => setPlanSpeciality(Number(e.target.value))}
          >
            <option value={0}>Выберите специальность</option>
            {specialities.map(s => (
              <option key={s.id_speciality} value={s.id_speciality}>
                {s.id_speciality} - {s.speciality_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Год набора</label>
          <input
            type="number"
            className="form-control"
            value={startYear}
            onChange={e => setStartYear(Number(e.target.value))}
          />
        </div>

        <div className="col-md-2">
          <button
            className="btn btn-primary w-100"
            onClick={loadPlan}
            disabled={!planSpeciality}
          >
            Показать
          </button>
        </div>

        {planRows.length > 0 && (
          <div className="col-md-3">
            <button
              className="btn btn-success w-100"
              onClick={() =>
                downloadSchoolPlanXlsx(planSpeciality, startYear)
              }
            >
              Скачать XLSX
            </button>
          </div>
        )}
      </div>

      {loadingPlan && <div>Загрузка...</div>}

      {planRows.length > 0 && (
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Предмет</th>
              <th>Семестр</th>
              <th>Часы</th>
              <th>Тип аттестации</th>
            </tr>
          </thead>
          <tbody>
            {planRows.map((r, i) => (
              <tr key={i}>
                <td>{r.subject_name}</td>
                <td>{r.semester}</td>
                <td>{r.hours_amount}</td>
                <td>{r.attestation_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
