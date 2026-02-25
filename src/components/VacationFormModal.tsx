import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Link as LinkIcon } from "lucide-react";
import type { Vacation } from "@/store/vacationsSlice";
import { supabase } from "@/integrations/supabase/client";
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
  const [uploading, setUploading] = useState(false);
  const [imageMode, setImageMode] = useState<"url" | "upload">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, WebP, and GIF images are allowed");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const filePath = `vacations/${fileName}`;

    const { error } = await supabase.storage
      .from("vacation-images")
      .upload(filePath, file);

    if (error) {
      toast.error("Failed to upload image");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("vacation-images")
      .getPublicUrl(filePath);

    setForm((f) => ({ ...f, image_url: urlData.publicUrl }));
    setUploading(false);
    toast.success("Image uploaded!");
  }

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

          {/* Image: toggle between upload and URL */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>Image</Label>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant={imageMode === "upload" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setImageMode("upload")}
                  className="h-7 gap-1 text-xs"
                >
                  <Upload className="h-3 w-3" /> Upload
                </Button>
                <Button
                  type="button"
                  variant={imageMode === "url" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setImageMode("url")}
                  className="h-7 gap-1 text-xs"
                >
                  <LinkIcon className="h-3 w-3" /> URL
                </Button>
              </div>
            </div>

            {imageMode === "upload" ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Choose Image File"}
                </Button>
                {form.image_url && (
                  <div className="mt-2 overflow-hidden rounded-lg border border-border">
                    <img src={form.image_url} alt="Preview" className="h-32 w-full object-cover" />
                  </div>
                )}
              </div>
            ) : (
              <Input
                value={form.image_url}
                onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                placeholder="https://..."
              />
            )}
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
            <Button type="submit" disabled={submitting || uploading}>
              {submitting ? "Saving..." : vacation ? "Update" : "Add Vacation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
