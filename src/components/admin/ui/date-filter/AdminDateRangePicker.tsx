import { useEffect, useMemo, useRef, useState } from "react";
import type { HTMLAttributes } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  addDays,
  ADMIN_DATE_PRESET_OPTIONS,
  formatDateInput,
  formatDateLabel,
  getDateRangeDisplayLabel,
  getPresetRange,
  normalizeDateRangeValue,
  parseDateInput,
  type AdminDatePreset,
  type AdminDateRangeValue,
} from "./admin-date-range.utils";

const WEEK_DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const getInitialMonth = (value: AdminDateRangeValue) => {
  const preferred =
    parseDateInput(value.endDate) || parseDateInput(value.startDate);
  if (preferred) {
    return new Date(preferred.getFullYear(), preferred.getMonth(), 1);
  }
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
};

const buildMonthDays = (month: Date) => {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const startDate = addDays(firstDay, -mondayOffset);
  return Array.from({ length: 42 }, (_, index) => addDays(startDate, index));
};

export interface AdminDateRangePickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  value?: AdminDateRangeValue;
  onChange?: (value: AdminDateRangeValue) => void;
  align?: "left" | "right";
  disabled?: boolean;
  triggerClassName?: string;
}

export function AdminDateRangePicker({
  value,
  onChange,
  align = "right",
  disabled = false,
  className,
  triggerClassName,
  ...props
}: AdminDateRangePickerProps) {
  const fallbackValue = getPresetRange("last7");
  const normalizedValue = normalizeDateRangeValue(value || fallbackValue);

  const [isOpen, setIsOpen] = useState(false);
  const [draftValue, setDraftValue] =
    useState<AdminDateRangeValue>(normalizedValue);
  const [visibleMonth, setVisibleMonth] = useState<Date>(
    getInitialMonth(normalizedValue),
  );
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) return;
    setDraftValue(normalizedValue);
    setVisibleMonth(getInitialMonth(normalizedValue));
  }, [isOpen, normalizedValue]);

  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const days = useMemo(() => buildMonthDays(visibleMonth), [visibleMonth]);
  const todayKey = formatDateInput(new Date());
  const triggerLabel = getDateRangeDisplayLabel(normalizedValue);

  const openPicker = () => {
    if (disabled) return;
    setDraftValue(normalizedValue);
    setVisibleMonth(getInitialMonth(normalizedValue));
    setIsOpen(true);
  };

  const handlePresetSelect = (preset: Exclude<AdminDatePreset, "all">) => {
    if (preset === "custom") {
      setDraftValue((current) => {
        if (current.preset === "custom") return current;
        return {
          preset: "custom",
          startDate: normalizedValue.startDate,
          endDate: normalizedValue.endDate,
        };
      });
      return;
    }

    onChange?.(getPresetRange(preset));
    setIsOpen(false);
  };

  const handleDateClick = (date: Date) => {
    const selectedDate = formatDateInput(date);
    setDraftValue((current) => {
      const customValue: AdminDateRangeValue =
        current.preset === "custom" ? current : { preset: "custom" };

      if (
        !customValue.startDate ||
        (customValue.startDate && customValue.endDate)
      ) {
        return {
          preset: "custom",
          startDate: selectedDate,
          endDate: undefined,
        };
      }

      if (selectedDate < customValue.startDate) {
        return {
          preset: "custom",
          startDate: selectedDate,
          endDate: customValue.startDate,
        };
      }

      return {
        preset: "custom",
        startDate: customValue.startDate,
        endDate: selectedDate,
      };
    });
  };

  const handleApply = () => {
    if (
      draftValue.preset !== "custom" ||
      !draftValue.startDate ||
      !draftValue.endDate
    ) {
      return;
    }

    onChange?.(normalizeDateRangeValue(draftValue));
    setIsOpen(false);
  };

  const handleCancel = () => {
    setDraftValue(normalizedValue);
    setVisibleMonth(getInitialMonth(normalizedValue));
    setIsOpen(false);
  };

  const canApplyCustomRange =
    draftValue.preset === "custom" &&
    Boolean(draftValue.startDate) &&
    Boolean(draftValue.endDate);

  return (
    <div ref={rootRef} className={cn("relative", className)} {...props}>
      <button
        type="button"
        onClick={() => (isOpen ? setIsOpen(false) : openPicker())}
        disabled={disabled}
        className={cn(
          "text-neutral-80 inline-flex h-12 min-w-[170px] items-center justify-center gap-2 rounded-2xl border border-primary bg-white px-4 text-sm font-medium transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60",
          triggerClassName,
        )}
      >
        <Calendar className="h-4 w-4 text-primary" />
        <span>{triggerLabel}</span>
        <ChevronDown
          className={cn(
            "text-neutral-50 h-4 w-4 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen ? (
        <div
          className={cn(
            "absolute z-50 mt-2 overflow-hidden rounded-2xl border border-neutral-20 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.16)]",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          <div className="flex w-[680px] max-w-[calc(100vw-2rem)] flex-col md:flex-row">
            <div className="w-full border-b border-neutral-20 p-2 md:w-[220px] md:border-b-0 md:border-r">
              {ADMIN_DATE_PRESET_OPTIONS.map((option) => {
                const isSelected = draftValue.preset === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handlePresetSelect(option.value)}
                    className="flex w-full items-center gap-3 border-b border-neutral-10 px-4 py-4 text-left last:border-b-0"
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border-2",
                        isSelected ? "border-primary" : "border-neutral-40",
                      )}
                    >
                      {isSelected ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                      ) : null}
                    </span>
                    <span className="text-neutral-80 text-sm font-medium">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex-1 p-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleMonth(
                      (current) =>
                        new Date(
                          current.getFullYear(),
                          current.getMonth() - 1,
                          1,
                        ),
                    )
                  }
                  className="text-neutral-50 hover:text-neutral-70 rounded-md p-1 transition-colors hover:bg-neutral-10"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <h3 className="text-neutral-90 text-xl font-semibold">
                  {visibleMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setVisibleMonth(
                      (current) =>
                        new Date(
                          current.getFullYear(),
                          current.getMonth() + 1,
                          1,
                        ),
                    )
                  }
                  className="text-neutral-50 hover:text-neutral-70 rounded-md p-1 transition-colors hover:bg-neutral-10"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="text-neutral-50 mt-4 grid grid-cols-7 gap-1 text-center text-xs">
                {WEEK_DAYS.map((label) => (
                  <span key={label} className="py-2 font-medium">
                    {label}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((date) => {
                  const dateKey = formatDateInput(date);
                  const isCurrentMonth =
                    date.getMonth() === visibleMonth.getMonth();
                  const isBoundary =
                    dateKey === draftValue.startDate ||
                    dateKey === draftValue.endDate;
                  const isInRange =
                    Boolean(draftValue.startDate) &&
                    Boolean(draftValue.endDate) &&
                    dateKey >= (draftValue.startDate || "") &&
                    dateKey <= (draftValue.endDate || "");
                  const isToday = dateKey === todayKey;

                  return (
                    <button
                      key={dateKey}
                      type="button"
                      onClick={() => handleDateClick(date)}
                      className={cn(
                        "relative h-10 rounded-md text-sm transition-colors",
                        !isCurrentMonth && "text-neutral-30",
                        isBoundary
                          ? "bg-primary font-semibold text-white"
                          : isInRange
                            ? "bg-primary/15 text-primary"
                            : "text-neutral-70 hover:bg-neutral-10",
                      )}
                    >
                      {date.getDate()}
                      {isToday && !isBoundary ? (
                        <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cyan-500" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <span className="text-neutral-80 mb-2 block text-sm font-medium">
                    From
                  </span>
                  <div className="text-neutral-70 flex h-12 items-center gap-2 rounded-xl border border-neutral-20 px-3 text-sm">
                    <Calendar className="text-neutral-50 h-4 w-4" />
                    <span>{formatDateLabel(draftValue.startDate)}</span>
                  </div>
                </div>
                <div>
                  <span className="text-neutral-80 mb-2 block text-sm font-medium">
                    To
                  </span>
                  <div className="text-neutral-70 flex h-12 items-center gap-2 rounded-xl border border-neutral-20 px-3 text-sm">
                    <Calendar className="text-neutral-50 h-4 w-4" />
                    <span>{formatDateLabel(draftValue.endDate)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="h-12 rounded-xl border border-primary bg-white text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={!canApplyCustomRange}
                  className="disabled:text-neutral-50 h-12 rounded-xl border border-primary bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:border-neutral-20 disabled:bg-neutral-20"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export type { AdminDatePreset, AdminDateRangeValue };
