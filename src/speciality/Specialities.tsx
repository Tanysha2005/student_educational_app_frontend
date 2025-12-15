import { useEffect, useState } from "react";
import {
    getSpecialities,
    createSpeciality,
    updateSpeciality,
    deleteSpeciality,
} from "./speciality.service";

import type { Speciality } from "./speciality.types";

export default function Specialities() {
    const [specialities, setSpecialities] = useState<Speciality[]>([]);
    const [show, setShow] = useState(false);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [id, setId] = useState<number | null>(null);
    const [name, setName] = useState("");

    const load = async () => {
        const data = await getSpecialities();
        setSpecialities(data);
    };

    useEffect(() => {
        load();
    }, []);

    const openCreate = () => {
        setEditingId(null);
        setName("");
        setShow(true);
    };

    const openEdit = (s: Speciality) => {
        setEditingId(s.id_speciality);
        setId(s.id_speciality);
        setName(s.speciality_name);
        setShow(true);
    };

    const save = async () => {
        try {
            if (editingId) {
                await updateSpeciality(editingId, name);
            } else {
                await createSpeciality(name);
            }

            setShow(false);
            load();
        } catch {
            alert("Ошибка сохранения");
        }
    };

    const remove = async (id: number) => {
        if (!window.confirm("Вы уверены?")) return;
        await deleteSpeciality(id);
        load();
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h4>Специальности</h4>
                <button className="btn btn-primary" onClick={openCreate}>
                    Добавить специальность
                </button>
            </div>

            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название специальности</th>
                        <th style={{ width: 210 }}>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {specialities.map(s => (
                        <tr key={s.id_speciality}>
                            <td>{s.id_speciality}</td>
                            <td>{s.speciality_name}</td>
                            <td className="text-end">
                                <button
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => openEdit(s)}
                                >
                                    Редактировать
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => remove(s.id_speciality)}
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* MODAL */}
            {show && (
                <div className="modal show d-block bg-dark bg-opacity-50">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingId !== null
                                        ? "Редактировать специальность"
                                        : "Добавить специальность"}
                                </h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setShow(false)}
                                />
                            </div>
                            <div className="modal-body">
                                <label className="form-label">
                                    Название специальности
                                </label>
                                <input
                                    className="form-control"
                                    placeholder="Название роли"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
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
        </div>
    );
}
