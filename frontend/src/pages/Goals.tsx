import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getGoals, updateGoals, type Goal } from "../api/goals";
import { getUserProfile } from "../api/auth";
import { parseJwt } from "../api/jwt";
import toast, { Toaster } from 'react-hot-toast';
import { Activity, Flame, Save, Sparkles, User, Info, Calculator, Check } from "lucide-react";

export default function Goals() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [goals, setGoals] = useState<Goal>({
        kcal_per_day: 2000,
        protein_g: 150,
        fat_g: 70,
        carbs_g: 250,
        exercise_min_per_week: 150,
        target_weight: 70,
    });

    // Calculation State
    const [activity, setActivity] = useState("sedentary");
    const [objective, setObjective] = useState("maintain");

    useEffect(() => {
        const fn = async () => {
            try {
                const token = localStorage.getItem("st_token");
                if (!token) return navigate("/login");
                const user = parseJwt(token);
                if (!user?.sub) return;
                const uid = parseInt(user.sub);

                const [goalsData, profileData] = await Promise.all([
                    getGoals(uid),
                    getUserProfile(uid)
                ]);

                if (goalsData) setGoals(goalsData);
                setUserProfile(profileData);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load your profile");
            } finally {
                setLoading(false);
            }
        };
        fn();
    }, [navigate]);

    const handleSmartCalculate = () => {
        if (!userProfile) return;

        // BMR (Mifflin-St Jeor)
        // Assuming male for default if not specified, 
        // but we can try to be neutral or use a generic factor
        const { weight, height, age } = userProfile;
        let bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;

        const activityMultipliers: any = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            very: 1.725
        };

        let tdee = bmr * (activityMultipliers[activity] || 1.2);

        if (objective === "lose") tdee -= 500;
        if (objective === "gain") tdee += 300;

        const kcal = Math.round(tdee);

        // Macro split suggested (40% Carbs, 30% Protein, 30% Fat)
        const p = Math.round((kcal * 0.3) / 4);
        const f = Math.round((kcal * 0.3) / 9);
        const c = Math.round((kcal * 0.4) / 4);

        setGoals({
            ...goals,
            kcal_per_day: kcal,
            protein_g: p,
            fat_g: f,
            carbs_g: c,
        });

        toast.success("New goals calculated! Don't forget to save.", {
            icon: '✨',
            duration: 4000
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGoals({ ...goals, [e.target.name]: parseFloat(e.target.value) || 0 });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem("st_token");
            const user = parseJwt(token || "");
            if (!user?.sub) throw new Error("User not found");

            await updateGoals(parseInt(user.sub), goals);
            toast.success("Settings saved successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update goals");
        } finally {
            setSaving(false);
        }
    };

    const OptionBtn = ({ label, active, onClick }: any) => (
        <button
            type="button"
            onClick={onClick}
            className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${active
                ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                }`}
        >
            {label}
        </button>
    );

    return (
        <>
            <Navbar />
            <Toaster position="bottom-center" />
            <main className="min-h-screen pt-24 pb-12 px-4 max-w-6xl mx-auto bg-gray-50/50">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full">Settings</span>
                            <Sparkles className="text-yellow-500" size={16} />
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight">Set Your Path</h1>
                        <p className="text-gray-500 mt-2 text-lg font-medium">Fine-tune your targets for peak performance.</p>
                    </div>

                    {/* User Mini Profile Card */}
                    {userProfile && (
                        <div className="bg-white px-6 py-4 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Profile</p>
                                <p className="font-bold text-gray-800">{userProfile.weight}kg • {userProfile.height}cm • {userProfile.age}y</p>
                            </div>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="w-full h-96 bg-gray-200/50 rounded-[3rem] animate-pulse" />
                ) : (
                    <div className="grid lg:grid-cols-5 gap-8">

                        {/* Smart Calculator Panel */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[3rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-3 bg-white/20 rounded-2xl"><Calculator size={24} /></div>
                                        <h2 className="text-2xl font-bold">Goal Assistant</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest opacity-70 mb-3">Activity Level</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <OptionBtn label="Sedentary" active={activity === 'sedentary'} onClick={() => setActivity('sedentary')} />
                                                <OptionBtn label="Moderate" active={activity === 'moderate'} onClick={() => setActivity('moderate')} />
                                                <OptionBtn label="Active" active={activity === 'very'} onClick={() => setActivity('very')} />
                                                <OptionBtn label="Very Active" active={activity === 'pro'} onClick={() => setActivity('pro')} />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest opacity-70 mb-3">Your Objective</label>
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => setObjective('lose')}
                                                    className={`p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${objective === 'lose' ? 'bg-white text-indigo-600 border-white font-bold' : 'border-white/10 text-white/70 hover:bg-white/5'}`}
                                                >
                                                    <span>Weight Loss</span>
                                                    {objective === 'lose' && <Check size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => setObjective('maintain')}
                                                    className={`p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${objective === 'maintain' ? 'bg-white text-indigo-600 border-white font-bold' : 'border-white/10 text-white/70 hover:bg-white/5'}`}
                                                >
                                                    <span>Maintain Weight</span>
                                                    {objective === 'maintain' && <Check size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => setObjective('gain')}
                                                    className={`p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${objective === 'gain' ? 'bg-white text-indigo-600 border-white font-bold' : 'border-white/10 text-white/70 hover:bg-white/5'}`}
                                                >
                                                    <span>Muscle Gain</span>
                                                    {objective === 'gain' && <Check size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleSmartCalculate}
                                            className="w-full py-5 rounded-[2rem] bg-indigo-400 hover:bg-white hover:text-indigo-600 text-white font-black text-lg transition-all shadow-xl active:scale-95"
                                        >
                                            Calculate Targets
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-start gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                    <Info size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">Pro Tip</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed mt-1">Sustainability is key. Avoid drastic deficits; 200-500 kcal is a safe range for long-term success.</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Form Panel */}
                        <div className="lg:col-span-3">
                            <form onSubmit={handleSubmit} className="space-y-8">

                                {/* Nutrition Targets */}
                                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-10">
                                        <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
                                            <Flame size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-gray-800">Daily Fuel</h2>
                                            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Nutritional Benchmarks</p>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-8">
                                        <div className="sm:col-span-2 bg-gray-50 p-6 rounded-[2rem] border border-gray-100 transition-focus-within focus-within:ring-4 focus-within:ring-orange-500/10">
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Calories Limit (kcal)</label>
                                            <input
                                                type="number"
                                                name="kcal_per_day"
                                                value={goals.kcal_per_day}
                                                onChange={handleChange}
                                                className="w-full bg-transparent text-4xl font-black text-gray-800 outline-none"
                                            />
                                        </div>

                                        <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Protein (g)</label>
                                            <input
                                                type="number"
                                                name="protein_g"
                                                value={goals.protein_g}
                                                onChange={handleChange}
                                                className="w-full bg-transparent text-2xl font-black text-blue-600 outline-none"
                                            />
                                        </div>

                                        <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Fats (g)</label>
                                            <input
                                                type="number"
                                                name="fat_g"
                                                value={goals.fat_g}
                                                onChange={handleChange}
                                                className="w-full bg-transparent text-2xl font-black text-pink-600 outline-none"
                                            />
                                        </div>

                                        <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Carbs (g)</label>
                                            <input
                                                type="number"
                                                name="carbs_g"
                                                value={goals.carbs_g}
                                                onChange={handleChange}
                                                className="w-full bg-transparent text-2xl font-black text-yellow-600 outline-none"
                                            />
                                        </div>

                                        <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Target Weight (kg)</label>
                                            <input
                                                type="number"
                                                name="target_weight"
                                                value={goals.target_weight}
                                                onChange={handleChange}
                                                className="w-full bg-transparent text-2xl font-black text-emerald-600 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Fitness Targets */}
                                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                            <Activity size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-gray-800">Activity</h2>
                                            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Exercise Commitments</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Training Minutes Per Week</label>
                                        <div className="flex items-baseline gap-2">
                                            <input
                                                type="number"
                                                name="exercise_min_per_week"
                                                value={goals.exercise_min_per_week}
                                                onChange={handleChange}
                                                className="bg-transparent text-3xl font-black text-gray-800 outline-none w-32"
                                            />
                                            <span className="text-gray-400 font-bold">minutes</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full py-6 rounded-[2.5rem] bg-black text-white font-black text-xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-3"
                                >
                                    {saving ? "Syncing..." : <><Save size={24} /> Save My Targets</>}
                                </button>
                            </form>
                        </div>

                    </div>
                )}
            </main>
        </>
    );
}
