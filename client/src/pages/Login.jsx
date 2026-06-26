import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { getToken, login } from "../services/auth.service";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (getToken()) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success("Welcome back");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-950 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden overflow-hidden lg:block">
        <img className="h-full w-full object-cover opacity-80" src="/src/assets/hero.png" alt="CRM dashboard workspace" />
        <div className="absolute inset-0 bg-slate-950/45" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <h1 className="max-w-xl text-5xl font-semibold tracking-normal">CRM System</h1>
          <p className="mt-4 max-w-lg text-lg text-slate-100">Manage leads, measure pipeline progress, and keep every opportunity moving.</p>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10 sm:px-6">
        <form className="w-full max-w-md rounded-md bg-white p-6 shadow-2xl" onSubmit={handleSubmit}>
          <div className="mb-8">
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-md bg-teal-600 text-white">
              <LockKeyhole size={22} />
            </div>
            <h2 className="text-2xl font-semibold text-slate-950">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">Use your backend-created account to access the CRM.</p>
          </div>
          <div className="space-y-4">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input className="field" onChange={(e) => setForm({ ...form, email: e.target.value })} required type="email" value={form.email} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input className="field" onChange={(e) => setForm({ ...form, password: e.target.value })} required type="password" value={form.password} />
            </label>
          </div>
          <button className="btn-primary mt-6 w-full justify-center" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Login"}
            <ArrowRight size={17} />
          </button>
        </form>
      </section>
    </main>
  );
}
