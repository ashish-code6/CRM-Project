import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, UserPlus } from "lucide-react";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import { getCurrentUser } from "../services/auth.service";
import { createUser, deleteUser, getUsers } from "../services/user.service";
import { allowedUserRolesToCreate, canDeleteUsers, canManageUsers } from "../utils/permissions";

export default function Users() {
  const user = getCurrentUser();
  const canManage = canManageUsers(user);
  const allowedRoles = allowedUserRolesToCreate(user);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(canManage);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: allowedRoles[0] || "SALES" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    if (!canManage) {
      return undefined;
    }

    getUsers({ page, limit: 10 })
      .then((result) => {
        if (active) {
          setUsers(result.data || []);
          setPagination(result.pagination);
        }
      })
      .catch((error) => toast.error(error.response?.data?.message || "Could not load users"))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [canManage, page]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const result = await createUser(form);
      toast.success("User created");
      setUsers((current) => [result.user, ...current]);
      setPagination((current) => current ? { ...current, total: current.total + 1 } : current);
      setForm({ name: "", email: "", password: "", role: allowedRoles[0] || "SALES" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? Assigned leads will become unassigned.")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted");
      setUsers((current) => current.filter((item) => item.id !== id));
      setPagination((current) => current ? { ...current, total: Math.max(current.total - 1, 0) } : current);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete user");
    }
  };

  if (!canManage) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Access denied</h2>
        <p className="mt-2 text-sm text-slate-500">Sales users cannot create or manage users.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Users</h2>
          <p className="mt-1 text-sm text-slate-500">
            {user?.role === "ADMIN" ? "Create admins, managers, and sales users." : "Create sales users for your team."}
          </p>
        </div>
        <form className="rounded-md border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Name</span>
              <input className="field" onChange={(e) => setForm({ ...form, name: e.target.value })} required value={form.name} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input className="field" onChange={(e) => setForm({ ...form, email: e.target.value })} required type="email" value={form.email} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input className="field" onChange={(e) => setForm({ ...form, password: e.target.value })} required type="password" value={form.password} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Role</span>
              <select className="field" onChange={(e) => setForm({ ...form, role: e.target.value })} value={form.role}>
                {allowedRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="btn-primary" disabled={saving} type="submit">
              <UserPlus size={17} />
              {saving ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </section>
      <section className="rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h3 className="font-semibold text-slate-950">User Directory</h3>
          <p className="mt-1 text-sm text-slate-500">{user?.role === "ADMIN" ? "All system users." : "Sales users available for assignment."}</p>
        </div>
        {loading ? (
          <Loader label="Loading users" />
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {users.map((item) => (
                <div className="flex items-center justify-between gap-3 p-4" key={item.id}>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-950">{item.name}</p>
                    <p className="break-all text-sm text-slate-500">{item.email}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-teal-700">{item.role}</span>
                      {item.role === "SALES" && (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                          {item.assignedLeadCount || 0} assigned leads
                        </span>
                      )}
                    </div>
                  </div>
                  {canDeleteUsers(user) && item.id !== user.id && (
                    <button className="icon-btn text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(item.id)} type="button" aria-label={`Delete ${item.name}`}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              {!users.length && <p className="p-5 text-sm text-slate-500">No users found.</p>}
            </div>
            <div className="border-t border-slate-200 p-4">
              <Pagination pagination={pagination} onPageChange={setPage} />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
