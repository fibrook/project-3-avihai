import { useMemo, useState } from "react";
import { useVacations } from "@/hooks/useVacations";
import { VacationCard } from "@/components/VacationCard";
import { VacationFilters } from "@/components/VacationFilters";
import { AppNavbar } from "@/components/AppNavbar";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useIsMobile } from "@/hooks/use-mobile";
import { RefreshCw } from "lucide-react";

const MIN_PRICE = 0;
const MAX_PRICE = 10000;

export default function Index() {
  const { vacations, loading, toggleFollow, refetch } = useVacations();
  const isMobile = useIsMobile();
  const { pulling, pullDistance, onTouchStart, onTouchMove, onTouchEnd, threshold } = usePullToRefresh(refetch);
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
    <div
      className="min-h-screen bg-background"
      onTouchStart={isMobile ? onTouchStart : undefined}
      onTouchMove={isMobile ? onTouchMove : undefined}
      onTouchEnd={isMobile ? onTouchEnd : undefined}
    >
      <AppNavbar />

      {/* Pull-to-refresh indicator */}
      {isMobile && pulling && (
        <div
          className="flex items-center justify-center overflow-hidden transition-all"
          style={{ height: pullDistance }}
        >
          <RefreshCw
            className={`h-5 w-5 text-muted-foreground transition-transform ${pullDistance >= threshold ? "text-primary animate-spin" : ""}`}
          />
        </div>
      )}

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Discover Vacations</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">Follow the destinations you love</p>
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
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-xl bg-muted sm:h-80" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg">No vacations match your filters.</p>
            <p className="text-sm">Try adjusting your search or price range.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v) => (
              <VacationCard key={v.id} vacation={v} mode="user" onToggleFollow={toggleFollow} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
