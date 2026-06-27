import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import InvoiceForm from "../components/InvoiceForm";
import { createInvoice } from "../services/invoice.service";

export default function CreateInvoice() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    try {
      await createInvoice(payload);
      toast.success("Invoice created");
      navigate("/billing");
    } catch (error) {
      toast.error(error.response?.data?.message || "Create failed");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Create Invoice</h2>
        <p className="mt-1 text-sm text-slate-500">Generate an invoice for a converted lead or direct customer.</p>
      </div>
      <InvoiceForm onSubmit={handleSubmit} submitLabel="Create Invoice" />
    </div>
  );
}
