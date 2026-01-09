import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { addFood } from "../api/tracker";
import { parseJwt } from "../api/jwt";
import { searchCatalog, createCatalogFood, type CatalogFood } from "../api/catalog";
import toast, { Toaster } from 'react-hot-toast';
import { Search, Scale, Save, CheckCircle2 } from "lucide-react";

export default function AddMeal() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<CatalogFood[]>([]);
    const [selectedItem, setSelectedItem] = useState<CatalogFood | null>(null);
    const [weight, setWeight] = useState<string>("100");
    const [saveToCatalog, setSaveToCatalog] = useState(false);

    const [formData, setFormData] = useState({
        food_name: "",
        calories: "",
        protein: "",
        fat: "",
        carbs: "",
        date: new Date().toISOString().split("T")[0],
    });

    useEffect(() => {
        const token = localStorage.getItem("st_token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchTerm(val);
        if (val.length > 2) {
            try {
                const results = await searchCatalog(val);
                setSearchResults(results || []);
            } catch (err) {
                console.error(err);
            }
        } else {
            setSearchResults([]);
        }
    };

    const calculateMacros = (food: CatalogFood, grams: number) => {
        const ratio = grams / 100;
        return {
            calories: (food.kcal_100g * ratio).toFixed(1),
            protein: (food.protein_100g * ratio).toFixed(1),
            fat: (food.fat_100g * ratio).toFixed(1),
            carbs: (food.carbs_100g * ratio).toFixed(1),
        };
    };

    const selectFood = (food: CatalogFood) => {
        setSelectedItem(food);
        const defaultWeight = food.grams || 100;
        setWeight(defaultWeight.toString());

        const macros = calculateMacros(food, defaultWeight);
        setFormData({
            ...formData,
            food_name: food.name,
            ...macros
        });

        setSearchTerm("");
        setSearchResults([]);
        setSaveToCatalog(false);
        toast.success(`Selected ${food.name}`);
    };

    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setWeight(val);
        const grams = parseFloat(val);

        if (selectedItem && !isNaN(grams)) {
            const macros = calculateMacros(selectedItem, grams);
            setFormData(prev => ({ ...prev, ...macros }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === "food_name") {
            setSelectedItem(null); // Reset selected item if name is edited manually
        }
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

            // 1. If "Save to Catalog" is checked and it's a manual entry (or we want to update)
            if (saveToCatalog && !selectedItem) {
                const grams = parseFloat(weight) || 100;
                const ratio = 100 / grams;
                try {
                    await createCatalogFood({
                        name: formData.food_name,
                        kcal_100g: parseFloat(formData.calories) * ratio,
                        protein_100g: parseFloat(formData.protein) * ratio,
                        fat_100g: parseFloat(formData.fat) * ratio,
                        carbs_100g: parseFloat(formData.carbs) * ratio,
                        label: "User Added",
                        grams: grams
                    });
                    toast.success("Saved to food database!");
                } catch (catalogErr) {
                    console.error("Failed to save to catalog", catalogErr);
                    // We continue even if saving to catalog fails
                }
            }

            // 2. Add to actual meal tracking
            await addFood(parseInt(userId), {
                date: formData.date,
                food_name: formData.food_name,
                calories: parseFloat(formData.calories),
                protein: parseFloat(formData.protein),
                fat: parseFloat(formData.fat),
                carbs: parseFloat(formData.carbs),
            });

            toast.success("Meal logged successfully!");
            setTimeout(() => navigate("/dashboard"), 1000);

        } catch (err) {
            console.error(err);
            toast.error("Failed to add meal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <Toaster position="bottom-center" />
            <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center bg-gray-50/50">
                <div className="w-full max-w-xl">
                    <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-8 text-white relative">
                            <div className="relative z-10">
                                <h1 className="text-3xl font-bold flex items-center gap-2">
                                    Log Meal
                                </h1>
                                <p className="text-green-50 mt-1 opacity-90">What did you eat today?</p>
                            </div>
                            <div className="absolute top-0 right-0 p-8 hidden sm:block">
                                <div className="w-20 h-20 bg-white/10 rounded-full blur-2xl" />
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Search Section */}
                            <div className="relative z-50">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Search Food Database</label>
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Try 'Apple' or 'Grilled Chicken'..."
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all text-lg"
                                    />
                                </div>

                                {/* Results Dropdown */}
                                {searchResults.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {searchResults.map((f) => (
                                            <button
                                                key={f.id}
                                                onClick={() => selectFood(f)}
                                                className="w-full text-left px-6 py-4 hover:bg-green-50 transition-colors border-b border-gray-100 last:border-0 flex justify-between items-center group"
                                            >
                                                <div>
                                                    <p className="font-bold text-gray-800 group-hover:text-green-700">{f.name}</p>
                                                    <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">{f.label || "Generic"}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-lg font-black text-green-600">{f.kcal_100g}</span>
                                                        <span className="text-xs text-gray-400 font-medium">kcal/100g</span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Scale size={16} /> Quantity
                                    </h2>
                                    {selectedItem && (
                                        <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1">
                                            <CheckCircle2 size={12} /> Linked to database
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={handleWeightChange}
                                        placeholder="100"
                                        className="w-32 px-5 py-4 rounded-2xl bg-white border border-gray-200 focus:ring-4 focus:ring-green-600/10 focus:border-green-600 outline-none transition-all text-xl font-bold"
                                    />
                                    <span className="text-xl font-bold text-gray-400">grams</span>
                                    <div className="flex-1 text-right">
                                        {selectedItem && (
                                            <p className="text-xs text-gray-500 italic">Adjusting weight recalculates macros automatically</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Food Name</label>
                                        <input
                                            type="text"
                                            name="food_name"
                                            required
                                            value={formData.food_name}
                                            onChange={handleChange}
                                            placeholder="E.g. Banana"
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-medium"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Calories (kcal)</label>
                                        <input
                                            type="number"
                                            name="calories"
                                            required
                                            value={formData.calories}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all text-lg font-bold text-green-700"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Protein (g)</label>
                                        <input
                                            type="number"
                                            name="protein"
                                            required
                                            value={formData.protein}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all text-lg font-bold"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Fat (g)</label>
                                        <input
                                            type="number"
                                            name="fat"
                                            required
                                            value={formData.fat}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all text-lg font-bold"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Carbs (g)</label>
                                        <input
                                            type="number"
                                            name="carbs"
                                            required
                                            value={formData.carbs}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all text-lg font-bold"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Date</label>
                                        <input
                                            type="date"
                                            name="date"
                                            required
                                            value={formData.date}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {!selectedItem && formData.food_name.length > 2 && (
                                    <div
                                        onClick={() => setSaveToCatalog(!saveToCatalog)}
                                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${saveToCatalog
                                                ? 'bg-green-50 border-green-500'
                                                : 'bg-gray-50 border-transparent hover:border-gray-200'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${saveToCatalog ? 'bg-green-500 text-white' : 'bg-white border-2 border-gray-300'
                                            }`}>
                                            {saveToCatalog && <Save size={14} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Save to food database</p>
                                            <p className="text-xs text-gray-500">Make this meal available for future searches</p>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 rounded-[2rem] bg-black text-white font-black text-xl shadow-2xl hover:bg-gray-900 hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Submit Log</>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
