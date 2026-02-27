import { useMemo, useRef, useState } from "react";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/Textarea/textarea";
import { Button } from "@/components/ui/Button/button";
import { Portal } from "@/components/ui/Portal/portal";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
} from "lucide-react";
import {
  MAX_MESSAGE_LENGTH,
  calendarWeekDays,
  iconRows,
  iconToneClass,
  isSameDay,
  monthOptions,
  notificationIcons,
  statusBadgeBase,
  yearOptions,
} from "./notificationsSettings.data";

const NotificationsSettingsPage = () => {
  const [selectedIcon, setSelectedIcon] = useState(notificationIcons[0]);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconPickerPosition, setIconPickerPosition] = useState({
    top: 0,
    left: 0,
  });
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(new Date(2026, 0, 1));
  const [scheduleDate, setScheduleDate] = useState(new Date(2026, 0, 20));
  const [scheduleTime, setScheduleTime] = useState("10:00");
  const iconTriggerRef = useRef<HTMLButtonElement | null>(null);

  const [title, setTitle] = useState("");
  const [targetCountry, setTargetCountry] = useState("All Countries");
  const [userState, setUserState] = useState("All Users");
  const [message, setMessage] = useState("");

  const charsCount = message.length;
  const messageCounter = useMemo(
    () => `(${charsCount}/${MAX_MESSAGE_LENGTH})`,
    [charsCount],
  );
  const calendarCells = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0).getDate();
    const leadingEmptyDays = (firstDay.getDay() + 6) % 7;

    const cells: Array<Date | null> = [];
    for (let i = 0; i < leadingEmptyDays; i += 1) cells.push(null);
    for (let day = 1; day <= lastDate; day += 1) {
      cells.push(new Date(year, month, day));
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [visibleMonth]);
  const selectedDateLabel = useMemo(
    () =>
      scheduleDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    [scheduleDate],
  );
  const visibleYear = visibleMonth.getFullYear();
  const visibleMonthIndex = visibleMonth.getMonth();

  const setMonthAndYear = (nextYear: number, nextMonthIndex: number) => {
    const day = scheduleDate.getDate();
    const maxDay = new Date(nextYear, nextMonthIndex + 1, 0).getDate();
    const nextDay = Math.min(day, maxDay);
    const nextDate = new Date(nextYear, nextMonthIndex, nextDay);
    setVisibleMonth(new Date(nextYear, nextMonthIndex, 1));
    setScheduleDate(nextDate);
  };

  const handleSendNotification = () => {
    setShowSuccessBanner(true);
  };

  const handleToggleIconPicker = () => {
    if (showIconPicker) {
      setShowIconPicker(false);
      return;
    }

    const rect = iconTriggerRef.current?.getBoundingClientRect();
    if (!rect) {
      setShowIconPicker(true);
      return;
    }

    const gap = 10;
    const top = rect.bottom + gap;
    const left = rect.left;
    setIconPickerPosition({ top, left });
    setShowIconPicker(true);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-['Poppins'] text-[50px] font-semibold leading-[1.2] text-[#101010] max-[1200px]:text-[36px]">
          Notification Management
        </h1>
        {showSuccessBanner ? (
          <div
            className="relative flex min-h-[72px] w-full max-w-[520px] items-center gap-3 overflow-hidden rounded-[16px] border border-[#DDE2E8] bg-white py-3 pl-5 pr-4 shadow-[0_4px_12px_rgba(16,24,40,0.08)]"
            style={{ borderLeft: "5px solid #22C55E" }}
          >
            <p className="min-w-0 flex-1 text-[16px] font-medium leading-[1.25] text-[#1F2937]">
              Notification Sent Successfully
            </p>
            <button
              type="button"
              className="shrink-0 text-[16px] font-medium leading-none text-[#2563EB]"
              onClick={() => setShowSuccessBanner(false)}
            >
              undo
            </button>
          </div>
        ) : null}
      </div>

      <section className="rounded-[18px] border border-[#e8e8e8] bg-white p-6 shadow-[0px_1px_2px_rgba(16,24,40,0.04)]">
        <h2 className="font-['Poppins'] text-[42px] font-semibold text-[#101010] max-[1200px]:text-[28px]">
          Compose Notification
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-5">
          <div className="flex items-end gap-4">
            <div className="relative w-[118px] shrink-0">
              <button
                ref={iconTriggerRef}
                type="button"
                className="flex h-16 w-full items-center justify-between rounded-[12px] border border-[#DFE2E7] bg-white px-3"
                onClick={handleToggleIconPicker}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${iconToneClass[selectedIcon.tone]}`}
                >
                  {selectedIcon.icon}
                </span>
                <ChevronDown className="h-5 w-5 text-[#8B8B8B]" />
              </button>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <label className="text-[14px] font-medium text-[#555]">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="ex. user verified"
                className="h-16 w-full rounded-[12px] border border-[#DFE2E7] bg-white px-4 text-[36px] text-[#3D3D3D] outline-none placeholder:text-[#B9B9B9] focus:border-[#2563EB] max-[1200px]:text-[20px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#555]">
                Target Audience (Country)
              </label>
              <div className="relative">
                <Select
                  value={targetCountry}
                  onChange={(event) => setTargetCountry(event.target.value)}
                  className="h-14 appearance-none rounded-[12px] border-[#DFE2E7] bg-white px-4 pr-10 text-[18px] text-[#3D3D3D]"
                >
                  <option>All Countries</option>
                  <option>Palestine</option>
                  <option>Jordan</option>
                  <option>Saudi Arabia</option>
                </Select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8B8B8B]" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#555]">
                User State
              </label>
              <div className="relative">
                <Select
                  value={userState}
                  onChange={(event) => setUserState(event.target.value)}
                  className="h-14 appearance-none rounded-[12px] border-[#DFE2E7] bg-white px-4 pr-10 text-[18px] text-[#3D3D3D]"
                >
                  <option>All Users</option>
                  <option>Verified</option>
                  <option>Unverified</option>
                  <option>Blocked</option>
                </Select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8B8B8B]" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#555]">
              Message Content
            </label>
            <div className="relative">
              <Textarea
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value.slice(0, MAX_MESSAGE_LENGTH))
                }
                placeholder="Write your notification message here..."
                className="min-h-[190px] rounded-[12px] border-[#DFE2E7] px-4 py-4 text-[18px] text-[#3D3D3D] placeholder:text-[#B9B9B9]"
              />
              <span className="absolute bottom-4 right-4 text-[14px] text-[#9CA3AF]">
                {messageCounter}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              intent="outline"
              className="h-10 rounded-[12px] border-[#3B82F6] px-6 text-[16px] text-[#2563EB]"
              onClick={() => setShowScheduleModal(true)}
            >
              Schedule Notification
            </Button>
            <Button
              intent="primary"
              className="h-10 rounded-[12px] px-6 text-[16px]"
              onClick={handleSendNotification}
            >
              Send Notification
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-[18px] border border-[#e8e8e8] bg-white p-6 shadow-[0px_1px_2px_rgba(16,24,40,0.04)]">
        <div className="border-b border-[#ECEFF3] pb-2">
          <div className="inline-flex items-center gap-2 border-b-2 border-[#3B82F6] pb-2">
            <h2 className="text-[20px] font-medium text-[#2563EB]">
              Recent History
            </h2>
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#DDE7FF] px-1 text-[14px] font-medium text-[#2563EB]">
              3
            </span>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="bg-[#EEF3FF] text-left">
                <th className="rounded-l-[10px] px-4 py-3 text-[14px] font-medium text-[#3f3f46]">
                  Date & Time ↕
                </th>
                <th className="px-4 py-3 text-[14px] font-medium text-[#3f3f46]">
                  Notification ↕
                </th>
                <th className="px-4 py-3 text-[14px] font-medium text-[#3f3f46]">
                  Target Audience ↕
                </th>
                <th className="px-4 py-3 text-[14px] font-medium text-[#3f3f46]">
                  Status ↕
                </th>
                <th className="rounded-r-[10px] px-4 py-3 text-[14px] font-medium text-[#3f3f46]">
                  Action ↕
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#ECEFF3]">
                <td className="px-4 py-5 text-[14px] text-[#52525b]">
                  18-10-2026 • 10:42 AM
                </td>
                <td className="px-4 py-5 text-[14px] text-[#52525b]">
                  Listing Approved
                </td>
                <td className="px-4 py-5 text-[14px] text-[#52525b]">
                  User Ahmad
                </td>
                <td className="px-4 py-5">
                  <span
                    className={`${statusBadgeBase} bg-[#DCFCE7] text-[#22C55E]`}
                  >
                    Sent
                  </span>
                </td>
                <td className="px-4 py-5">
                  <button className="text-[#7b7b7b]">
                    <Eye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
              <tr className="border-b border-[#ECEFF3]">
                <td className="px-4 py-5 text-[14px] text-[#52525b]">
                  17-10-2026 • 11:05 AM
                </td>
                <td className="px-4 py-5 text-[14px] text-[#52525b]">
                  Verification Approve
                </td>
                <td className="px-4 py-5 text-[14px] text-[#52525b]">
                  Palestine
                </td>
                <td className="px-4 py-5">
                  <span
                    className={statusBadgeBase}
                    style={{ backgroundColor: "#FFF6D9", color: "#E0A800" }}
                  >
                    Scheduled
                  </span>
                </td>
                <td className="px-4 py-5">
                  <button className="text-[#7b7b7b]">
                    <Eye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-5 text-[14px] text-[#52525b]">
                  16-10-2026 • 9:30 AM
                </td>
                <td className="px-4 py-5 text-[14px] text-[#52525b]">
                  Account Warning
                </td>
                <td className="px-4 py-5 text-[14px] text-[#52525b]">Jordan</td>
                <td className="px-4 py-5">
                  <span
                    className={`${statusBadgeBase} bg-[#FEE2E2] text-[#EF4444]`}
                  >
                    Failed
                  </span>
                </td>
                <td className="px-4 py-5">
                  <button className="text-[#7b7b7b]">
                    <Eye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {showScheduleModal ? (
        <Portal>
          <div
            className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-[#6B7280]/55 p-4"
            style={{
              width: "100vw",
              height: "100vh",
            }}
          >
            <div
              className="absolute inset-0"
              onClick={() => setShowScheduleModal(false)}
            />
            <div className="relative w-full max-w-[420px] rounded-[16px] border border-[#E5E7EB] bg-white p-4 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
              <div className="mb-3 flex items-center justify-between px-1">
                <button
                  type="button"
                  className="text-[#8B8B8B]"
                  onClick={() =>
                    setMonthAndYear(
                      visibleMonthIndex === 0 ? visibleYear - 1 : visibleYear,
                      visibleMonthIndex === 0 ? 11 : visibleMonthIndex - 1,
                    )
                  }
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2">
                  <select
                    value={visibleMonthIndex}
                    onChange={(event) =>
                      setMonthAndYear(visibleYear, Number(event.target.value))
                    }
                    className="h-8 rounded-[8px] border border-[#E5E7EB] bg-white px-2 text-[13px] font-medium text-[#2B2B2B] outline-none"
                  >
                    {monthOptions.map((monthName, index) => (
                      <option key={monthName} value={index}>
                        {monthName}
                      </option>
                    ))}
                  </select>
                  <select
                    value={visibleYear}
                    onChange={(event) =>
                      setMonthAndYear(
                        Number(event.target.value),
                        visibleMonthIndex,
                      )
                    }
                    className="h-8 rounded-[8px] border border-[#E5E7EB] bg-white px-2 text-[13px] font-medium text-[#2B2B2B] outline-none"
                  >
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  className="text-[#8B8B8B]"
                  onClick={() =>
                    setMonthAndYear(
                      visibleMonthIndex === 11 ? visibleYear + 1 : visibleYear,
                      visibleMonthIndex === 11 ? 0 : visibleMonthIndex + 1,
                    )
                  }
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-y-2.5 text-center text-[13px]">
                {calendarWeekDays.map((day) => (
                  <span key={day} className="text-[#3f3f46]">
                    {day}
                  </span>
                ))}
                {calendarCells.map((cell, idx) => (
                  <div
                    key={`${cell ? cell.toISOString() : "blank"}-${idx}`}
                    className="flex h-9 items-center justify-center"
                  >
                    {cell ? (
                      (() => {
                        const isSelected = isSameDay(cell, scheduleDate);
                        return (
                          <button
                            type="button"
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-[15px] ${
                              isSelected
                                ? "font-medium"
                                : "text-[#737373] hover:bg-[#EFF4FF]"
                            }`}
                            style={
                              isSelected
                                ? {
                                    backgroundColor: "#2563EB",
                                    color: "#FFFFFF",
                                  }
                                : undefined
                            }
                            onClick={() => setScheduleDate(cell)}
                          >
                            {cell.getDate()}
                          </button>
                        );
                      })()
                    ) : (
                      <span />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-medium text-[#2B2B2B]">
                    Date
                  </label>
                  <div className="flex h-10 items-center gap-2 rounded-[12px] border border-[#E5E7EB] bg-white px-3 text-[14px] text-[#52525b]">
                    <CalendarDays className="h-4 w-4 text-[#8B8B8B]" />
                    {selectedDateLabel}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-medium text-[#2B2B2B]">
                    Time
                  </label>
                  <div className="flex h-10 items-center gap-2 rounded-[12px] border border-[#E5E7EB] bg-white px-3 text-[14px] text-[#52525b]">
                    <Clock3 className="h-4 w-4 text-[#8B8B8B]" />
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(event) => setScheduleTime(event.target.value)}
                      className="w-full border-0 bg-transparent text-[14px] text-[#52525b] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <Button
                  intent="outline"
                  className="h-10 flex-1 rounded-[12px] border-[#3B82F6] text-[#2563EB]"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  intent="primary"
                  className="h-10 flex-1 rounded-[12px]"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Schedule
                </Button>
              </div>
            </div>
          </div>
        </Portal>
      ) : null}

      {showIconPicker ? (
        <Portal>
          <button
            type="button"
            aria-label="Close icon picker"
            className="fixed inset-0 z-[99] cursor-default bg-transparent"
            onClick={() => setShowIconPicker(false)}
          />
          <div
            className="fixed z-[100] w-[320px] rounded-[14px] border border-[#DFE2E7] bg-white p-6 shadow-[0_12px_24px_rgba(16,24,40,0.08)]"
            style={{
              top: `${iconPickerPosition.top}px`,
              left: `${iconPickerPosition.left}px`,
            }}
          >
            <div className="flex flex-col gap-6">
              {iconRows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-4">
                  {row.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${iconToneClass[item.tone]}`}
                      onClick={() => {
                        setSelectedIcon(item);
                        setShowIconPicker(false);
                      }}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Portal>
      ) : null}
    </div>
  );
};

export default NotificationsSettingsPage;
