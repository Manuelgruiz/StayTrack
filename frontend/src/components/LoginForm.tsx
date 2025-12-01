import { useState } from "react";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";  

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
     
      await login(email, password);
      nav("/dashboard");
    } catch (error: any) {
      console.error(error);
      setErr("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl p-6 shadow-soft w-full max-w-sm"
    >
      <h2 className="text-xl font-semibold mb-1">Welcome back</h2>
      <p className="text-sm text-gray-500 mb-4">Log in to continue</p>

      {err && <div className="text-red-600 text-sm mb-3">{err}</div>}

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 rounded-xl border border-black/10 mb-3 outline-none focus:ring-2 focus:ring-fitnessAccent"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 rounded-xl border border-black/10 mb-4 outline-none focus:ring-2 focus:ring-fitnessAccent"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        disabled={loading}
        className="w-full py-3 rounded-full bg-fitnessAccent text-white hover:brightness-110 transition flex items-center justify-center gap-2"
      >
        <LogIn size={18} />
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
