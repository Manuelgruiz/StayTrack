import { useState } from "react";
import { UserPlus } from "lucide-react";
import api from "../api/axios";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    weight: "",
    height: "",
  });
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setOk("");
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        age: Number(form.age),
        weight: Number(form.weight),
        height: Number(form.height),
      };
      const res = await api.post("/users/", payload);
      setOk(`User created: ${res.data.name}`);
      setForm({ name: "", email: "", age: "", weight: "", height: "" });
    } catch (e: any) {
      setErr("Error creating user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl p-6 shadow-soft w-full max-w-md"
    >
      <h2 className="text-xl font-semibold mb-1">Create account</h2>
      <p className="text-sm text-gray-500 mb-4">Start tracking your progress</p>

      {ok && <div className="text-green-600 text-sm mb-3">{ok}</div>}
      {err && <div className="text-red-600 text-sm mb-3">{err}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={onChange}
          className="p-3 rounded-xl border border-black/10 outline-none focus:ring-2 focus:ring-fitnessAccent"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          className="p-3 rounded-xl border border-black/10 outline-none focus:ring-2 focus:ring-fitnessAccent"
          required
        />
        <input
          name="age"
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={onChange}
          className="p-3 rounded-xl border border-black/10 outline-none focus:ring-2 focus:ring-fitnessAccent"
          required
        />
        <input
          name="weight"
          type="number"
          placeholder="Weight (kg)"
          value={form.weight}
          onChange={onChange}
          className="p-3 rounded-xl border border-black/10 outline-none focus:ring-2 focus:ring-fitnessAccent"
          required
        />
        <input
          name="height"
          type="number"
          placeholder="Height (cm)"
          value={form.height}
          onChange={onChange}
          className="p-3 rounded-xl border border-black/10 outline-none focus:ring-2 focus:ring-fitnessAccent md:col-span-2"
          required
        />
      </div>

      <button
        disabled={loading}
        className="w-full mt-4 py-3 rounded-full bg-fitnessAccent text-white hover:brightness-110 transition flex items-center justify-center gap-2"
      >
        <UserPlus size={18} />
        {loading ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}
