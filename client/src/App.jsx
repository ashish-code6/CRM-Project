import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import CreateLead from "./pages/CreateLead";
import EditLead from "./pages/EditLead";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import Tools from "./pages/Tools";
import AuditLogs from "./pages/AuditLogs";
import Billing from "./pages/Billing";
import CreateInvoice from "./pages/CreateInvoice";
import EditInvoice from "./pages/EditInvoice";
import { getCurrentUser, getToken } from "./services/auth.service";
import { canCreateLeads, canManageBilling, canManageUsers, canViewAuditLogs } from "./utils/permissions";

function ProtectedRoute() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-h-screen lg:pl-72">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function RoleRoute({ allow, children }) {
  return allow(getCurrentUser()) ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/leads/create" element={<CreateLead />} />
          <Route path="/leads/:id/edit" element={<EditLead />} />
          <Route path="/billing" element={<RoleRoute allow={canManageBilling}><Billing /></RoleRoute>} />
          <Route path="/billing/create" element={<RoleRoute allow={canManageBilling}><CreateInvoice /></RoleRoute>} />
          <Route path="/billing/:id/edit" element={<RoleRoute allow={canManageBilling}><EditInvoice /></RoleRoute>} />
          <Route path="/tools" element={<RoleRoute allow={canCreateLeads}><Tools /></RoleRoute>} />
          <Route path="/users" element={<RoleRoute allow={canManageUsers}><Users /></RoleRoute>} />
          <Route path="/audit-logs" element={<RoleRoute allow={canViewAuditLogs}><AuditLogs /></RoleRoute>} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </>
  );
}
