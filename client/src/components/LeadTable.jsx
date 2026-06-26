import { Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const statusClass = {
  NEW: "bg-sky-50 text-sky-700",
  CONTACTED: "bg-amber-50 text-amber-700",
  QUALIFIED: "bg-teal-50 text-teal-700",
  CONVERTED: "bg-emerald-50 text-emerald-700",
  LOST: "bg-rose-50 text-rose-700",
};

export default function LeadTable({ canDelete = false, leads, onDelete }) {
  if (!leads.length) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="font-medium text-slate-800">No leads found</p>
        <p className="mt-1 text-sm text-slate-500">Create your first lead to start tracking pipeline activity.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {["Lead", "Company", "Phone", "Status", "Created", "Actions"].map((head) => (
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500" key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr className="hover:bg-slate-50" key={lead.id}>
                <td className="px-4 py-4">
                  <p className="font-medium text-slate-950">{lead.name}</p>
                  <p className="text-sm text-slate-500">{lead.email || "No email"}</p>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">{lead.company || "-"}</td>
                <td className="px-4 py-4 text-sm text-slate-600">{lead.phone || "-"}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[lead.status] || "bg-slate-100 text-slate-700"}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Link className="icon-btn" to={`/leads/${lead.id}/edit`} aria-label={`Edit ${lead.name}`}>
                      <Edit size={16} />
                    </Link>
                    {canDelete && (
                      <button className="icon-btn text-rose-600 hover:bg-rose-50" onClick={() => onDelete(lead.id)} type="button" aria-label={`Delete ${lead.name}`}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
