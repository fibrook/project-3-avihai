import { useVacations } from "@/hooks/useVacations";
import { VacationCard } from "@/components/VacationCard";
import { AppNavbar } from "@/components/AppNavbar";

export default function Index() {
  const { vacations, loading, toggleFollow } = useVacations();

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Discover Vacations</h1>
          <p className="mt-1 text-muted-foreground">Follow the destinations you love</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : vacations.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg">No vacations available yet.</p>
            <p className="text-sm">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vacations.map((v) => (
              <VacationCard key={v.id} vacation={v} mode="user" onToggleFollow={toggleFollow} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
