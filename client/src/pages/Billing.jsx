import { useEffect, useState } from "react";
import { Download, Edit, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import { getCurrentUser } from "../services/auth.service";
import { deleteInvoice, downloadInvoicePdf, getInvoices } from "../services/invoice.service";
import { canDeleteInvoices } from "../utils/permissions";

const statusClass = {
  PAID: "bg-emerald-50 text-emerald-700",
  PENDING: "bg-amber-50 text-amber-700",
  OVERDUE: "bg-rose-50 text-rose-700",
};

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

export default function Billing() {
  const user = getCurrentUser();
  const [invoices, setInvoices] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getInvoices({ page, limit: 10, search })
      .then((result) => {
        if (active) {
          setInvoices(result.data || []);
          setPagination(result.pagination);
        }
      })
      .catch((error) => toast.error(error.response?.data?.message || "Could not load invoices"))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;
    try {
      await deleteInvoice(id);
      toast.success("Invoice deleted");
      setInvoices((current) => current.filter((invoice) => invoice.id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const handleDownload = async (invoice) => {
    try {
      const response = await downloadInvoicePdf(invoice.id);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoice.invoiceNo.replace(/[^a-z0-9_-]+/gi, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error.response?.data?.message || "Download failed");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Billing</h2>
          <p className="mt-1 text-sm text-slate-500">Create invoices and track paid, pending, and overdue payments.</p>
        </div>
        <Link className="btn-primary" to="/billing/create">
          <Plus size={17} />
          New Invoice
        </Link>
      </div>
      <label className="relative block max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          className="field pl-10"
          onChange={(event) => {
            setPage(1);
            setSearch(event.target.value);
          }}
          placeholder="Search invoice, customer, company, or status"
          value={search}
        />
      </label>
      {loading ? (
        <Loader label="Loading invoices" />
      ) : (
        <>
          <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    {["Invoice", "Customer", "Amount", "GST", "Total", "Status", "Due Date", "Actions"].map((head) => (
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500" key={head}>
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((invoice) => (
                    <tr className="hover:bg-slate-50" key={invoice.id}>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-950">{invoice.invoiceNo}</td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-slate-900">{invoice.customerName}</p>
                        <p className="text-sm text-slate-500">{invoice.company || "-"}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">{money(invoice.amount)}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{money(invoice.gst)}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">{money(invoice.total)}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[invoice.status] || "bg-slate-100 text-slate-700"}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "-"}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Link className="icon-btn" to={`/billing/${invoice.id}/edit`} aria-label={`Edit ${invoice.invoiceNo}`}>
                            <Edit size={16} />
                          </Link>
                          <button className="icon-btn text-teal-700 hover:bg-teal-50" onClick={() => handleDownload(invoice)} type="button" aria-label={`Download ${invoice.invoiceNo}`}>
                            <Download size={16} />
                          </button>
                          {canDeleteInvoices(user) && (
                            <button className="icon-btn text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(invoice.id)} type="button" aria-label={`Delete ${invoice.invoiceNo}`}>
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
            {!invoices.length && <p className="p-5 text-sm text-slate-500">No invoices found.</p>}
          </div>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
