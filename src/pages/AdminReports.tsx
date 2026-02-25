import { AppNavbar } from "@/components/AppNavbar";
import { useVacations } from "@/hooks/useVacations";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, LineChart, Line, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, DollarSign, Calendar } from "lucide-react";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(210 70% 55%)",
  "hsl(150 60% 45%)",
  "hsl(340 65% 55%)",
  "hsl(45 80% 50%)",
  "hsl(280 55% 55%)",
  "hsl(20 75% 55%)",
];

export default function AdminReports() {
  const { vacations, loading } = useVacations();

  const totalVacations = vacations.length;
  const totalFollowers = vacations.reduce((sum, v) => sum + v.follower_count, 0);
  const avgPrice = totalVacations > 0
    ? Math.round(vacations.reduce((sum, v) => sum + v.price, 0) / totalVacations)
    : 0;
  const mostPopular = vacations.reduce(
    (best, v) => (v.follower_count > (best?.follower_count ?? 0) ? v : best),
    vacations[0],
  );

  const followersChartData = vacations
    .filter((v) => v.follower_count > 0)
    .map((v) => ({ destination: v.destination, followers: v.follower_count }))
    .sort((a, b) => b.followers - a.followers);

  const priceChartData = vacations
    .map((v) => ({ destination: v.destination, price: v.price }))
    .sort((a, b) => b.price - a.price)
    .slice(0, 10);

  const pieData = followersChartData.slice(0, 6);

  const monthlyData = (() => {
    const months: Record<string, number> = {};
    vacations.forEach((v) => {
      const key = v.start_date.slice(0, 7); // YYYY-MM
      months[key] = (months[key] || 0) + 1;
    });
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));
  })();

  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "0.5rem",
    color: "hsl(var(--foreground))",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <main className="container mx-auto px-4 py-8">
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">דוחות וסטטיסטיקות</h1>
          <p className="mt-1 text-muted-foreground">סקירה כללית על חופשות ועוקבים</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">סה״כ חופשות</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalVacations}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">סה״כ עוקבים</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalFollowers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">מחיר ממוצע</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">${avgPrice}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">הכי פופולרי</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="truncate text-lg font-bold text-foreground">
                {mostPopular?.destination ?? "—"}
              </div>
              <p className="text-sm text-muted-foreground">
                {mostPopular ? `${mostPopular.follower_count} עוקבים` : ""}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Followers Bar Chart */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">עוקבים לפי יעד</CardTitle>
            </CardHeader>
            <CardContent>
              {followersChartData.length === 0 ? (
                <p className="py-16 text-center text-muted-foreground">אין עוקבים עדיין</p>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={followersChartData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="destination" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} angle={-35} textAnchor="end" height={80} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="followers" radius={[6, 6, 0, 0]}>
                      {followersChartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Price Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">מחירים לפי יעד (Top 10)</CardTitle>
            </CardHeader>
            <CardContent>
              {priceChartData.length === 0 ? (
                <p className="py-16 text-center text-muted-foreground">אין נתונים</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={priceChartData} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis dataKey="destination" type="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} width={75} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`$${value}`, "מחיר"]} />
                    <Bar dataKey="price" fill="hsl(210 70% 55%)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">התפלגות עוקבים</CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length === 0 ? (
                <p className="py-16 text-center text-muted-foreground">אין עוקבים עדיין</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="followers"
                      nameKey="destination"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ destination, percent }) => `${destination} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Monthly Vacations Line Chart */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">חופשות לפי חודש</CardTitle>
            </CardHeader>
            <CardContent>
              {monthlyData.length === 0 ? (
                <p className="py-16 text-center text-muted-foreground">אין נתונים</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} name="חופשות" dot={{ fill: "hsl(var(--primary))" }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
