import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LeadForm from "../components/LeadForm";
import { createLead } from "../services/lead.service";
import { getCurrentUser } from "../services/auth.service";
import { canCreateLeads } from "../utils/permissions";

export default function CreateLead() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  if (!canCreateLeads(user)) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">Access denied</h2>
        <p className="mt-2 text-sm text-slate-500">Sales users cannot create leads.</p>
      </div>
    );
  }

  const handleSubmit = async (payload) => {
    try {
      await createLead(payload);
      toast.success("Lead created");
      navigate("/leads");
    } catch (error) {
      toast.error(error.response?.data?.message || "Create failed");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Create Lead</h2>
        <p className="mt-1 text-sm text-slate-500">Add a new opportunity to the CRM pipeline.</p>
      </div>
      <LeadForm onSubmit={handleSubmit} submitLabel="Create Lead" />
    </div>
  );
}
