import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import StatsChart from "../components/StatsChart";
import { getDailyStats, type DailyStat } from "../api/stats";
import { getFoods, getExercises } from "../api/tracker";
import { getGoals, type Goal } from "../api/goals";
import { getUserProfile } from "../api/auth";
import { parseJwt } from "../api/jwt";
import toast, { Toaster } from 'react-hot-toast';
import { Utensils, Dumbbell, Target, ChevronRight, Zap } from "lucide-react";

type StatItem = { name: string; calories: number };
type FoodItem = { id: number; date: string; food_name: string; calories: number; protein: number; fat: number; carbs: number };
type ExerciseItem = { id: number; date: string; exercise_name: string; duration_min: number; calories_burned: number };

export default function Dashboard() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<StatItem[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [goals, setGoals] = useState<Goal | null>(null);
  const [userProfile, setUserProfile] = useState<{ weight: number } | null>(null);
  const [todayData, setTodayData] = useState({ kcal_in: 0, kcal_out: 0, p: 0, f: 0, c: 0 });
  const [loading, setLoading] = useState(true);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("st_token");
        if (!token) return navigate("/login");
        const user = parseJwt(token);
        if (!user?.sub) return;
        const uid = parseInt(user.sub);

        // 1. Fetch data in parallel
        const [statsRaw, foodsData, exercisesData, goalsData, profileData] = await Promise.all([
          getDailyStats(uid, formatDate(new Date(Date.now() - 6 * 86400000)), formatDate(new Date())),
          getFoods(uid),
          getExercises(uid),
          getGoals(uid),
          getUserProfile(uid)
        ]);

        // 2. Process Chart Data
        const formattedChartData = (statsRaw || []).map((s: DailyStat) => {
          // Use a slash instead of dash to avoid some browser timezone quirks with YYYY-MM-DD
          const d = new Date(s.date.replace(/-/g, '/'));
          return {
            name: d.toLocaleDateString('en-US', { weekday: 'short' }),
            calories: s.kcal_in || 0
          };
        });
        setChartData(formattedChartData);

        // 3. Process Today's Summary
        const todayStr = formatDate(new Date());
        const todayStat = (statsRaw as DailyStat[] || []).find(s => s.date === todayStr);
        if (todayStat) {
          setTodayData({
            kcal_in: todayStat.kcal_in || 0,
            kcal_out: todayStat.kcal_out || 0,
            p: todayStat.protein_in || 0,
            f: todayStat.fat_in || 0,
            c: todayStat.carbs_in || 0
          });
        }

        setFoods((foodsData || []).slice(0, 8));
        setExercises((exercisesData || []).slice(0, 8));
        setGoals(goalsData);
        setUserProfile(profileData);

      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          toast.error("Failed to sync data");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const ProgressCard = ({ label, current, goal, color, unit = "g" }: any) => {
    const percent = Math.min(100, Math.round((current / (goal || 1)) * 100));
    return (
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
          <span className={`text-sm font-bold ${color}`}>{current}{unit} / {goal}{unit}</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${color.replace('text-', 'bg-')}`}
            style={{ width: `${loading ? 0 : percent}%` }}
          />
        </div>
      </div>
    );
  };

  const netKcal = todayData.kcal_in - todayData.kcal_out;
  const kcalGoal = goals?.kcal_per_day || 2000;
  const kcalRemaining = Math.max(0, kcalGoal - netKcal);
  const progressPercent = Math.min(100, Math.max(0, (netKcal / kcalGoal) * 100));

  return (
    <>
      <Navbar />
      <Toaster position="bottom-center" />
      <main className="min-h-screen pt-24 max-w-6xl mx-auto px-4 pb-12 bg-gray-50/30">

        {/* Top Summary Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Calories Ring / Main Goal */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="80" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                <circle
                  cx="96" cy="96" r="80" fill="none" stroke="currentColor" strokeWidth="12"
                  strokeDasharray={502.4}
                  strokeDashoffset={502.4 - (502.4 * progressPercent) / 100}
                  className="text-green-500 transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-gray-800">{loading ? '...' : Math.round(kcalRemaining)}</span>
                <span className="text-xs font-bold text-gray-400 uppercase">kcal left</span>
              </div>
            </div>
            <div className="flex-1 space-y-4 w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Zap className="text-yellow-500 fill-yellow-500" size={24} />
                Daily Summary
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <ProgressCard label="Protein" current={todayData.p} goal={goals?.protein_g || 150} color="text-blue-500" />
                <ProgressCard label="Carbs" current={todayData.c} goal={goals?.carbs_g || 250} color="text-yellow-500" />
                <ProgressCard label="Fat" current={todayData.f} goal={goals?.fat_g || 70} color="text-pink-500" />
              </div>
            </div>
          </div>

          {/* Quick Stats / Highlights */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-[2rem] p-6 text-white shadow-lg shadow-green-200">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/20 rounded-2xl"><Target size={24} /></div>
                <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">ACTIVE</span>
              </div>
              <p className="text-sm font-medium opacity-80">Current Weight</p>
              <h3 className="text-3xl font-black mb-1">{userProfile?.weight || '--'} <span className="text-lg font-normal">kg</span></h3>
              <p className="text-xs opacity-70">Target: {goals?.target_weight || '--'} kg</p>
            </div>
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-500 transition-all" onClick={() => navigate("/add-workout")}>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Dumbbell size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Add Workout</h4>
                  <p className="text-xs text-gray-400">Track your exercise</p>
                </div>
              </div>
              <ChevronRight className="text-gray-300" />
            </div>
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-green-500 transition-all" onClick={() => navigate("/add-meal")}>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-green-50 text-green-600 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-all">
                  <Utensils size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Add Meal</h4>
                  <p className="text-xs text-gray-400">Log what you ate</p>
                </div>
              </div>
              <ChevronRight className="text-gray-300" />
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6 px-2">Weight & Calorie Trend</h3>
          <div className="h-64">
            {loading ? (
              <div className="h-full w-full bg-gray-50 rounded-2xl animate-pulse" />
            ) : (
              <StatsChart data={chartData.length > 0 ? chartData : [{ name: 'Sun', calories: 0 }, { name: 'Mon', calories: 0 }]} />
            )}
          </div>
        </div>

        {/* History Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Meals */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 px-2">Recent Nutrition</h2>
            <div className="space-y-3">
              {foods.map((food, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 rounded-3xl bg-white border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 font-bold text-xs">
                      {new Date(food.date).getDate()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{food.food_name}</h3>
                      <p className="text-xs text-gray-400">P:{food.protein}g F:{food.fat}g C:{food.carbs}g</p>
                    </div>
                  </div>
                  <span className="font-black text-gray-700">{Math.round(food.calories)} kcal</span>
                </div>
              ))}
              {foods.length === 0 && <div className="text-center py-8 text-gray-400 italic">No meals logged yet</div>}
            </div>
          </div>

          {/* Recent Exercises */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 px-2">Recent Activities</h2>
            <div className="space-y-3">
              {exercises.map((ex, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 rounded-3xl bg-white border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs text-center leading-none">
                      {ex.duration_min}<br /><span className="text-[8px]">MIN</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{ex.exercise_name}</h3>
                      <p className="text-xs text-gray-400">Workout</p>
                    </div>
                  </div>
                  <span className="font-black text-blue-600">-{Math.round(ex.calories_burned)} kcal</span>
                </div>
              ))}
              {exercises.length === 0 && <div className="text-center py-8 text-gray-400 italic">No workouts logged yet</div>}
            </div>
          </div>
        </div>

      </main>
    </>
  );
}
