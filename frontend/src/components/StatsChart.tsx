import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

type Item = { name: string; calories: number };

export default function StatsChart({ data }: { data: Item[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-4">
      <h3 className="font-medium mb-2">Calories (last 7 days)</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#32D74B" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#32D74B" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="calories" stroke="#32D74B" fill="url(#g)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
