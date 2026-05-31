import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login(form.usernameOrEmail, form.password);
      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.error || "Login gagal. Periksa kembali data kamu.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-center items-start p-12">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-900" />
        <div
          className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #63cf8b 0%, transparent 70%)",
            transform: "translate(-30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #5b9cf6 0%, transparent 70%)",
            transform: "translate(30%, 30%)",
          }}
        />

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="absolute top-6 left-6 z-10 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #63cf8b, #5b9cf6)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-display font-bold text-xl text-white">
              CashFlow
            </span>
          </div>
        </div>

        <div className="relative z-10 ">
          <p
            className="font-display text-6xl font-800 leading-none text-white mb-6"
            style={{ fontWeight: 800 }}
          >
            Kelola
            <br />
            <span style={{ color: "#63cf8b" }}>Uang</span>
            <br />
            Lebih
            <br />
            Cerdas.
          </p>
          <p className="text-dark-200 text-lg leading-relaxed font-light">
            Catat pemasukan & pengeluaran,
            <br />
            pantau saldo, dan buat keputusan
            <br />
            finansial yang lebih baik.
          </p>
        </div>

        {/* <div className="relative z-10 flex gap-8 animate-fade-in-up delay-300">
          <div>
            <p className="font-display text-3xl font-bold text-white">100%</p>
            <p className="text-dark-300 text-sm">Privasi Terjaga</p>
          </div>
          <div>
            <p className="font-display text-3xl font-bold text-white">Real-time</p>
            <p className="text-dark-300 text-sm">Update Saldo</p>
          </div>
        </div> */}
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in-up delay-100">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #63cf8b, #5b9cf6)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-display font-bold text-xl text-white">
              CashFlow
            </span>
          </div>

          <h2 className="font-display text-3xl font-bold text-white mb-2">
            Selamat datang
          </h2>
          <p className="text-dark-200 mb-10">
            Masuk untuk melihat dashboard keuangan kamu
          </p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-accent-red text-sm flex items-center gap-2 animate-fade-in">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-dark-100 text-sm font-medium mb-2">
                Username / Email
              </label>
              <input
                type="text"
                value={form.usernameOrEmail}
                onChange={(e) =>
                  setForm({ ...form, usernameOrEmail: e.target.value })
                }
                placeholder="masukkan username atau email"
                className="w-full px-4 py-3.5 rounded-xl text-white placeholder-dark-300 text-sm outline-none transition-all duration-200 focus:ring-2"
                style={{
                  background: "#111118",
                  border: "1px solid #2a2a3a",
                  focusBorderColor: "#63cf8b",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#63cf8b")}
                onBlur={(e) => (e.target.style.borderColor = "#2a2a3a")}
                required
              />
            </div>

            <div>
              <label className="block text-dark-100 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="masukkan password"
                  className="w-full px-4 py-3.5 rounded-xl text-white placeholder-dark-300 text-sm outline-none transition-all duration-200 pr-12"
                  style={{ background: "#111118", border: "1px solid #2a2a3a" }}
                  onFocus={(e) => (e.target.style.borderColor = "#63cf8b")}
                  onBlur={(e) => (e.target.style.borderColor = "#2a2a3a")}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-300 hover:text-white transition-colors"
                >
                  {showPass ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-display font-semibold text-dark-900 text-sm transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{
                background: loading
                  ? "#404050"
                  : "linear-gradient(135deg, #63cf8b, #5b9cf6)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Masuk...
                </span>
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </form>

          <p className="text-center text-dark-300 text-sm mt-8">
            Belum punya akun?{" "}
            <Link
              to="/signup"
              className="text-accent-green hover:underline font-medium"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
