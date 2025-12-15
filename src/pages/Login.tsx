import { useState } from "react";
import { login } from "../auth/auth.service";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await login(username, password);
      window.location.href = "/students";
    } catch {
      setError("Неверный логин или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h4 className="mb-3">Авторизация</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={submit}>
            <input
              className="form-control mb-2"
              placeholder="Логин"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <input
              className="form-control mb-3"
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Входим..." : "Войти"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
