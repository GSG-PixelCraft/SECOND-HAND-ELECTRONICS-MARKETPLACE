export type AdminDatePreset =
  | "today"
  | "yesterday"
  | "last7"
  | "last30"
  | "custom"
  | "all";

export interface AdminDateRangeValue {
  preset: AdminDatePreset;
  startDate?: string;
  endDate?: string;
}

interface ResolveDateRangeParams {
  datePreset?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  dateRange?: string | null;
}

export const ADMIN_DATE_PRESET_OPTIONS: Array<{
  value: Exclude<AdminDatePreset, "all">;
  label: string;
}> = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7", label: "Last 7 Days" },
  { value: "last30", label: "Last 30 Days" },
  { value: "custom", label: "Custom Range" },
];

const PRESET_LABELS: Record<AdminDatePreset, string> = {
  today: "Today",
  yesterday: "Yesterday",
  last7: "Last 7 Days",
  last30: "Last 30 Days",
  custom: "Custom Range",
  all: "All Time",
};

const pad = (value: number) => value.toString().padStart(2, "0");

const isAdminDatePreset = (value?: string | null): value is AdminDatePreset =>
  value === "today" ||
  value === "yesterday" ||
  value === "last7" ||
  value === "last30" ||
  value === "custom" ||
  value === "all";

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);

const endOfDay = (date: Date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );

export const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const formatDateInput = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const parseDateInput = (value?: string | null): Date | null => {
  if (!value) return null;
  const [yearString, monthString, dayString] = value.split("-");
  const year = Number.parseInt(yearString, 10);
  const month = Number.parseInt(monthString, 10);
  const day = Number.parseInt(dayString, 10);
  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }
  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }
  return parsed;
};

export const formatDateLabel = (value?: string | null) => {
  const parsed = parseDateInput(value);
  if (!parsed) return "--";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getPresetRange = (
  preset: Exclude<AdminDatePreset, "custom">,
): AdminDateRangeValue => {
  const today = startOfDay(new Date());

  switch (preset) {
    case "today": {
      const date = formatDateInput(today);
      return { preset: "today", startDate: date, endDate: date };
    }
    case "yesterday": {
      const yesterday = formatDateInput(addDays(today, -1));
      return { preset: "yesterday", startDate: yesterday, endDate: yesterday };
    }
    case "last7": {
      return {
        preset: "last7",
        startDate: formatDateInput(addDays(today, -6)),
        endDate: formatDateInput(today),
      };
    }
    case "last30": {
      return {
        preset: "last30",
        startDate: formatDateInput(addDays(today, -29)),
        endDate: formatDateInput(today),
      };
    }
    case "all":
      return { preset: "all" };
  }
};

export const normalizeDateRangeValue = (
  value: AdminDateRangeValue,
): AdminDateRangeValue => {
  if (value.preset === "all") {
    return { preset: "all" };
  }

  if (value.preset !== "custom") {
    return getPresetRange(value.preset);
  }

  const start = parseDateInput(value.startDate);
  const end = parseDateInput(value.endDate);

  if (start && end && start.getTime() > end.getTime()) {
    return {
      preset: "custom",
      startDate: formatDateInput(end),
      endDate: formatDateInput(start),
    };
  }

  return {
    preset: "custom",
    ...(start ? { startDate: formatDateInput(start) } : {}),
    ...(end ? { endDate: formatDateInput(end) } : {}),
  };
};

export const legacyDateRangeToValue = (
  dateRange?: string | null,
): AdminDateRangeValue | null => {
  if (!dateRange) return null;
  if (dateRange === "7") return getPresetRange("last7");
  if (dateRange === "30") return getPresetRange("last30");
  if (dateRange === "all") return { preset: "all" };

  if (dateRange === "90") {
    const today = startOfDay(new Date());
    return {
      preset: "custom",
      startDate: formatDateInput(addDays(today, -89)),
      endDate: formatDateInput(today),
    };
  }

  return null;
};

export const resolveDateRangeValue = (
  params: ResolveDateRangeParams,
  defaultPreset: Exclude<AdminDatePreset, "custom" | "all"> = "last7",
): AdminDateRangeValue => {
  if (isAdminDatePreset(params.datePreset)) {
    if (params.datePreset === "all") {
      return { preset: "all" };
    }
    if (params.datePreset === "custom") {
      return normalizeDateRangeValue({
        preset: "custom",
        startDate: params.startDate || undefined,
        endDate: params.endDate || undefined,
      });
    }
    return getPresetRange(params.datePreset);
  }

  if (params.startDate || params.endDate) {
    return normalizeDateRangeValue({
      preset: "custom",
      startDate: params.startDate || undefined,
      endDate: params.endDate || undefined,
    });
  }

  const legacy = legacyDateRangeToValue(params.dateRange);
  if (legacy) return legacy;

  return getPresetRange(defaultPreset);
};

export const toDateRangeQueryParams = (value: AdminDateRangeValue) => {
  const normalized = normalizeDateRangeValue(value);

  if (normalized.preset === "all") {
    return { datePreset: "all" } as Record<string, string>;
  }

  return {
    datePreset: normalized.preset,
    ...(normalized.startDate ? { startDate: normalized.startDate } : {}),
    ...(normalized.endDate ? { endDate: normalized.endDate } : {}),
  };
};

export const getDateRangeDisplayLabel = (value: AdminDateRangeValue) => {
  const normalized = normalizeDateRangeValue(value);
  if (normalized.preset !== "custom") {
    return PRESET_LABELS[normalized.preset];
  }
  if (normalized.startDate && normalized.endDate) {
    return `${formatDateLabel(normalized.startDate)} - ${formatDateLabel(normalized.endDate)}`;
  }
  return PRESET_LABELS.custom;
};

export const isDateInRange = (
  dateValue: string,
  value: AdminDateRangeValue,
) => {
  const normalized = normalizeDateRangeValue(value);
  if (normalized.preset === "all") return true;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;

  if (normalized.startDate) {
    const start = parseDateInput(normalized.startDate);
    if (start && date.getTime() < startOfDay(start).getTime()) {
      return false;
    }
  }

  if (normalized.endDate) {
    const end = parseDateInput(normalized.endDate);
    if (end && date.getTime() > endOfDay(end).getTime()) {
      return false;
    }
  }

  return true;
};
