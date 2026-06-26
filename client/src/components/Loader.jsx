export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex min-h-48 items-center justify-center">
      <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>
    </div>
  );
}
