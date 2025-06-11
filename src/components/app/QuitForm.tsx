import type { FormEvent } from "react";
import { useState } from "react";
import dayjs from "dayjs";
import { useQuitStore, type QuitItem } from "@/store/useQuitStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ModalDatePicker from "./ModalDatePicker";

interface Props {
  buttonType?: "text" | "icon";
}
export default function QuitForm({ buttonType = "text" }: Props) {
  const {
    isDialogOpen,
    editingItem,
    formData,
    setDialogOpen,
    updateFormData,
    resetForm,
    handleBenefitTypeChange,
    addItem,
    updateItem,
  } = useQuitStore();

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    const newItem: QuitItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      quitDate: formData.quitDate || dayjs().format("YYYY-MM-DDTHH:mm"),
      benefitType: formData.benefitType || undefined,
      benefitAmount: formData.benefitAmount
        ? Number.parseFloat(formData.benefitAmount)
        : undefined,
      benefitUnit: formData.benefitUnit || undefined,
    };

    if (editingItem) {
      updateItem(editingItem.id, newItem);
    } else {
      addItem(newItem);
    }
    resetForm();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => resetForm()}
          className="bg-primary hover:bg-primary-dark text-white focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 flex items-center gap-2"
          aria-label="Add a new habit to quit tracking"
        >
          <Plus className="" aria-hidden="true" />
          {buttonType === "text" && <>Add New Quit</>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-text">
            {editingItem ? "Edit Quit" : "Add New Quit"}
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            {editingItem
              ? "Update your quit details."
              : "Add a new habit you want to track quitting."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Smoking, Social Media, Coffee..."
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Why did you quit? What motivated you?"
                value={formData.description}
                onChange={(e) =>
                  updateFormData({ description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quitDate">Quit Date</Label>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDatePicker(true);
                }}
                className="justify-start text-left font-normal"
              >
                {formData.quitDate
                  ? dayjs(formData.quitDate).format("MMM D, YYYY [at] h:mm A")
                  : "Select Date"}
              </Button>
            </div>
            <ModalDatePicker
              isOpen={showDatePicker}
              onClose={() => setShowDatePicker(false)}
              onSelect={(date: string) => {
                updateFormData({ quitDate: date });
                setShowDatePicker(false);
              }}
              initialDate={formData.quitDate}
              title="Select Quit Date & Time"
              description="Choose when you quit this habit"
              includeTime={true}
            />
            {/* Benefit Tracking Section */}
            <div className="border-t pt-4">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Benefit Tracking (optional)
              </Label>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="benefitType">Benefit Type</Label>
                  <Select
                    value={formData.benefitType}
                    onValueChange={(value: "time" | "money") =>
                      handleBenefitTypeChange(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select benefit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time">Time Saved</SelectItem>
                      <SelectItem value="money">Money Saved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.benefitType && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="benefitAmount">
                        {formData.benefitType === "time"
                          ? "Minutes per day"
                          : "Amount per day"}
                      </Label>
                      <Input
                        id="benefitAmount"
                        type="number"
                        step={formData.benefitType === "money" ? "0.01" : "1"}
                        placeholder={
                          formData.benefitType === "time"
                            ? "e.g., 30"
                            : "e.g., 15.00"
                        }
                        value={formData.benefitAmount}
                        onChange={(e) =>
                          updateFormData({ benefitAmount: e.target.value })
                        }
                      />
                    </div>

                    {formData.benefitType === "money" && (
                      <div className="grid gap-2">
                        <Label htmlFor="benefitUnit">Currency</Label>
                        <Select
                          value={formData.benefitUnit}
                          onValueChange={(value) =>
                            updateFormData({ benefitUnit: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="$">USD ($)</SelectItem>
                            <SelectItem value="Rp">IDR (Rp)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="border-border hover:bg-hover"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white"
            >
              {editingItem ? "Update" : "Add"} Quit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
