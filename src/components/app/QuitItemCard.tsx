import dayjs from "dayjs";
import { Clock, Edit2, Trash2 } from "lucide-react";
import type { QuitItem } from "@/store/useQuitStore";
import { useQuitStore } from "@/store/useQuitStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuitItemCardProps {
  item: QuitItem;
}

export default function QuitItemCard({ item }: QuitItemCardProps) {
  const {
    calculateTimeElapsed,
    calculateBenefit,
    formatTimeElapsed,
    setEditingItem,
    setDeleteConfirmItem,
    setDialogOpen,
    updateFormData,
  } = useQuitStore();

  const timeElapsed = calculateTimeElapsed(item.quitDate);
  const isValid =
    timeElapsed.days >= 0 &&
    timeElapsed.hours >= 0 &&
    timeElapsed.minutes >= 0 &&
    timeElapsed.seconds >= 0;
  const benefit = calculateBenefit(item);

  const handleEdit = () => {
    setEditingItem(item);
    updateFormData({
      name: item.name,
      description: item.description || "",
      quitDate: item.quitDate,
      benefitType: item.benefitType || "",
      benefitAmount: item.benefitAmount?.toString() || "",
      benefitUnit: item.benefitUnit || "",
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = () => {
    setDeleteConfirmItem(item);
  };

  return (
    <Card
      key={item.id}
      className="relative group hover:shadow-lg transition-all duration-300 bg-card border-border hover:border-primary/20"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-text mb-1">
              {item.name}
            </CardTitle>
            {item.description && (
              <CardDescription className="text-sm text-text-secondary">
                {item.description}
              </CardDescription>
            )}
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-hover"
              onClick={handleEdit}
            >
              <Edit2 className="w-4 h-4 text-text-secondary" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDeleteClick}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">
            {isValid ? formatTimeElapsed(timeElapsed) : "Invalid date"}
          </div>
          <div className="text-sm text-text-secondary mb-4">
            {isValid && timeElapsed.days > 0 && (
              <div className="mb-1">
                <span className="font-semibold">{timeElapsed.days}</span>
                &nbsp;day
                {timeElapsed.days !== 1 ? "s" : ""} clean
              </div>
            )}
            <div>
              Since&nbsp;
              {dayjs(item.quitDate).format("MMM D, YYYY [at] h:mm A")}
            </div>
          </div>
          {/* Benefit Display */}
          {benefit && (
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                {benefit.type === "time" ? (
                  <Clock className="w-4 h-4 text-secondary" />
                ) : (
                  <>{benefit.unit}</>
                )}
                <span className="text-sm font-medium text-text">
                  {benefit.type === "time" ? "Time Saved" : "Money Saved"}
                </span>
              </div>
              <div
                className={`text-2xl font-bold mb-1 ${
                  benefit.type === "time" ? "text-secondary" : "text-success"
                }`}
              >
                {benefit.unit}
              </div>
              <div className="text-xs text-text-secondary">
                {benefit.type === "time"
                  ? `${benefit.dailyAmount} minutes/day`
                  : `${item.benefitUnit}${benefit.dailyAmount}/day`}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
