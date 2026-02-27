import { AppNavbar } from "@/components/AppNavbar";
import { useVacations } from "@/hooks/useVacations";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, LineChart, Line, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, DollarSign, Calendar } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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
      const key = v.start_date.slice(0, 7);
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
        <main className="container mx-auto px-4 py-6 sm:py-8">
          <div className="grid gap-3 grid-cols-2 sm:gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-muted sm:h-28" />
            ))}
          </div>
          <div className="mt-6 grid gap-4 sm:gap-6 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-muted sm:h-80" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">דוחות וסטטיסטיקות</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">סקירה כללית על חופשות ועוקבים</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-3 grid-cols-2 sm:mb-8 sm:gap-4 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">סה״כ חופשות</CardTitle>
              <MapPin className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground sm:text-3xl">{totalVacations}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">סה״כ עוקבים</CardTitle>
              <Users className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground sm:text-3xl">{totalFollowers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">מחיר ממוצע</CardTitle>
              <DollarSign className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground sm:text-3xl">${avgPrice}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">הכי פופולרי</CardTitle>
              <Calendar className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
            </CardHeader>
            <CardContent>
              <div className="truncate text-base font-bold text-foreground sm:text-lg">
                {mostPopular?.destination ?? "—"}
              </div>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {mostPopular ? `${mostPopular.follower_count} עוקבים` : ""}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Followers Bar Chart */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">עוקבים לפי יעד</CardTitle>
            </CardHeader>
            <CardContent className="pl-0 pr-2 sm:pl-2 sm:pr-6">
              {followersChartData.length === 0 ? (
                <p className="py-16 text-center text-muted-foreground">אין עוקבים עדיין</p>
              ) : (
                <ResponsiveContainer width="100%" height={isMobile ? 250 : 350}>
                  <BarChart data={followersChartData} margin={{ top: 10, right: 10, left: 0, bottom: isMobile ? 80 : 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="destination" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: isMobile ? 10 : 12 }} angle={-45} textAnchor="end" height={isMobile ? 90 : 80} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: isMobile ? 10 : 12 }} allowDecimals={false} width={30} />
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
              <CardTitle className="text-base sm:text-lg">מחירים לפי יעד (Top 10)</CardTitle>
            </CardHeader>
            <CardContent className="pl-0 pr-2 sm:pl-2 sm:pr-6">
              {priceChartData.length === 0 ? (
                <p className="py-16 text-center text-muted-foreground">אין נתונים</p>
              ) : (
                <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                  <BarChart data={priceChartData} layout="vertical" margin={{ left: isMobile ? 60 : 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: isMobile ? 10 : 12 }} />
                    <YAxis dataKey="destination" type="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: isMobile ? 9 : 11 }} width={isMobile ? 55 : 75} />
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
              <CardTitle className="text-base sm:text-lg">התפלגות עוקבים</CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length === 0 ? (
                <p className="py-16 text-center text-muted-foreground">אין עוקבים עדיין</p>
              ) : (
                <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="followers"
                      nameKey="destination"
                      cx="50%"
                      cy="50%"
                      outerRadius={isMobile ? 70 : 100}
                      label={isMobile
                        ? ({ percent }) => `${(percent * 100).toFixed(0)}%`
                        : ({ destination, percent }) => `${destination} (${(percent * 100).toFixed(0)}%)`
                      }
                      labelLine={!isMobile}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    {isMobile && <Legend wrapperStyle={{ fontSize: 11 }} />}
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Monthly Vacations Line Chart */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">חופשות לפי חודש</CardTitle>
            </CardHeader>
            <CardContent className="pl-0 pr-2 sm:pl-2 sm:pr-6">
              {monthlyData.length === 0 ? (
                <p className="py-16 text-center text-muted-foreground">אין נתונים</p>
              ) : (
                <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: isMobile ? 10 : 12 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: isMobile ? 10 : 12 }} allowDecimals={false} width={30} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: isMobile ? 11 : 14 }} />
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
