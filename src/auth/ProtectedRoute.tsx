import { Navigate, Outlet  } from "react-router-dom";
import { isAuthenticated } from "./auth.service";

export default function ProtectedRoute() {
  console.log(isAuthenticated);
  console.log("вызывалась функция ProtectedRoute");

  if (isAuthenticated()) {
    console.log("сработало условие !isAuthenticated");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}