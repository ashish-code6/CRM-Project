import { useEffect, useState } from "react";
import { BriefcaseBusiness, CheckCircle2, ClipboardList, UserCheck } from "lucide-react";
import DashboardCard from "../components/DashboardCard";
import Loader from "../components/Loader";
import { getDashboardStats } from "../services/dashboard.service";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => setStats({}));
  }, []);

  if (!stats) return <Loader label="Loading dashboard" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">A quick view of your CRM pipeline.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Total Leads" value={stats.totalLeads} icon={BriefcaseBusiness} tone="slate" />
        <DashboardCard title="New Leads" value={stats.newLeads} icon={ClipboardList} tone="teal" />
        <DashboardCard title="Assigned Leads" value={stats.assignedLeads} icon={UserCheck} tone="amber" />
        <DashboardCard title="Converted" value={stats.convertedLeads} icon={CheckCircle2} tone="rose" />
      </div>
    </div>
  );
}
