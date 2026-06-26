export default function DashboardCard({ title, value, icon: Icon, tone = "teal" }) {
  const tones = {
    teal: "bg-teal-50 text-teal-700 ring-teal-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  };

  return (
    <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">{value ?? 0}</p>
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-md ring-1 ${tones[tone]}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
