import { useMemo, useState } from "react";
import { useVacations } from "@/hooks/useVacations";
import { VacationCard } from "@/components/VacationCard";
import { VacationFilters } from "@/components/VacationFilters";
import { AppNavbar } from "@/components/AppNavbar";

const MIN_PRICE = 0;
const MAX_PRICE = 10000;

export default function Index() {
  const { vacations, loading, toggleFollow } = useVacations();
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([MIN_PRICE, MAX_PRICE]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return vacations.filter((v) => {
      if (q && !v.destination.toLowerCase().includes(q)) return false;
      if (v.price < priceRange[0] || v.price > priceRange[1]) return false;
      return true;
    });
  }, [vacations, search, priceRange]);

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Discover Vacations</h1>
          <p className="mt-1 text-muted-foreground">Follow the destinations you love</p>
        </div>

        <VacationFilters
          search={search}
          onSearchChange={setSearch}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          minPrice={MIN_PRICE}
          maxPrice={MAX_PRICE}
        />

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg">No vacations match your filters.</p>
            <p className="text-sm">Try adjusting your search or price range.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v) => (
              <VacationCard key={v.id} vacation={v} mode="user" onToggleFollow={toggleFollow} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
