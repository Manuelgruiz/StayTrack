import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { addExercise } from "../api/tracker";
import { parseJwt } from "../api/jwt";
import toast, { Toaster } from 'react-hot-toast';

export default function AddWorkout() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        exercise_name: "",
        duration_min: "",
        calories_burned: "",
        date: new Date().toISOString().split("T")[0],
    });

    useEffect(() => {
        const token = localStorage.getItem("st_token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("st_token");
            if (!token) throw new Error("No token found");
            const user = parseJwt(token);
            const userId = user?.sub;

            if (!userId) {
                toast.error("User ID not found in token");
                return;
            }

            await addExercise(parseInt(userId), {
                date: formData.date,
                exercise_name: formData.exercise_name,
                duration_min: parseFloat(formData.duration_min),
                calories_burned: parseFloat(formData.calories_burned),
            });

            toast.success("Workout logged successfully!");
            setFormData({
                exercise_name: "",
                duration_min: "",
                calories_burned: "",
                date: new Date().toISOString().split("T")[0],
            });
            setTimeout(() => navigate("/dashboard"), 1500);

        } catch (err) {
            console.error(err);
            toast.error("Failed to log workout");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <Toaster position="bottom-center" />
            <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center items-center bg-gray-50">
                <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
                            Log Workout
                        </h1>
                        <p className="text-gray-500 mt-2">Every calorie counts. Keep pushing!</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Name</label>
                            <input
                                type="text"
                                name="exercise_name"
                                required
                                placeholder="e.g., Running, Weightlifting"
                                value={formData.exercise_name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                                <input
                                    type="number"
                                    name="duration_min"
                                    required
                                    min="1"
                                    placeholder="30"
                                    value={formData.duration_min}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Calories Burned</label>
                                <input
                                    type="number"
                                    name="calories_burned"
                                    required
                                    min="0"
                                    placeholder="0"
                                    value={formData.calories_burned}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Logging...</span>
                                </div>
                            ) : (
                                "Log Workout"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
