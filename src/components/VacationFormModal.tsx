import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Vacation } from "@/hooks/useVacations";
import { toast } from "sonner";

interface VacationFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<{ error: any }>;
  vacation?: Vacation | null;
}

export function VacationFormModal({ open, onClose, onSubmit, vacation }: VacationFormModalProps) {
  const [form, setForm] = useState({
    destination: "",
    description: "",
    image_url: "",
    start_date: "",
    end_date: "",
    price: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (vacation) {
      setForm({
        destination: vacation.destination,
        description: vacation.description,
        image_url: vacation.image_url || "",
        start_date: vacation.start_date,
        end_date: vacation.end_date,
        price: String(vacation.price),
      });
    } else {
      setForm({ destination: "", description: "", image_url: "", start_date: "", end_date: "", price: "" });
    }
  }, [vacation, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.destination || !form.description || !form.start_date || !form.end_date) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (new Date(form.end_date) <= new Date(form.start_date)) {
      toast.error("End date must be after start date");
      return;
    }
    setSubmitting(true);
    const { error } = await onSubmit({
      destination: form.destination,
      description: form.description,
      image_url: form.image_url || null,
      start_date: form.start_date,
      end_date: form.end_date,
      price: parseFloat(form.price) || 0,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message || "Something went wrong");
    } else {
      toast.success(vacation ? "Vacation updated!" : "Vacation added!");
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{vacation ? "Edit Vacation" : "Add New Vacation"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="destination">Destination *</Label>
            <Input id="destination" value={form.destination} onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))} placeholder="Paris, France" />
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="An amazing getaway..." rows={3} />
          </div>
          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input id="image_url" value={form.image_url} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="start_date">Start Date *</Label>
              <Input id="start_date" type="date" value={form.start_date} onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="end_date">End Date *</Label>
              <Input id="end_date" type="date" value={form.end_date} onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))} />
            </div>
          </div>
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input id="price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="0.00" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : vacation ? "Update" : "Add Vacation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
