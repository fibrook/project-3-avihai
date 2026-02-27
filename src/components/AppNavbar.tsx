import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, BarChart3, Compass, Shield, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export function AppNavbar() {
  const { profile, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = (
    <>
      <Link to="/" onClick={() => setSheetOpen(false)}>
        <Button
          variant={isActive("/") ? "default" : "ghost"}
          size={isMobile ? "default" : "sm"}
          className={isMobile ? "w-full justify-start text-base" : "text-sm"}
        >
          Vacations
        </Button>
      </Link>

      {isAdmin && (
        <>
          <Link to="/admin" onClick={() => setSheetOpen(false)}>
            <Button
              variant={isActive("/admin") ? "default" : "ghost"}
              size={isMobile ? "default" : "sm"}
              className={isMobile ? "w-full justify-start gap-2 text-base" : "text-sm"}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Button>
          </Link>
          <Link to="/admin/reports" onClick={() => setSheetOpen(false)}>
            <Button
              variant={isActive("/admin/reports") ? "default" : "ghost"}
              size={isMobile ? "default" : "sm"}
              className={isMobile ? "w-full justify-start gap-2 text-base" : "text-sm"}
            >
              <BarChart3 className="h-4 w-4" />
              Reports
            </Button>
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:h-16">
        <Link to="/" className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
          <span className="text-lg font-bold text-foreground sm:text-xl">
            Obser<span className="text-primary">Vacation</span>
          </span>
        </Link>

        {/* Desktop nav */}
        {!isMobile ? (
          <nav className="flex items-center gap-1 sm:gap-2">
            {navLinks}

            <span className="ml-2 hidden text-sm text-muted-foreground sm:inline">
              Hello, <span className="font-semibold text-foreground">{profile?.username}</span>
            </span>

            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </nav>
        ) : (
          /* Mobile nav */
          <div className="flex items-center gap-1">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <Compass className="h-5 w-5 text-primary" />
                    ObserVacation
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-1">
                  {profile && (
                    <p className="mb-3 px-4 text-sm text-muted-foreground">
                      Hello, <span className="font-semibold text-foreground">{profile.username}</span>
                    </p>
                  )}
                  {navLinks}
                  <div className="my-2 border-t border-border" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-base text-destructive hover:text-destructive"
                    onClick={() => {
                      setSheetOpen(false);
                      signOut();
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </header>
  );
}
