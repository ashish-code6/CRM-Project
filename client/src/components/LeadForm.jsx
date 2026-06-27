import { useState } from "react";
import { Save } from "lucide-react";
import { isEmail, isPhone, required } from "../utils/validation";

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
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setErrors((current) => ({ ...current, [event.target.name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!readOnlyDetails && !required(form.name)) {
      nextErrors.name = "Lead name is required";
    }
    if (form.email && !isEmail(form.email)) {
      nextErrors.email = "Enter a valid email address";
    }
    if (form.phone && !isPhone(form.phone)) {
      nextErrors.phone = "Enter a valid phone number";
    }
    if (showStatus && !required(form.status)) {
      nextErrors.status = "Select a status";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

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
          <input className={`field ${errors.name ? "field-error" : ""}`} disabled={readOnlyDetails} name="name" onChange={handleChange} value={form.name} />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Company</span>
          <input className="field" disabled={readOnlyDetails} name="company" onChange={handleChange} value={form.company} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input className={`field ${errors.email ? "field-error" : ""}`} disabled={readOnlyDetails} name="email" onChange={handleChange} type="email" value={form.email} />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Phone</span>
          <input className={`field ${errors.phone ? "field-error" : ""}`} disabled={readOnlyDetails} name="phone" onChange={handleChange} value={form.phone} />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </label>
        {showStatus && (
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Status</span>
            <select className={`field ${errors.status ? "field-error" : ""}`} name="status" onChange={handleChange} value={form.status}>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && <span className="error-text">{errors.status}</span>}
          </label>
        )}
        {showAssignment && (
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Assign to sales user</span>
            <select className={`field ${errors.assignedToId ? "field-error" : ""}`} disabled={!assignmentOptions.length} name="assignedToId" onChange={handleChange} value={form.assignedToId}>
              <option value="">{assignmentOptions.length ? "Unassigned" : "No sales users found"}</option>
              {assignmentOptions.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            {errors.assignedToId && <span className="error-text">{errors.assignedToId}</span>}
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
