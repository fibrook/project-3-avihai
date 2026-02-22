import { useState } from "react";
import { useVacations, type Vacation } from "@/hooks/useVacations";
import { VacationCard } from "@/components/VacationCard";
import { VacationFormModal } from "@/components/VacationFormModal";
import { AppNavbar } from "@/components/AppNavbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminDashboard() {
  const { vacations, loading, addVacation, updateVacation, deleteVacation } = useVacations();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Vacation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleEdit(vacation: Vacation) {
    setEditing(vacation);
    setModalOpen(true);
  }

  function handleAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  async function handleSubmit(data: any) {
    if (editing) {
      return updateVacation(editing.id, data);
    }
    return addVacation(data);
  }

  async function confirmDelete() {
    if (!deleteId) return;
    const { error } = await deleteVacation(deleteId);
    if (error) toast.error(error.message);
    else toast.success("Vacation deleted");
    setDeleteId(null);
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Manage all vacations</p>
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Vacation
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vacations.map((v) => (
              <VacationCard key={v.id} vacation={v} mode="admin" onEdit={handleEdit} onDelete={(id) => setDeleteId(id)} />
            ))}
          </div>
        )}

        <VacationFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} vacation={editing} />

        <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Vacation?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All followers will be removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
