import { useQuitStore } from "@/store/useQuitStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DeleteConfirmation() {
  const { deleteConfirmItem, setDeleteConfirmItem, deleteItem } =
    useQuitStore();

  const handleCancelDelete = () => {
    setDeleteConfirmItem(null);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmItem) {
      deleteItem(deleteConfirmItem.id);
      setDeleteConfirmItem(null);
    }
  };

  return (
    <Dialog
      open={!!deleteConfirmItem}
      onOpenChange={() => setDeleteConfirmItem(null)}
    >
      <DialogContent className="sm:max-w-[425px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-red-600">
            Delete Quit Tracker
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            Are you sure you want to delete "{deleteConfirmItem?.name}"? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancelDelete}
            className="border-border hover:bg-hover"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirmDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
