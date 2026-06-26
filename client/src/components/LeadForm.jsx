import { useState } from "react";
import { Save } from "lucide-react";

const statuses = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"];

export default function LeadForm({
  initialValues,
  assignmentOptions = [],
  onSubmit,
  readOnlyDetails = false,
  submitLabel = "Save Lead",
  showAssignment = false,
  showStatus = false,
}) {
  const [form, setForm] = useState({
    name: initialValues?.name || "",
    email: initialValues?.email || "",
    phone: initialValues?.phone || "",
    company: initialValues?.company || "",
    status: initialValues?.status || "NEW",
    assignedToId: initialValues?.assignedToId || "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="rounded-md border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Lead name</span>
          <input className="field" disabled={readOnlyDetails} name="name" onChange={handleChange} required value={form.name} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Company</span>
          <input className="field" disabled={readOnlyDetails} name="company" onChange={handleChange} value={form.company} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input className="field" disabled={readOnlyDetails} name="email" onChange={handleChange} type="email" value={form.email} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Phone</span>
          <input className="field" disabled={readOnlyDetails} name="phone" onChange={handleChange} value={form.phone} />
        </label>
        {showStatus && (
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Status</span>
            <select className="field" name="status" onChange={handleChange} value={form.status}>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        )}
        {showAssignment && (
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Assign to sales user</span>
            {assignmentOptions.length ? (
              <select className="field" name="assignedToId" onChange={handleChange} value={form.assignedToId}>
                <option value="">Unassigned</option>
                {assignmentOptions.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            ) : (
              <input className="field" name="assignedToId" onChange={handleChange} placeholder="Sales user ID" value={form.assignedToId} />
            )}
          </label>
        )}
      </div>
      <div className="mt-6 flex justify-end">
        <button className="btn-primary" disabled={saving} type="submit">
          <Save size={17} />
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
