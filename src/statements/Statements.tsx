import { useEffect, useState } from "react";
import {
  getStatements,
  createStatement,
  updateStatement,
  deleteStatement,
} from "./statements.service";

import { getStudents } from "../students/students.service";
import { getSubjects } from "../subjects/subject.service";

import type { Statement } from "./statements.types";
import type { StudentForm } from "../students/Students";
import type { Subject } from "../subjects/subject.types";

export default function Statements() {
  const [items, setItems] = useState<Statement[]>([]);
  const [students, setStudents] = useState<StudentForm[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<Statement | null>(null);

  const [form, setForm] = useState<Statement>({
    id_statement: 0,
    id_student: "",
    id_subject: 0,
    grade: "",
    semester: 1,
  });

  const [cardStudent, setCardStudent] = useState<StudentForm | null>(null);
  const [cardSubject, setCardSubject] = useState<Subject | null>(null);

  const load = async () => {
    setItems(await getStatements());
    setStudents(await getStudents());
    setSubjects(await getSubjects());
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      id_statement: 0,
      id_student: "",
      id_subject: 0,
      grade: "",
      semester: 1,
    });
    setShow(true);
  };

  const openEdit = (s: Statement) => {
    setEditing(s);
    setForm(s);
    setShow(true);
  };

  const save = async () => {
    if (!form.id_statement) return;

    if (editing) {
      await updateStatement(form.id_statement, form);
    } else {
      await createStatement(form);
    }

    setShow(false);
    load();
  };

  const remove = async (id: number) => {
    if (!window.confirm("Вы уверены?")) return;
    await deleteStatement(id);
    load();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h4>Ведомости</h4>
        <button className="btn btn-primary" onClick={openCreate}>
          Добавить ведомость
        </button>
      </div>

      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Студент</th>
            <th>Предмет</th>
            <th>Оценка</th>
            <th>Семестр</th>
            <th style={{ width: 210 }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {items.map(s => (
            <tr key={s.id_statement}>
              <td>{s.id_statement}</td>

              <td>
                <button
                  className="btn btn-link p-0"
                  onClick={() =>
                    setCardStudent(students.find(x => x.id_student === s.id_student) || null)
                  }
                >
                  {s.id_student}
                </button>
              </td>

              <td>
                <button
                  className="btn btn-link p-0"
                  onClick={() =>
                    setCardSubject(subjects.find(x => x.id_subject === s.id_subject) || null)
                  }
                >
                  {s.id_subject}
                </button>
              </td>

              <td>{s.grade}</td>
              <td>{s.semester}</td>

              <td className="text-end">
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => openEdit(s)}
                >
                  Редактировать
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => remove(s.id_statement)}
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
                  {editing ? "Редактировать ведомость" : "Добавить ведомость"}
                </h5>
                <button className="btn-close" onClick={() => setShow(false)} />
              </div>

              <div className="modal-body row g-2">
                <div className="col-md-6">
                  <label className="form-label">ID ведомости</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.id_statement}
                    onChange={e =>
                      setForm({ ...form, id_statement: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Студент</label>
                  <select
                    className="form-select"
                    value={form.id_student}
                    onChange={e =>
                      setForm({ ...form, id_student: String(e.target.value) })
                    }
                  >
                    <option value={0}>Выберите</option>
                    {students.map(s => (
                      <option key={s.id_student} value={s.id_student}>
                        {s.id_student} — {s.name} {s.surname} {s.otchectvo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Предмет</label>
                  <select
                    className="form-select"
                    value={form.id_subject}
                    onChange={e =>
                      setForm({ ...form, id_subject: Number(e.target.value) })
                    }
                  >
                    <option value={0}>Выберите</option>
                    {subjects.map(s => (
                      <option key={s.id_subject} value={s.id_subject}>
                        {s.id_subject} — {s.subject_name} — {s.attestation_type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Оценка</label>
                  <input
                    className="form-control"
                    value={form.grade}
                    onChange={e =>
                      setForm({ ...form, grade: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Семестр</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.semester}
                    onChange={e =>
                      setForm({ ...form, semester: Number(e.target.value) })
                    }
                  />
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

      {/* STUDENT CARD */}
      {cardStudent && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Карточка студента</h5>
                <button className="btn-close" onClick={() => setCardStudent(null)} />
              </div>
              <div className="modal-body">
                <pre>{JSON.stringify(cardStudent, null, 2)}</pre>
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
                <h5>Карточка предмета</h5>
                <button className="btn-close" onClick={() => setCardSubject(null)} />
              </div>
              <div className="modal-body">
                <pre>{JSON.stringify(cardSubject, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
