import { Heart, Calendar, DollarSign, Pencil, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { Vacation } from "@/hooks/useVacations";

interface VacationCardProps {
  vacation: Vacation;
  mode: "user" | "admin";
  onToggleFollow?: (id: string) => void;
  onEdit?: (vacation: Vacation) => void;
  onDelete?: (id: string) => void;
}

export function VacationCard({ vacation, mode, onToggleFollow, onEdit, onDelete }: VacationCardProps) {
  const defaultImage = `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop`;

  return (
    <div className="group animate-fade-in overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={vacation.image_url || defaultImage}
          alt={vacation.destination}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1 text-primary-foreground">
              <MapPin className="h-4 w-4" />
              <h3 className="text-lg font-bold">{vacation.destination}</h3>
            </div>
          </div>
          <span className="rounded-full bg-card/90 px-3 py-1 text-sm font-semibold text-foreground backdrop-blur-sm">
            ${vacation.price}
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{vacation.description}</p>

        <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {format(new Date(vacation.start_date), "MMM d")} – {format(new Date(vacation.end_date), "MMM d, yyyy")}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {vacation.follower_count} {vacation.follower_count === 1 ? "follower" : "followers"}
          </span>

          {mode === "user" ? (
            <Button
              size="sm"
              variant={vacation.is_following ? "default" : "outline"}
              onClick={() => onToggleFollow?.(vacation.id)}
              className="gap-1.5"
            >
              <Heart className={`h-4 w-4 ${vacation.is_following ? "fill-current" : ""}`} />
              {vacation.is_following ? "Following" : "Follow"}
            </Button>
          ) : (
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => onEdit?.(vacation)} className="h-8 w-8">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => onDelete?.(vacation.id)} className="h-8 w-8 text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
