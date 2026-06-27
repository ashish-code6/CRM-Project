import { BarChart3, BriefcaseBusiness, ClipboardList, FileText, LayoutDashboard, UploadCloud, UserRoundCog } from "lucide-react";
import { NavLink } from "react-router-dom";
import { getCurrentUser } from "../services/auth.service";
import { canCreateLeads, canManageBilling, canManageUsers, canViewAuditLogs } from "../utils/permissions";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/leads", label: "Leads", icon: BriefcaseBusiness },
  { to: "/billing", label: "Billing", icon: FileText },
  { to: "/tools", label: "CSV & Email", icon: UploadCloud },
  { to: "/users", label: "Users", icon: UserRoundCog },
  { to: "/audit-logs", label: "Audit Logs", icon: ClipboardList },
  { to: "/profile", label: "Profile", icon: BarChart3 },
];

export default function Sidebar() {
  const user = getCurrentUser();
  const visibleLinks = links.filter((link) => {
    if (link.to === "/users") return canManageUsers(user);
    if (link.to === "/tools") return canCreateLeads(user);
    if (link.to === "/audit-logs") return canViewAuditLogs(user);
    if (link.to === "/billing") return canManageBilling(user);
    return true;
  });

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-teal-600 text-lg font-bold text-white">C</div>
        <div>
          <p className="text-base font-semibold text-slate-950">CRM System</p>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Lead Management</p>
        </div>
      </div>
      <nav className="space-y-1 px-4 py-5">
        {visibleLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                isActive ? "bg-teal-50 text-teal-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`
            }
            key={to}
            to={to}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
