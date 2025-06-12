"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { STORAGE_KEYS } from "@/lib/config";

// Extend dayjs with plugins
dayjs.extend(duration);
dayjs.extend(relativeTime);

export interface QuitItem {
  id: string;
  name: string;
  description?: string;
  quitDate: string;
  benefitType?: "time" | "money";
  benefitAmount?: number; // per day
  benefitUnit?: string; // for time: "minutes" | "hours", for money: currency symbol
}

export interface TimeElapsed {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface BenefitCalculation {
  totalAmount: number;
  dailyAmount: number;
  unit: string;
  type: "time" | "money";
}

export interface FormData {
  name: string;
  description: string;
  quitDate: string;
  benefitType: "time" | "money" | "";
  benefitAmount: string;
  benefitUnit: string;
}

interface QuitStore {
  // State
  items: QuitItem[];
  currentTime: dayjs.Dayjs;
  isDialogOpen: boolean;
  editingItem: QuitItem | null;
  deleteConfirmItem: QuitItem | null;
  formData: FormData;

  // Actions
  addItem: (item: QuitItem) => void;
  updateItem: (id: string, updatedItem: QuitItem) => void;
  deleteItem: (id: string) => void;
  setEditingItem: (item: QuitItem | null) => void;
  setDeleteConfirmItem: (item: QuitItem | null) => void;
  setDialogOpen: (isOpen: boolean) => void;
  updateFormData: (updates: Partial<FormData>) => void;
  resetForm: () => void;
  updateCurrentTime: () => void;

  // Utils
  calculateTimeElapsed: (quitDate: string) => TimeElapsed;
  calculateBenefit: (item: QuitItem) => BenefitCalculation | null;
  formatTimeElapsed: (time: TimeElapsed) => string;
  handleBenefitTypeChange: (value: "time" | "money") => void;
}

const DEFAULT_FORM_DATA: FormData = {
  name: "",
  description: "",
  quitDate: "",
  benefitType: "",
  benefitAmount: "",
  benefitUnit: "",
};

export const useQuitStore = create<QuitStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      currentTime: dayjs(),
      isDialogOpen: false,
      editingItem: null,
      deleteConfirmItem: null,
      formData: { ...DEFAULT_FORM_DATA },

      // Actions
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),

      updateItem: (id, updatedItem) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? updatedItem : item
          ),
        })),

      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      setEditingItem: (item) => set({ editingItem: item }),

      setDeleteConfirmItem: (item) => set({ deleteConfirmItem: item }),

      setDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),

      updateFormData: (updates) =>
        set((state) => ({
          formData: { ...state.formData, ...updates },
        })),

      resetForm: () =>
        set({
          formData: { ...DEFAULT_FORM_DATA },
          editingItem: null,
          isDialogOpen: false,
        }),

      updateCurrentTime: () => set({ currentTime: dayjs() }),

      // Utils
      calculateTimeElapsed: (quitDate) => {
        const quit = dayjs(quitDate);
        const now = get().currentTime;
        const diff = dayjs.duration(now.diff(quit));

        const days = Math.floor(diff.asDays());
        const hours = diff.hours();
        const minutes = diff.minutes();
        const seconds = diff.seconds();

        return { days, hours, minutes, seconds };
      },

      calculateBenefit: (item) => {
        if (!item.benefitType || !item.benefitAmount) return null;

        const timeElapsed = get().calculateTimeElapsed(item.quitDate);
        const totalDays = Math.max(
          0,
          timeElapsed.days + timeElapsed.hours / 24
        );

        if (item.benefitType === "time") {
          const dailyMinutes = item.benefitAmount;
          const totalMinutes = totalDays * dailyMinutes;

          if (totalMinutes >= 60) {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = Math.floor(totalMinutes % 60);
            return {
              totalAmount: totalMinutes,
              dailyAmount: dailyMinutes,
              unit:
                hours > 0
                  ? `${hours}h ${minutes}m`
                  : `${Math.floor(totalMinutes)}m`,
              type: "time",
            };
          } else {
            return {
              totalAmount: totalMinutes,
              dailyAmount: dailyMinutes,
              unit: `${Math.floor(totalMinutes)}m`,
              type: "time",
            };
          }
        } else if (item.benefitType === "money") {
          const totalAmount = totalDays * item.benefitAmount;
          return {
            totalAmount,
            dailyAmount: item.benefitAmount,
            unit: `${item.benefitUnit || "$"}${totalAmount.toLocaleString(
              "en-US",
              {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }
            )}`,
            type: "money",
          };
        }

        return null;
      },

      formatTimeElapsed: (time) => {
        if (time.days > 0) {
          return `${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s`;
        } else if (time.hours > 0) {
          return `${time.hours}h ${time.minutes}m ${time.seconds}s`;
        } else if (time.minutes > 0) {
          return `${time.minutes}m ${time.seconds}s`;
        } else {
          return `${time.seconds}s`;
        }
      },

      handleBenefitTypeChange: (value) => {
        set((state) => ({
          formData: {
            ...state.formData,
            benefitType: value,
            benefitUnit: value === "time" ? "minutes" : "$",
          },
        }));
      },
    }),
    {
      name: STORAGE_KEYS.zustandStorage,
      // Only store needed properties
      partialize: (state) => ({ items: state.items }),
    }
  )
);
