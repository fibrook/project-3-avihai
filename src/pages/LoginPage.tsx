import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Compass } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function LoginPage() {
  const { user, loading, signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    // Look up email by username
    const { data: email, error: lookupError } = await supabase.rpc("get_email_by_username", {
      _username: username,
    });

    if (lookupError || !email) {
      toast.error("Invalid username or password");
      setSubmitting(false);
      return;
    }

    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) toast.error("Invalid username or password");
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel - branding */}
      <div className="hidden flex-1 items-center justify-center bg-primary lg:flex">
        <div className="max-w-md px-8 text-center">
          <Compass className="mx-auto mb-6 h-16 w-16 text-primary-foreground" />
          <h1 className="mb-4 text-4xl font-extrabold text-primary-foreground">ObserVacation</h1>
          <p className="text-lg text-primary-foreground/80">
            Track and follow your dream vacations. Discover amazing destinations curated just for you.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <Compass className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">
                Obser<span className="text-primary">Vacation</span>
              </span>
            </div>
          </div>

          <h2 className="mb-2 text-2xl font-bold text-foreground">Welcome back</h2>
          <p className="mb-6 text-sm text-muted-foreground">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your username" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New user?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
