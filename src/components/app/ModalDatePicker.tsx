"use client";

import dayjs from "dayjs";
import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Check, X, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (date: string) => void;
  initialDate?: string;
  title?: string;
  description?: string;
  includeTime?: boolean;
}

interface ScrollWheelProps {
  options: Array<{ value: number; label: string }>;
  value: number;
  onChange: (value: number) => void;
  itemHeight?: number;
}

function ScrollWheel({
  options,
  value,
  onChange,
  itemHeight = 50,
}: ScrollWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const visibleItems = 5; // Fixed to show exactly 5 items
  const paddingItems = 2; // 2 items above and below the center item

  // Create extended options array with padding
  const extendedOptions = [
    ...Array(paddingItems)
      .fill(null)
      .map(() => ({ value: -1, label: "" })),
    ...options,
    ...Array(paddingItems)
      .fill(null)
      .map(() => ({ value: -1, label: "" })),
  ];

  const scrollToValue = (targetValue: number, smooth = false) => {
    const index = options.findIndex((option) => option.value === targetValue);
    if (index !== -1 && containerRef.current) {
      const scrollTop = index * itemHeight;
      if (smooth) {
        containerRef.current.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      } else {
        containerRef.current.scrollTop = scrollTop;
      }
    }
  };

  const handleScroll = () => {
    if (!containerRef.current || !isUserScrollingRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const option = options[index];

    if (option && option.value !== value && option.value !== -1) {
      onChange(option.value);
    }
  };

  const snapToNearestItem = () => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const snapScrollTop = index * itemHeight;

    // Snap to the nearest item
    containerRef.current.scrollTo({
      top: snapScrollTop,
      behavior: "smooth",
    });

    // Update the selected value
    const option = options[index];
    if (option && option.value !== value && option.value !== -1) {
      onChange(option.value);
    }
  };

  const handleInteractionStart = () => {
    isUserScrollingRef.current = true;
  };

  const handleInteractionEnd = () => {
    if (isUserScrollingRef.current) {
      snapToNearestItem();
      isUserScrollingRef.current = false;
    }
  };

  useEffect(() => {
    scrollToValue(value);
  }, [value]);

  // Setup event listeners for touch and mouse events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("touchstart", handleInteractionStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleInteractionEnd, {
      passive: true,
    });
    container.addEventListener("mousedown", handleInteractionStart);
    container.addEventListener("mouseup", handleInteractionEnd);
    container.addEventListener("mouseleave", handleInteractionEnd);

    return () => {
      container.removeEventListener("touchstart", handleInteractionStart);
      container.removeEventListener("touchend", handleInteractionEnd);
      container.removeEventListener("mousedown", handleInteractionStart);
      container.removeEventListener("mouseup", handleInteractionEnd);
      container.removeEventListener("mouseleave", handleInteractionEnd);
    };
  }, []);
  return (
    <div className="relative">
      {/* Background */}
      <div className="absolute inset-0 p-1">
        <div className="w-full h-full bg-card/50 rounded-lg border border-border/20"></div>
      </div>{" "}
      {/* Selection highlight - positioned at the center (3rd item, index 2) */}
      <div
        className="absolute left-1 right-1 bg-primary/15 border-2 border-primary/40 rounded-lg z-10 shadow-inner"
        style={{
          top: `${Math.floor(visibleItems / 2) * itemHeight + 1}px`, // Center item
          height: `${itemHeight}px`,
        }}
      />
      {/* Scroll container - fixed height for exactly 5 items */}
      <div
        ref={containerRef}
        className="relative z-20 overflow-y-scroll scrollbar-hide"
        style={{ height: `${visibleItems * itemHeight}px` }} // Exactly 5 items visible
        onScroll={handleScroll}
      >
        {extendedOptions.map((option, index) => (
          <div
            key={`${option.value}-${index}`}
            className={`px-6 flex items-center justify-center font-bold transition-all duration-300 cursor-pointer select-none ${
              option.value === -1
                ? "opacity-0 pointer-events-none"
                : "opacity-50 hover:opacity-80"
            } ${
              option.value === value
                ? "text-primary text-xl font-extrabold scale-110 drop-shadow-md"
                : "text-muted-foreground text-lg"
            }`}
            style={{ height: `${itemHeight}px` }}
            onClick={() => {
              if (option.value !== -1) {
                isUserScrollingRef.current = false;
                onChange(option.value);
                scrollToValue(option.value, true);
              }
            }}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ModalDatePicker({
  isOpen,
  onClose,
  onSelect,
  initialDate,
  title = "Select Date & Time",
  description = "Choose your date and time using the wheel selectors",
  includeTime = true,
}: Props) {
  // Parse initial date or use current date
  const initDate = initialDate ? dayjs(initialDate) : dayjs();
  const [selectedMonth, setSelectedMonth] = useState(initDate.month());
  const [selectedDay, setSelectedDay] = useState(initDate.date());
  const [selectedYear, setSelectedYear] = useState(initDate.year());
  const [selectedHour, setSelectedHour] = useState(initDate.hour());
  const [selectedMinute, setSelectedMinute] = useState(initDate.minute());

  // Calculate maximum allowed date (current date - no future dates allowed)
  const maxDate = dayjs();
  const maxYear = maxDate.year();
  const maxMonth = maxDate.month();
  const maxDay = maxDate.date();
  const maxHour = maxDate.hour();
  const maxMinute = maxDate.minute();

  // Generate year options (from 10 years ago to current year)
  const currentYear = dayjs().year();
  const yearOptions = Array.from(
    { length: 11 }, // 11 years: 10 years ago + current year
    (_, i) => ({
      value: currentYear - 10 + i,
      label: (currentYear - 10 + i).toString(),
    })
  );

  // Generate month options (filter if selected year is max year)
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: dayjs().month(i).format("MMM"),
  })).filter((option) => {
    if (selectedYear === maxYear) {
      return option.value <= maxMonth;
    }
    return true;
  });
  // Get days in selected month/year
  const daysInMonth = dayjs()
    .year(selectedYear)
    .month(selectedMonth)
    .daysInMonth();

  // Generate day options (filter if selected year/month is max year/month)
  const dayOptions = Array.from({ length: daysInMonth }, (_, i) => ({
    value: i + 1,
    label: (i + 1).toString().padStart(2, "0"),
  })).filter((option) => {
    if (selectedYear === maxYear && selectedMonth === maxMonth) {
      return option.value <= maxDay;
    }
    return true;
  });

  // Hour options (0-23) - filter if selected date is today
  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: i.toString().padStart(2, "0"),
  })).filter((option) => {
    if (
      selectedYear === maxYear &&
      selectedMonth === maxMonth &&
      selectedDay === maxDay
    ) {
      return option.value <= maxHour;
    }
    return true;
  });

  // Minute options (0-59) - filter if selected date and hour is current
  const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i,
    label: i.toString().padStart(2, "0"),
  })).filter((option) => {
    if (
      selectedYear === maxYear &&
      selectedMonth === maxMonth &&
      selectedDay === maxDay &&
      selectedHour === maxHour
    ) {
      return option.value <= maxMinute;
    }
    return true;
  });
  // Adjust selected values if they become invalid due to date restrictions
  useEffect(() => {
    // Adjust year if it's beyond max year
    if (selectedYear > maxYear) {
      setSelectedYear(maxYear);
      return;
    }

    // Adjust month if it's beyond max month for max year
    if (selectedYear === maxYear && selectedMonth > maxMonth) {
      setSelectedMonth(maxMonth);
      return;
    }

    // Adjust day if it's invalid for the selected month or beyond max day
    const maxDayForMonth =
      selectedYear === maxYear && selectedMonth === maxMonth
        ? Math.min(daysInMonth, maxDay)
        : daysInMonth;

    if (selectedDay > maxDayForMonth) {
      setSelectedDay(maxDayForMonth);
      return;
    }

    // Adjust hour if it's beyond max hour for current date
    if (
      selectedYear === maxYear &&
      selectedMonth === maxMonth &&
      selectedDay === maxDay &&
      selectedHour > maxHour
    ) {
      setSelectedHour(maxHour);
      return;
    }

    // Adjust minute if it's beyond max minute for current date and hour
    if (
      selectedYear === maxYear &&
      selectedMonth === maxMonth &&
      selectedDay === maxDay &&
      selectedHour === maxHour &&
      selectedMinute > maxMinute
    ) {
      setSelectedMinute(maxMinute);
    }
  }, [
    selectedMonth,
    selectedYear,
    daysInMonth,
    selectedDay,
    selectedHour,
    selectedMinute,
    maxYear,
    maxMonth,
    maxDay,
    maxHour,
    maxMinute,
  ]);

  const handleConfirm = () => {
    const selectedDate = dayjs()
      .year(selectedYear)
      .month(selectedMonth)
      .date(selectedDay)
      .hour(includeTime ? selectedHour : 0)
      .minute(includeTime ? selectedMinute : 0)
      .second(0)
      .millisecond(0);

    // Return in the format expected by the form (YYYY-MM-DDTHH:mm)
    onSelect(selectedDate.format("YYYY-MM-DDTHH:mm"));
    onClose();
  };

  const selectedDateDisplay = dayjs()
    .year(selectedYear)
    .month(selectedMonth)
    .date(selectedDay)
    .hour(selectedHour)
    .minute(selectedMinute);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <CalendarIcon className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Date & Time Selector */}
        <div className="py-6">
          <div className="block lg:hidden">
            <div
              className={`grid gap-6 ${
                includeTime ? "grid-cols-5" : "grid-cols-3"
              } justify-items-center`}
            >
              {/* Month Wheel */}
              <div className="flex flex-col items-center">
                <label className="text-primary font-semibold mb-2 text-xs uppercase tracking-wider">
                  Month
                </label>
                <ScrollWheel
                  options={monthOptions}
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                  itemHeight={50}
                />
              </div>

              {/* Day Wheel */}
              <div className="flex flex-col items-center">
                <label className="text-primary font-semibold mb-2 text-xs uppercase tracking-wider">
                  Day
                </label>
                <ScrollWheel
                  options={dayOptions}
                  value={selectedDay}
                  onChange={setSelectedDay}
                  itemHeight={50}
                />
              </div>

              {/* Year Wheel */}
              <div className="flex flex-col items-center">
                <label className="text-primary font-semibold mb-2 text-xs uppercase tracking-wider">
                  Year
                </label>
                <ScrollWheel
                  options={yearOptions}
                  value={selectedYear}
                  onChange={setSelectedYear}
                  itemHeight={50}
                />
              </div>

              {/* Time Wheels */}
              {includeTime && (
                <>
                  {/* Hour Wheel */}
                  <div className="flex flex-col items-center">
                    <label className="text-primary font-semibold mb-2 text-xs uppercase tracking-wider">
                      Hour
                    </label>
                    <ScrollWheel
                      options={hourOptions}
                      value={selectedHour}
                      onChange={setSelectedHour}
                      itemHeight={50}
                    />
                  </div>

                  {/* Minute Wheel */}
                  <div className="flex flex-col items-center">
                    <label className="text-primary font-semibold mb-2 text-xs uppercase tracking-wider">
                      Min
                    </label>
                    <ScrollWheel
                      options={minuteOptions}
                      value={selectedMinute}
                      onChange={setSelectedMinute}
                      itemHeight={50}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="hidden lg:block">
            <Calendar
              mode="single"
              selected={
                selectedDateDisplay
                  ? new Date(selectedDateDisplay.toISOString())
                  : undefined
              }
              onSelect={(selected) => {
                const val = dayjs(selected);
                console.log({ val });
              }}
              className="rounded-md border shadow-sm"
              captionLayout="dropdown"
            />
          </div>
          {/* Selected Date Display */}
          <div className="mt-6 p-4 bg-card/50 rounded-lg border border-border/20">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-1">
                <Clock className="h-4 w-4" />
                Selected Date & Time
              </div>
              <div className="text-lg font-semibold text-foreground">
                {includeTime
                  ? selectedDateDisplay.format("MMMM DD, YYYY [at] h:mm A")
                  : selectedDateDisplay.format("MMMM DD, YYYY")}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
