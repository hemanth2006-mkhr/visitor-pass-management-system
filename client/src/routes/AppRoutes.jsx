import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ReceptionistDashboard from "../pages/receptionist/ReceptionistDashboard";
import HomeRedirect from "./HomeRedirect";
import Unauthorized from "../pages/Unauthorized";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Admin Route with Wildcard /* for nested tab routing */}
      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
      </Route>

      {/* Receptionist */}
      <Route element={<ProtectedRoute roles={["receptionist"]} />}>
        <Route path="/receptionist/dashboard/*" element={<ReceptionistDashboard />} />
      </Route>

      {/* Employee */}
      <Route element={<ProtectedRoute roles={["employee"]} />}>
        <Route path="/employee/dashboard/*" element={<EmployeeDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;