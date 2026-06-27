import { useMemo, useState } from "react";
import { Save } from "lucide-react";
import { required } from "../utils/validation";

const statuses = ["PENDING", "PAID", "OVERDUE"];

export default function InvoiceForm({ initialValues, onSubmit, submitLabel = "Save Invoice" }) {
  const [form, setForm] = useState({
    invoiceNo: initialValues?.invoiceNo || "",
    customerName: initialValues?.customerName || "",
    company: initialValues?.company || "",
    amount: initialValues?.amount ?? "",
    gst: initialValues?.gst ?? "",
    total: initialValues?.total ?? "",
    status: initialValues?.status || "PENDING",
    dueDate: initialValues?.dueDate ? new Date(initialValues.dueDate).toISOString().slice(0, 10) : "",
    leadId: initialValues?.leadId || "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const calculatedTotal = useMemo(() => {
    const amount = Number(form.amount || 0);
    const gst = Number(form.gst || 0);
    return amount + gst;
  }, [form.amount, form.gst]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => {
      const next = { ...current, [name]: value };
      if (name === "amount" || name === "gst") {
        const amount = Number(name === "amount" ? value : next.amount || 0);
        const gst = Number(name === "gst" ? value : next.gst || 0);
        next.total = Number.isFinite(amount + gst) ? String(amount + gst) : "";
      }
      return next;
    });
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!required(form.invoiceNo)) nextErrors.invoiceNo = "Invoice number is required";
    if (!required(form.customerName)) nextErrors.customerName = "Customer name is required";
    if (!required(form.amount) || Number(form.amount) <= 0) nextErrors.amount = "Amount must be greater than 0";
    if (form.gst !== "" && Number(form.gst) < 0) nextErrors.gst = "GST cannot be negative";
    if (!required(form.total) || Number(form.total) <= 0) nextErrors.total = "Total must be greater than 0";
    if (!statuses.includes(form.status)) nextErrors.status = "Select a valid status";
    if (!required(form.dueDate)) nextErrors.dueDate = "Due date is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await onSubmit({
        ...form,
        amount: Number(form.amount),
        gst: Number(form.gst || 0),
        total: Number(form.total || calculatedTotal),
        leadId: form.leadId || null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="rounded-md border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Invoice No</span>
          <input className={`field ${errors.invoiceNo ? "field-error" : ""}`} name="invoiceNo" onChange={handleChange} placeholder="INV-1001" value={form.invoiceNo} />
          {errors.invoiceNo && <span className="error-text">{errors.invoiceNo}</span>}
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Customer Name</span>
          <input className={`field ${errors.customerName ? "field-error" : ""}`} name="customerName" onChange={handleChange} placeholder="Rahul Kumar" value={form.customerName} />
          {errors.customerName && <span className="error-text">{errors.customerName}</span>}
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Company</span>
          <input className="field" name="company" onChange={handleChange} placeholder="ABC Pvt Ltd" value={form.company} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Lead ID</span>
          <input className="field" name="leadId" onChange={handleChange} placeholder="Optional converted lead ID" value={form.leadId} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Amount</span>
          <input className={`field ${errors.amount ? "field-error" : ""}`} min="0" name="amount" onChange={handleChange} placeholder="25000" step="0.01" type="number" value={form.amount} />
          {errors.amount && <span className="error-text">{errors.amount}</span>}
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">GST</span>
          <input className={`field ${errors.gst ? "field-error" : ""}`} min="0" name="gst" onChange={handleChange} placeholder="4500" step="0.01" type="number" value={form.gst} />
          {errors.gst && <span className="error-text">{errors.gst}</span>}
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Total</span>
          <input className={`field ${errors.total ? "field-error" : ""}`} min="0" name="total" onChange={handleChange} step="0.01" type="number" value={form.total} />
          {errors.total && <span className="error-text">{errors.total}</span>}
        </label>
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
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Due Date</span>
          <input className={`field ${errors.dueDate ? "field-error" : ""}`} name="dueDate" onChange={handleChange} type="date" value={form.dueDate} />
          {errors.dueDate && <span className="error-text">{errors.dueDate}</span>}
        </label>
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
