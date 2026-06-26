import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import LeadTable from "../components/LeadTable";
import Loader from "../components/Loader";
import { deleteLead, getLeads } from "../services/lead.service";
import { getCurrentUser } from "../services/auth.service";
import { canCreateLeads, canDeleteLeads } from "../utils/permissions";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    let active = true;

    getLeads()
      .then((data) => {
        if (active) setLeads(data);
      })
      .catch((error) => toast.error(error.response?.data?.message || "Could not load leads"))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    try {
      await deleteLead(id);
      toast.success("Lead deleted");
      setLeads((current) => current.filter((lead) => lead.id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Leads</h2>
          <p className="mt-1 text-sm text-slate-500">Track contacts, companies, and conversion status.</p>
        </div>
        {canCreateLeads(user) && (
          <Link className="btn-primary" to="/leads/create">
            <Plus size={17} />
            New Lead
          </Link>
        )}
      </div>
      {loading ? <Loader label="Loading leads" /> : <LeadTable canDelete={canDeleteLeads(user)} leads={leads} onDelete={handleDelete} />}
    </div>
  );
}
