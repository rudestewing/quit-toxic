import { Calendar } from "lucide-react";
import { useQuitStore } from "@/store/useQuitStore";
import QuitForm from "./QuitForm";
import QuitItemCard from "./QuitItemCard";

export default function QuitList() {
  const { items } = useQuitStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-text mb-2">Quitracker</h1>
          <p className="text-text-secondary">
            Track your journey to freedom from bad habits
          </p>
        </div>
        <div className="text-center py-12 text-gray-400 rounded-lg border mt-[40px]">
          <Calendar className="w-16 h-16 text-text-secondary mx-auto mb-4 " />
          <h3 className="text-xl font-semibold text-text mb-2">
            No quits tracked yet
          </h3>
          <p className="text-text-secondary">
            Add your first quit to start tracking your progress!
          </p>
          <div className="mt-[40px] flex justify-center">
            <QuitForm />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-text-secondary">
        Your progress towards breaking free from unwanted habits
      </p>
      {items.map((item) => (
        <QuitItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
