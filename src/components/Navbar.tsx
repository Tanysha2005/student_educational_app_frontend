import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../auth/auth.service";

export default function Navbar() {
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <span className="navbar-brand">Student App</span>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Dashboard
              </NavLink>
            </li> */}

            <li className="nav-item">
              <NavLink className="nav-link" to="/students">
                Студенты
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/roles">
                Роли
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/specialities">
                Специальности
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/subjects">
                Предметы
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/curriculums">
                Учебные планы
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/statements">
                Ведомости
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/studentCard">
                Личная карточка студента
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/attestation-plan">
                Аттестационный план
              </NavLink>
            </li>
          </ul>

          <button className="btn btn-outline-light" onClick={onLogout}>
            Выйти
          </button>
        </div>
      </div>
    </nav>
  );
}
