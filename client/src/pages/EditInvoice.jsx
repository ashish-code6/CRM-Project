import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import InvoiceForm from "../components/InvoiceForm";
import Loader from "../components/Loader";
import { getInvoiceById, updateInvoice } from "../services/invoice.service";

export default function EditInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    getInvoiceById(id)
      .then(setInvoice)
      .catch((error) => toast.error(error.response?.data?.message || "Could not load invoice"));
  }, [id]);

  const handleSubmit = async (payload) => {
    try {
      await updateInvoice(id, payload);
      toast.success("Invoice updated");
      navigate("/billing");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  if (!invoice) return <Loader label="Loading invoice" />;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Edit Invoice</h2>
        <p className="mt-1 text-sm text-slate-500">Update invoice details and payment status.</p>
      </div>
      <InvoiceForm initialValues={invoice} onSubmit={handleSubmit} submitLabel="Update Invoice" />
    </div>
  );
}
