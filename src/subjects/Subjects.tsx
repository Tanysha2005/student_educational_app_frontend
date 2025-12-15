import { useEffect, useState } from "react";
import {
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
} from "./subject.service";
import type { Subject } from "./subject.types";

export default function Subjects() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [show, setShow] = useState(false);
    const [editing, setEditing] = useState<Subject | null>(null);

    const [id, setId] = useState(0);
    const [name, setName] = useState("");
    const [hours, setHours] = useState(0);
    const [attestation, setAttestation] = useState("");

    const load = async () => setSubjects(await getSubjects());

    useEffect(() => {
        load();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setId(0);
        setName("");
        setHours(0);
        setAttestation("");
        setShow(true);
    };

    const openEdit = (s: Subject) => {
        setEditing(s);
        setId(s.id_subject);
        setName(s.subject_name);
        setHours(s.hours_amount);
        setAttestation(s.attestation_type);
        setShow(true);
    };

    const save = async () => {
        if (!name.trim()) return;

        if (editing) {
            await updateSubject(editing.id_subject, {
                id_subject: id,
                subject_name: name,
                hours_amount: hours,
                attestation_type: attestation,
            });
        } else {
            await createSubject({
                id_subject: id,
                subject_name: name,
                hours_amount: hours,
                attestation_type: attestation,
            });
        }

        setShow(false);
        load();
    };

    const remove = async (id: number) => {
        if (!window.confirm("Вы уверены?")) return;
        await deleteSubject(id);
        load();
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h4>Предметы</h4>
                <button className="btn btn-primary" onClick={openCreate}>
                    Добавить предмет
                </button>
            </div>

            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Часы</th>
                        <th>Тип аттестации</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map(s => (
                        <tr key={s.id_subject}>
                            <td>{s.id_subject}</td>
                            <td>{s.subject_name}</td>
                            <td>{s.hours_amount}</td>
                            <td>{s.attestation_type}</td>
                            <td className="text-end">
                                <button
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => openEdit(s)}
                                >
                                    Редактировать
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => remove(s.id_subject)}
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {show && (
                <div className="modal show d-block bg-dark bg-opacity-50">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editing ? "Редактировать предмет" : "Добавить предмет"}
                                </h5>
                                <button className="btn-close" onClick={() => setShow(false)} />
                            </div>

                            <div className="modal-body row g-2">
                                <div className="col-12">
                                    <label className="form-label">ID</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={id}
                                        onChange={e => setId(+e.target.value)}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Название предмета</label>
                                    <input
                                        className="form-control"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Количество часов</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={hours}
                                        onChange={e => setHours(+e.target.value)}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Тип аттестации</label>
                                    <input
                                        className="form-control"
                                        value={attestation}
                                        onChange={e => setAttestation(e.target.value)}
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
        </div>
    );
}
