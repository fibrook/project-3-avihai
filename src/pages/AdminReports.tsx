import { AppNavbar } from "@/components/AppNavbar";
import { useVacations } from "@/hooks/useVacations";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function AdminReports() {
  const { vacations, loading } = useVacations();

  const chartData = vacations
    .filter((v) => v.follower_count > 0)
    .map((v) => ({ destination: v.destination, followers: v.follower_count }))
    .sort((a, b) => b.followers - a.followers);

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Vacation Reports</h1>
          <p className="mt-1 text-muted-foreground">Followers per destination</p>
        </div>

        {loading ? (
          <div className="h-96 animate-pulse rounded-xl bg-muted" />
        ) : chartData.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg">No vacations with followers yet.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-6">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="destination"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  angle={-35}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  allowDecimals={false}
                  label={{ value: "Followers", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Bar dataKey="followers" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </main>
    </div>
  );
}
