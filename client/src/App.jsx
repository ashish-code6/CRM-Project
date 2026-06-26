import { Navigate, Outlet, Route, Routes } from "react-router-dom";
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
import { getCurrentUser, getToken } from "./services/auth.service";
import { canCreateLeads, canManageUsers } from "./utils/permissions";

function ProtectedRoute() {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Sidebar />
      <div className="min-h-screen lg:pl-72">
        <Navbar />
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
          <Route path="/tools" element={<RoleRoute allow={canCreateLeads}><Tools /></RoleRoute>} />
          <Route path="/users" element={<RoleRoute allow={canManageUsers}><Users /></RoleRoute>} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </>
  );
}
