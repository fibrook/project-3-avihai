import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Compass } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const { user, loading, signUp } = useAuth();
  const [form, setForm] = useState({ first_name: "", last_name: "", username: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.username || !form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    const { error } = await signUp(form.email, form.password, {
      first_name: form.first_name,
      last_name: form.last_name,
      username: form.username,
    });
    setSubmitting(false);
    if (error) toast.error(error.message);
    else toast.success("Account created successfully!");
  }

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 items-center justify-center bg-primary lg:flex">
        <div className="max-w-md px-8 text-center">
          <Compass className="mx-auto mb-6 h-16 w-16 text-primary-foreground" />
          <h1 className="mb-4 text-4xl font-extrabold text-primary-foreground">ObserVacation</h1>
          <p className="text-lg text-primary-foreground/80">
            Join our community and start following your dream vacations today.
          </p>
        </div>
      </div>

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

          <h2 className="mb-2 text-2xl font-bold text-foreground">Create Account</h2>
          <p className="mb-6 text-sm text-muted-foreground">Start your vacation journey</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" value={form.first_name} onChange={update("first_name")} placeholder="John" required />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" value={form.last_name} onChange={update("last_name")} placeholder="Doe" required />
              </div>
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={form.username} onChange={update("username")} placeholder="johndoe" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={form.password} onChange={update("password")} placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Creating account..." : "Register"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
