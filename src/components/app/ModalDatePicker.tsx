"use client";

import dayjs from "dayjs";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
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
import { Input } from "../ui/input";
import ScrollWheel from "./ScrollWheel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (date: string) => void;
  initialDate?: string;
  title?: string;
  description?: string;
  includeTime?: boolean;
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

  // Single state for selected date/time
  const [selectedDateTime, setSelectedDateTime] = useState(initDate);

  // Derived values using useMemo
  const selectedMonth = useMemo(
    () => selectedDateTime.month(),
    [selectedDateTime]
  );
  const selectedDay = useMemo(
    () => selectedDateTime.date(),
    [selectedDateTime]
  );
  const selectedYear = useMemo(
    () => selectedDateTime.year(),
    [selectedDateTime]
  );
  const selectedHour = useMemo(
    () => selectedDateTime.hour(),
    [selectedDateTime]
  );
  const selectedMinute = useMemo(
    () => selectedDateTime.minute(),
    [selectedDateTime]
  );

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
  }); // Get days in selected month/year
  const daysInMonth = useMemo(
    () => selectedDateTime.daysInMonth(),
    [selectedDateTime]
  );

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
  }); // Adjust selected values if they become invalid due to date restrictions
  const validateDateTime = useCallback(
    (dateTime: dayjs.Dayjs) => {
      let newDateTime = dateTime;

      // Get current values
      const currentYear = dateTime.year();
      const currentMonth = dateTime.month();
      const currentDay = dateTime.date();
      const currentHour = dateTime.hour();
      const currentMinute = dateTime.minute();

      // Adjust year if it's beyond max year
      if (currentYear > maxYear) {
        newDateTime = newDateTime.year(maxYear);
      }

      // Adjust month if it's beyond max month for max year
      if (newDateTime.year() === maxYear && currentMonth > maxMonth) {
        newDateTime = newDateTime.month(maxMonth);
      }

      // Adjust day if it's invalid for the selected month or beyond max day
      const maxDayForMonth =
        newDateTime.year() === maxYear && newDateTime.month() === maxMonth
          ? Math.min(newDateTime.daysInMonth(), maxDay)
          : newDateTime.daysInMonth();

      if (currentDay > maxDayForMonth) {
        newDateTime = newDateTime.date(maxDayForMonth);
      }

      // Adjust hour if it's beyond max hour for current date
      if (
        newDateTime.year() === maxYear &&
        newDateTime.month() === maxMonth &&
        newDateTime.date() === maxDay &&
        currentHour > maxHour
      ) {
        newDateTime = newDateTime.hour(maxHour);
      }

      // Adjust minute if it's beyond max minute for current date and hour
      if (
        newDateTime.year() === maxYear &&
        newDateTime.month() === maxMonth &&
        newDateTime.date() === maxDay &&
        newDateTime.hour() === maxHour &&
        currentMinute > maxMinute
      ) {
        newDateTime = newDateTime.minute(maxMinute);
      }

      return newDateTime;
    },
    [maxYear, maxMonth, maxDay, maxHour, maxMinute]
  );

  // Use ref to track if we're in a validation update to prevent loops
  const isValidatingRef = useRef(false);

  useEffect(() => {
    // Skip validation if we're already in a validation update
    if (isValidatingRef.current) {
      isValidatingRef.current = false;
      return;
    }

    const validatedDateTime = validateDateTime(selectedDateTime);

    // Only update if there was a change
    if (!validatedDateTime.isSame(selectedDateTime)) {
      isValidatingRef.current = true;
      setSelectedDateTime(validatedDateTime);
    }
  }, [selectedDateTime, validateDateTime]);

  const handleConfirm = () => {
    const finalDateTime = includeTime
      ? selectedDateTime
      : selectedDateTime.hour(0).minute(0).second(0).millisecond(0);

    // Return in the format expected by the form (YYYY-MM-DDTHH:mm)
    onSelect(finalDateTime.format("YYYY-MM-DDTHH:mm"));
    onClose();
  };
  const selectedDateDisplay = selectedDateTime;

  // Initialize calendarValue with the selectedDateTime
  const [calendarValue, setCalendarValue] = useState<Date | undefined>(
    new Date(
      selectedDateTime.year(),
      selectedDateTime.month(),
      selectedDateTime.date()
    )
  );

  // Sync calendarValue when selectedDateTime changes
  useEffect(() => {
    setCalendarValue(
      new Date(
        selectedDateTime.year(),
        selectedDateTime.month(),
        selectedDateTime.date()
      )
    );
  }, [selectedDateTime]);

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
          <div className="block md:hidden">
            <div
              className={`grid gap-6 ${
                includeTime ? "grid-cols-5" : "grid-cols-3"
              } justify-items-center`}
            >
              <div className="flex flex-col items-center">
                <label className="text-primary font-semibold mb-2 text-xs uppercase tracking-wider">
                  Day
                </label>
                <ScrollWheel
                  options={dayOptions}
                  value={selectedDay}
                  onChange={(day) =>
                    setSelectedDateTime((prev) => prev.date(day))
                  }
                  itemHeight={50}
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-primary font-semibold mb-2 text-xs uppercase tracking-wider">
                  Month
                </label>
                <ScrollWheel
                  options={monthOptions}
                  value={selectedMonth}
                  onChange={(month) =>
                    setSelectedDateTime((prev) => prev.month(month))
                  }
                  itemHeight={50}
                />
              </div>

              <div className="flex flex-col items-center">
                <label className="text-primary font-semibold mb-2 text-xs uppercase tracking-wider">
                  Year
                </label>
                <ScrollWheel
                  options={yearOptions}
                  value={selectedYear}
                  onChange={(year) =>
                    setSelectedDateTime((prev) => prev.year(year))
                  }
                  itemHeight={50}
                />
              </div>

              {includeTime && (
                <>
                  <div className="flex flex-col items-center">
                    <label className="text-primary font-semibold mb-2 text-xs uppercase tracking-wider">
                      Hour
                    </label>
                    <ScrollWheel
                      options={hourOptions}
                      value={selectedHour}
                      onChange={(hour) =>
                        setSelectedDateTime((prev) => prev.hour(hour))
                      }
                      itemHeight={50}
                    />
                  </div>

                  <div className="flex flex-col items-center">
                    <label className="text-primary font-semibold mb-2 text-xs uppercase tracking-wider">
                      Min
                    </label>
                    <ScrollWheel
                      options={minuteOptions}
                      value={selectedMinute}
                      onChange={(minute) =>
                        setSelectedDateTime((prev) => prev.minute(minute))
                      }
                      itemHeight={50}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex flex-col gap-2 items-center">
              <Calendar
                mode="single"
                selected={calendarValue}
                onSelect={(selected) => {
                  if (selected) {
                    const newDate = dayjs(selected);
                    // Preserve the time from current selectedDateTime
                    const updatedDateTime = selectedDateTime
                      .year(newDate.year())
                      .month(newDate.month())
                      .date(newDate.date());

                    setSelectedDateTime(updatedDateTime);
                    setCalendarValue(selected);
                  }
                }}
                className="rounded-md border shadow-sm"
                captionLayout="dropdown"
                disabled={(date) => {
                  // Disable future dates (only allow past and today)
                  return dayjs(date).isAfter(dayjs(), "day");
                }}
              />
              <div className="flex flex-col gap-3">
                <Input
                  type="time"
                  id="time"
                  step="1"
                  value={selectedDateDisplay.format("HH:mm")}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value
                      .split(":")
                      .map(Number);
                    setSelectedDateTime((prev) =>
                      prev.hour(hours).minute(minutes)
                    );
                  }}
                />
              </div>
            </div>
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
