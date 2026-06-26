import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import Loader from "../components/Loader";
import { getCurrentUser, getProfile } from "../services/auth.service";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    getProfile().then(setProfile).catch(() => setProfile({ user }));
  }, []);

  const user = profile?.user || getCurrentUser();

  if (!profile) return <Loader label="Loading profile" />;

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Profile</h2>
        <p className="mt-1 text-sm text-slate-500">Your current authenticated session.</p>
      </div>
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-md bg-teal-50 text-teal-700">
            <ShieldCheck size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">Signed in as</p>
            <p className="mt-1 break-words text-lg font-semibold text-slate-950">{user?.name || "CRM User"}</p>
            <p className="mt-1 break-all text-sm text-slate-500">{user?.email || user?.id}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Role</p>
                <p className="mt-1 font-medium text-slate-950">{user?.role || "-"}</p>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">User ID</p>
                <p className="mt-1 break-all text-sm font-medium text-slate-950">{user?.id || "-"}</p>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</p>
                <p className="mt-1 font-medium text-emerald-700">Authenticated</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
