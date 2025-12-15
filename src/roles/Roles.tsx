import { useEffect, useState } from "react";
import { getRoles, createRole, updateRole, deleteRole } from "./roles.service";
import type { Role } from "./roles.types";

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [name, setName] = useState("");

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await getRoles();
      setRoles(data);
    } catch {
      setError("Не удалось загрузить роли");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const openCreate = () => {
    setEditingRole(null);
    setName("");
    setShowModal(true);
  };

  const openEdit = (role: Role) => {
    setEditingRole(role);
    setName(role.name);
    setShowModal(true);
  };

  const saveRole = async () => {
    try {
      if (editingRole) {
        await updateRole(editingRole.id, name);
      } else {
        await createRole(name);
      }

      setShowModal(false);
      loadRoles();
    } catch {
      alert("Ошибка сохранения");
    }
  };

  const removeRole = async (id: string) => {
    const ok = window.confirm("Вы уверены?");
    if (!ok) return;

    try {
      await deleteRole(id);
      loadRoles();
    } catch {
      alert("Ошибка удаления");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Роли</h3>
        <button className="btn btn-primary" onClick={openCreate}>Добавить роль</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(role => (
              <tr key={role.id}>
                <td>{role.id}</td>
                <td>{role.name}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => openEdit(role)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeRole(role.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingRole ? "Редактировать роль" : "Добавить роль"}
                </h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <input
                  className="form-control"
                  placeholder="Название роли"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Отмена
                </button>
                <button className="btn btn-primary" onClick={saveRole}>
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && <div className="modal-backdrop show" />}
    </div>
  );
}
