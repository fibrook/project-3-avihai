import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface VacationFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  minPrice: number;
  maxPrice: number;
}

export function VacationFilters({
  search,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  minPrice,
  maxPrice,
}: VacationFiltersProps) {
  const hasFilters = search !== "" || priceRange[0] !== minPrice || priceRange[1] !== maxPrice;

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:mb-6 sm:flex-row sm:items-end sm:gap-4 sm:p-4">
      {/* Search */}
      <div className="flex-1 space-y-1.5">
        <label className="text-sm font-medium text-muted-foreground">Search destination</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="e.g. Paris, Bali, Tokyo…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Price range */}
      <div className="flex-1 space-y-1.5">
        <label className="text-sm font-medium text-muted-foreground">
          Price range: ${priceRange[0].toLocaleString()} – ${priceRange[1].toLocaleString()}
        </label>
        <Slider
          min={minPrice}
          max={maxPrice}
          step={100}
          value={priceRange}
          onValueChange={(val) => onPriceRangeChange(val as [number, number])}
          className="py-2"
        />
      </div>

      {/* Clear */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onSearchChange("");
            onPriceRangeChange([minPrice, maxPrice]);
          }}
          className="shrink-0 text-muted-foreground"
        >
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
