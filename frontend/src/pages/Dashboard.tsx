import Navbar from "../components/Navbar";
import StatsChart from "../components/StatsChart";

const mock = [
  { name: "Mon", calories: 2100 },
  { name: "Tue", calories: 1800 },
  { name: "Wed", calories: 2200 },
  { name: "Thu", calories: 1950 },
  { name: "Fri", calories: 2400 },
  { name: "Sat", calories: 2050 },
  { name: "Sun", calories: 2000 },
];

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <StatsChart data={mock} />
          </div>
          <div className="bg-white rounded-2xl shadow-soft p-4">
            <h3 className="font-medium mb-2">Quick actions</h3>
            <div className="flex flex-col gap-2">
              <button className="px-4 py-2 rounded-full bg-fitnessAccent text-white hover:brightness-110 transition">
                Add meal
              </button>
              <button className="px-4 py-2 rounded-full border border-black/10 hover:bg-black/5 transition">
                Add workout
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
