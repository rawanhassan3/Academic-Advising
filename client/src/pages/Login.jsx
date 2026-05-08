import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

// Maps role → its home dashboard route
const ROLE_HOME = { student: "/student", advisor: "/advisor", admin: "/admin" };

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", form);
      login(res.data, res.data.token);
      // Role-based redirect
      const destination = ROLE_HOME[res.data.role] || "/student";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 font-sans overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-login.jpg')", filter: "brightness(0.55)" }}
      />

      <div className="relative z-10 w-full max-w-[480px] bg-white/85 backdrop-blur-md rounded-[28px] shadow-2xl flex flex-col items-center p-8 animate-in fade-in zoom-in duration-700">
        {/* Logo */}
        <div className="mb-6 w-full flex flex-col items-center">
          <img src="/msa-logo.png" alt="MSA University" className="h-20 object-contain mb-3" />
          <h1 className="text-2xl font-extrabold text-[#c8922a]">MSA University</h1>
          <p className="text-base font-bold text-[#1e3a5f]">Faculty of Computer Science</p>
          <p className="text-xs font-semibold text-[#1e3a5f]/70 mt-0.5 uppercase tracking-widest">Academic Advising System</p>
        </div>

        {error && (
          <div className="w-full mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wide">Email or University ID</label>
            <input type="text" name="email" placeholder="Email or 6-digit ID" required
              autoComplete="username"
              className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all font-medium"
              value={form.email} onChange={handleChange} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wide">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••••••" required
                autoComplete="current-password"
                className="w-full px-5 py-3.5 pr-12 bg-[#f0f4f9] border border-gray-300 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all font-medium"
                value={form.password} onChange={handleChange} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1e3a5f] transition-colors">
                {showPassword ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 bg-[#1e3a5f] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-[#163050] active:scale-[0.98] transition-all shadow-xl shadow-blue-900/20 disabled:opacity-70 flex items-center justify-center gap-2">
            {loading && <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>}
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <div className="mt-6 text-center w-full space-y-3">
          <Link to="/register" className="text-xs text-[#1e7fc0] font-bold hover:underline uppercase tracking-widest">
            New Student? Create Account
          </Link>
          <div className="h-px w-full bg-gray-100" />
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">
            For support, contact the Faculty IT Department
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
