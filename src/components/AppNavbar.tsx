import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, BarChart3, Compass, Shield } from "lucide-react";

export function AppNavbar() {
  const { profile, isAdmin, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Compass className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">
            Obser<span className="text-primary">Vacation</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link to="/">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              className="text-sm"
            >
              Vacations
            </Button>
          </Link>

          {isAdmin && (
            <>
              <Link to="/admin">
                <Button
                  variant={isActive("/admin") ? "default" : "ghost"}
                  size="sm"
                  className="text-sm"
                >
                  <Shield className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </Link>
              <Link to="/admin/reports">
                <Button
                  variant={isActive("/admin/reports") ? "default" : "ghost"}
                  size="sm"
                  className="text-sm"
                >
                  <BarChart3 className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Reports</span>
                </Button>
              </Link>
            </>
          )}

          <span className="ml-2 hidden text-sm text-muted-foreground sm:inline">
            Hello, <span className="font-semibold text-foreground">{profile?.username}</span>
          </span>

          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </nav>
      </div>
    </header>
  );
}
