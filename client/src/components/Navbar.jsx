import { LogOut, Menu, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCurrentUser, logout } from "../services/auth.service";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-700 lg:hidden" type="button" aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div>
            <p className="text-sm font-medium text-slate-500">CRM Workspace</p>
            <h1 className="text-lg font-semibold text-slate-950">Sales Operations</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link className="hidden items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:flex" to="/profile">
            <UserRound size={16} />
            {user?.name || user?.email || user?.role || "Profile"}
          </Link>
          <button className="grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-white hover:bg-slate-800" onClick={handleLogout} type="button" aria-label="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
