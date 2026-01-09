import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getUserProfile } from "../api/auth";
import api from "../api/axios";
import { parseJwt } from "../api/jwt";
import toast, { Toaster } from 'react-hot-toast';
import { User, Weight, Ruler, Calendar, Save, Trash2, ArrowLeft } from "lucide-react";

export default function Profile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        age: 0,
        weight: 0,
        height: 0,
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const token = localStorage.getItem("st_token");
                if (!token) return navigate("/login");
                const user = parseJwt(token);
                if (!user?.sub) return;

                const data = await getUserProfile(parseInt(user.sub));
                setForm({
                    name: data.name,
                    email: data.email,
                    age: data.age,
                    weight: data.weight,
                    height: data.height,
                });
            } catch (err) {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem("st_token");
            const user = parseJwt(token || "");
            if (!user?.sub) return;

            await api.put(`/v1/users/${user.sub}`, form);
            toast.success("Profile updated successfully!");
        } catch (err) {
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Navbar />
            <Toaster position="bottom-center" />
            <main className="min-h-screen pt-28 pb-12 px-4 max-w-4xl mx-auto">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8 font-bold"
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Sidebar info */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-black rounded-[2.5rem] p-8 text-white shadow-xl">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                <User size={32} />
                            </div>
                            <h1 className="text-2xl font-black mb-2">{form.name}</h1>
                            <p className="text-white/60 text-sm mb-6">{form.email}</p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center"><Weight size={16} /></div>
                                    <span className="text-sm font-bold">{form.weight} kg</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center"><Ruler size={16} /></div>
                                    <span className="text-sm font-bold">{form.height} cm</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 italic text-red-600 text-xs text-center font-medium">
                            Updating your profile updates your BMI calculations and TDEE suggestions in real-time.
                        </div>
                    </div>

                    {/* Form */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100">
                            <h2 className="text-3xl font-black text-gray-900 mb-8">Account Settings</h2>

                            {loading ? (
                                <div className="space-y-4">
                                    <div className="h-12 bg-gray-50 rounded-2xl animate-pulse" />
                                    <div className="h-12 bg-gray-50 rounded-2xl animate-pulse" />
                                    <div className="h-12 bg-gray-50 rounded-2xl animate-pulse" />
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Display Name</label>
                                            <input
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all font-bold"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email (Read Only)</label>
                                            <input
                                                disabled
                                                value={form.email}
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-100 border border-transparent text-gray-400 font-medium cursor-not-allowed"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Current Weight (kg)</label>
                                            <div className="relative">
                                                <Weight className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type="number"
                                                    name="weight"
                                                    value={form.weight}
                                                    onChange={handleChange}
                                                    className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all font-bold"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Height (cm)</label>
                                            <div className="relative">
                                                <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type="number"
                                                    name="height"
                                                    value={form.height}
                                                    onChange={handleChange}
                                                    className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all font-bold"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Age</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type="number"
                                                    name="age"
                                                    value={form.age}
                                                    onChange={handleChange}
                                                    className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-4 focus:ring-black/5 focus:border-black outline-none transition-all font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100 mt-8 flex flex-col sm:flex-row gap-4">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="flex-1 py-5 rounded-3xl bg-black text-white font-black text-lg shadow-2xl hover:bg-gray-800 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                                        >
                                            <Save size={20} />
                                            {saving ? "Saving Changes..." : "Update Profile"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => toast.error("Account deletion is not available in demo.")}
                                            className="px-8 py-5 rounded-3xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Trash2 size={20} />
                                            Delete
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
