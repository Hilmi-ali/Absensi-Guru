import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import History from "./pages/History";
import Profile from "./pages/Profile";

import Dashboard from "./admin/Dashboard";

import TeacherRoute from "./routes/TeacherRoute";
import AdminRoute from "./routes/AdminRoute";
import Teachers from "./admin/Teachers";
import AttendanceHistory from "./admin/AttendanceHistory";
import MonthlyReport from "./admin/MonthlyReport";
import Settings from "./admin/Settings";

import { useAuth } from "./contexts/AuthContext";

function Router() {
  const { user, profile, loading } = useAuth();

  if (loading || (user && !profile)) {
    return <h2>Loading...</h2>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          !user ? (
            <Login />
          ) : profile?.role === "admin" ? (
            <Navigate to="/admin" replace />
          ) : (
            <Navigate to="/home" replace />
          )
        }
      />

      <Route
        path="/home"
        element={
          <TeacherRoute>
            <Home />
          </TeacherRoute>
        }
      />

      <Route
        path="/history"
        element={
          <TeacherRoute>
            <History />
          </TeacherRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <TeacherRoute>
            <Profile />
          </TeacherRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/teachers"
        element={
          <AdminRoute>
            <Teachers />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/history"
        element={
          <AdminRoute>
            <AttendanceHistory />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/report"
        element={
          <AdminRoute>
            <MonthlyReport />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <Settings />
          </AdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default Router;
