import { useEffect, useState } from "react";

import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "./students.service";

import { getSpecialities } from "../speciality/speciality.service";
import type { Speciality } from "../speciality/speciality.types";

export interface StudentForm {
  id_student: string;
  id_speciality: number;
  name: string;
  surname: string;
  otchectvo: string;
  admission_date: number;
  group_number: number;
  group_code: string;
  record_book_number: number;
}

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);

  const [show, setShow] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [cardSpeciality, setCardSpeciality] = useState<Speciality | null>(null);

  const emptyForm: StudentForm = {
    id_student: "",
    id_speciality: 0,
    name: "",
    surname: "",
    otchectvo: "",
    admission_date: new Date().getFullYear(),
    group_number: 1,
    group_code: "",
    record_book_number: 0,
  };

  const [form, setForm] = useState<StudentForm>(emptyForm);

  const load = async () => {
    setStudents(await getStudents());
  };

  useEffect(() => {
    load();
    getSpecialities().then(setSpecialities);
  }, []);

  const openCreate = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShow(true);
  };

  const openEdit = (s: any) => {
    setForm({
      id_student: s.id_student,
      id_speciality: s.id_speciality,
      name: s.name,
      surname: s.surname,
      otchectvo: s.otchectvo,
      admission_date: s.admission_date,
      group_number: s.group_number,
      group_code: s.group_code,
      record_book_number: s.record_book_number,
    });
    setEditingId(s.id_student);
    setShow(true);
  };

  const save = async () => {
    if (editingId) {
      await updateStudent(editingId, form);
    } else {
      await createStudent(form);
    }
    setShow(false);
    load();
  };

  const remove = async (id_student: string) => {
    if (!window.confirm("Вы уверены?")) return;
    await deleteStudent(id_student);
    load();
  };

  const change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: e.target.type === "number" ? Number(value) : value,
    }));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h4>Студенты</h4>
        <button className="btn btn-primary" onClick={openCreate}>
          Добавить студента
        </button>
      </div>

      <div className="col-md-5 alert alert-danger">
        Ошибка: Такая специальность уже существует
      </div>
      <div className="col-md-5 alert alert-danger">
        Ошибка: Студент с таким номером зачётки существует
      </div>
      <div className="col-md-5 alert alert-success">
        Специальность сохранена
      </div>
      <div className="col-md-5 alert alert-success">Студент сохранен</div>
      <div className="col-md-5 alert alert-success">Специальность удалена</div>
      <div className="col-md-5 alert alert-success">Студент удален</div>

      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>ФИО</th>
            <th>Группа</th>
            <th>Зачётка</th>
            <th>Год поступления</th>
            <th>Специальность</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id_student}>
              <td>{s.id_student}</td>
              <td>
                {s.surname} {s.name} {s.otchectvo}
              </td>
              <td>
                {s.group_code}-{s.group_number}
              </td>
              <td>{s.record_book_number}</td>
              <td>{s.admission_date}</td>

              <td>
                <button
                  className="btn btn-link p-0"
                  onClick={() =>
                    setCardSpeciality(
                      specialities.find(
                        (sp) => sp.id_speciality === s.id_speciality
                      ) || null
                    )
                  }
                >
                  {s.id_speciality}
                </button>
              </td>

              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => openEdit(s)}
                >
                  Редактировать
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => remove(s.id_student)}
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
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingId ? "Редактировать студента" : "Добавить студента"}
                </h5>
                <button className="btn-close" onClick={() => setShow(false)} />
              </div>

              <div className="modal-body row g-3">
                <div className="col-md-12">
                  <label className="form-label">ID</label>
                  <input
                    type="number"
                    className="form-control"
                    name="id_student"
                    value={form.id_student}
                    onChange={change}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Фамилия</label>
                  <input
                    className="form-control"
                    name="surname"
                    value={form.surname}
                    onChange={change}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Имя</label>
                  <input
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={change}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Отчество</label>
                  <input
                    className="form-control"
                    name="otchectvo"
                    value={form.otchectvo}
                    onChange={change}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Год поступления</label>
                  <input
                    type="number"
                    className="form-control"
                    name="admission_date"
                    value={form.admission_date}
                    onChange={change}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Номер группы</label>
                  <input
                    type="number"
                    className="form-control"
                    name="group_number"
                    value={form.group_number}
                    onChange={change}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Код группы</label>
                  <input
                    className="form-control"
                    name="group_code"
                    value={form.group_code}
                    onChange={change}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Зачётка</label>
                  <input
                    type="number"
                    className="form-control"
                    name="record_book_number"
                    value={form.record_book_number}
                    onChange={change}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Специальность</label>
                  <select
                    className="form-select"
                    name="id_speciality"
                    value={form.id_speciality}
                    onChange={change}
                  >
                    <option value={0}>Выберите</option>
                    {specialities.map((s) => (
                      <option key={s.id_speciality} value={s.id_speciality}>
                        {s.id_speciality} — {s.speciality_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShow(false)}
                >
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

      {/* SPECIALITY CARD */}
      {cardSpeciality && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Карточка специальности</h5>
                <button
                  className="btn-close"
                  onClick={() => setCardSpeciality(null)}
                />
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
    </div>
  );
}
