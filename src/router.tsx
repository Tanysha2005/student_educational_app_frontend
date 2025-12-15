import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashbord";
import ProtectedRoute from "./auth/ProtectedRoute";
import { Navigate } from "react-router-dom";

import Layout from "./Layout";

import Roles from "./roles/Roles";
import Students from "./students/Students";
import Specialities from "./speciality/Specialities";
import Subjects from "./subjects/Subjects";
import Curriculums from "./curriculums/Curriculums";
import Statements from "./statements/Statements";
import StudentCard from "./studentCards/StudentCard";
import AttestationPlan from "./attestationPlan/AttestationPlan";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: (
      <Layout />
    ),

    children: [{
      element: <ProtectedRoute />,
      children: [
        { path: "/", element: <Dashboard /> },
        { path: "/roles", element: <Roles /> },
        { path: "/students", element: <Students /> },
        { path: "/specialities", element: <Specialities /> },
        { path: "/subjects", element: <Subjects /> },
        { path: "/curriculums", element: <Curriculums /> },
        { path: "/statements", element: <Statements /> },
        { path: "/studentCard", element: <StudentCard /> },
        { path: "/attestation-plan", element: <AttestationPlan /> }
      ]
    }]
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);