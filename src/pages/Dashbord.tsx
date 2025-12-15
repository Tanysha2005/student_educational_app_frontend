import { logout } from "../auth/auth.service";

export default function Dashboard() {
  return (
    <div className="container mt-4">
      <h3>Панель управления</h3>
      <button className="btn btn-outline-danger mt-3" onClick={logout}>
        Выйти
      </button>
    </div>
  );
}