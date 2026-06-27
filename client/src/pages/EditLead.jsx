import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import LeadForm from "../components/LeadForm";
import Loader from "../components/Loader";
import { assignLead, getLeadById, updateLead } from "../services/lead.service";
import { getCurrentUser } from "../services/auth.service";
import { getUsers } from "../services/user.service";
import { canAssignLeads } from "../utils/permissions";

export default function EditLead() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [salesUsers, setSalesUsers] = useState([]);
  const user = getCurrentUser();
  const canAssign = canAssignLeads(user);

  useEffect(() => {
    getLeadById(id)
      .then(setLead)
      .catch((error) => toast.error(error.response?.data?.message || "Could not load lead"));
  }, [id]);

  useEffect(() => {
    if (!canAssign) return;

    getUsers({ role: "SALES", all: true })
      .then((result) => setSalesUsers((result.data || []).filter((item) => item.role === "SALES")))
      .catch(() => setSalesUsers([]));
  }, [canAssign]);

  const handleSubmit = async (payload) => {
    try {
      const { assignedToId, ...leadPayload } = payload;
      const nextPayload = user?.role === "SALES" ? { status: leadPayload.status } : leadPayload;
      await updateLead(id, nextPayload);
      if (canAssign && assignedToId && assignedToId !== lead.assignedToId) {
        await assignLead(id, assignedToId);
      }
      toast.success("Lead updated");
      navigate("/leads");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  if (!lead) return <Loader label="Loading lead" />;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Edit Lead</h2>
      <p className="mt-1 text-sm text-slate-500">
        {user?.role === "SALES" ? "Update the status of your assigned lead." : "Update contact details, assignment, and pipeline status."}
      </p>
      </div>
      <LeadForm
        initialValues={lead}
        assignmentOptions={salesUsers}
        onSubmit={handleSubmit}
        readOnlyDetails={user?.role === "SALES"}
        showAssignment={canAssign}
        showStatus
        submitLabel="Update Lead"
      />
    </div>
  );
}
