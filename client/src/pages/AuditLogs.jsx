import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import { getAuditLogs } from "../services/audit.service";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getAuditLogs({ page, limit: 10, search })
      .then((result) => {
        if (active) {
          setLogs(result.data || []);
          setPagination(result.pagination);
        }
      })
      .catch((error) => toast.error(error.response?.data?.message || "Could not load audit logs"))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, search]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Audit Logs</h2>
        <p className="mt-1 text-sm text-slate-500">Admin-only activity history for lead changes and assignments.</p>
      </div>
      <label className="relative block max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          className="field pl-10"
          onChange={(event) => {
            setPage(1);
            setSearch(event.target.value);
          }}
          placeholder="Search by action, entity, username, email, role, or ID"
          value={search}
        />
      </label>
      {loading ? (
        <Loader label="Loading audit logs" />
      ) : (
        <>
          <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    {["Action", "Entity", "Entity ID", "User", "Date"].map((head) => (
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500" key={head}>
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr className="hover:bg-slate-50" key={log.id}>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">{log.action}</span>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-800">{log.entity}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{log.entityId}</td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-slate-800">{log.user?.name || "Unknown user"}</p>
                        <p className="break-all text-xs text-slate-500">{log.user?.email || log.userId}</p>
                        {log.user?.role && <p className="mt-1 text-xs font-semibold text-teal-700">{log.user.role}</p>}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">{log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!logs.length && <p className="p-5 text-sm text-slate-500">No audit logs found.</p>}
          </div>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
