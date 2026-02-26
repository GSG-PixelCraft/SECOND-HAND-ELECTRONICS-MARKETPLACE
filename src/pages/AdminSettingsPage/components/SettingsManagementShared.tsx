import { Portal } from "@/components/ui/Portal/portal";
import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type ToastState = { type: "success" | "error"; message: string };

type ToastBannerProps = {
  toast: ToastState | null;
  onUndo: () => void;
};

export const SettingsToastBanner = ({ toast, onUndo }: ToastBannerProps) => {
  if (!toast) return null;

  return (
    <div
      className="relative flex min-h-[72px] w-full max-w-[520px] items-center gap-3 overflow-hidden rounded-[16px] border border-[#DDE2E8] bg-white py-3 pl-5 pr-4 shadow-[0_4px_12px_rgba(16,24,40,0.08)]"
      style={{
        borderLeft: `5px solid ${toast.type === "success" ? "#22C55E" : "#EF4444"}`,
      }}
    >
      <p className="min-w-0 flex-1 text-[16px] font-medium leading-[1.25] text-[#1F2937]">
        {toast.message}
      </p>
      {toast.type === "success" ? (
        <button
          type="button"
          className="shrink-0 text-[16px] font-medium leading-none text-[#2563EB]"
          onClick={onUndo}
        >
          undo
        </button>
      ) : null}
    </div>
  );
};

type StatusFilterPortalProps<T extends string> = {
  isOpen: boolean;
  position: { top: number; left: number };
  options: Array<{ value: T; label: string }>;
  selected: T;
  onClose: () => void;
  onSelect: (value: T) => void;
  itemPaddingClass?: string;
};

export const StatusFilterPortal = <T extends string>({
  isOpen,
  position,
  options,
  selected,
  onClose,
  onSelect,
  itemPaddingClass = "py-2",
}: StatusFilterPortalProps<T>) => {
  if (!isOpen) return null;

  return (
    <Portal>
      <button
        type="button"
        aria-label="Close status menu"
        className="fixed inset-0 z-[2147483640] bg-transparent"
        onClick={onClose}
      />
      <div
        className="fixed z-[2147483641] w-[220px] rounded-[16px] border border-[#D9DCE2] bg-white p-4 shadow-[0_10px_24px_rgba(16,24,40,0.12)]"
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
      >
        {options.map((option, index) => {
          const isActive = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              className={`flex w-full items-center gap-3 ${itemPaddingClass} text-left ${
                index !== options.length - 1 ? "border-b border-[#ECEFF3]" : ""
              }`}
              onClick={() => onSelect(option.value)}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  isActive ? "border-[#2563EB]" : "border-[#9CA3AF]"
                }`}
              >
                <span
                  className={`h-[10px] w-[10px] rounded-full ${
                    isActive ? "bg-[#2563EB]" : "bg-transparent"
                  }`}
                />
              </span>
              <span className="text-[14px] text-[#2B2B2B]">{option.label}</span>
            </button>
          );
        })}
      </div>
    </Portal>
  );
};

type PaginationProps = {
  pageSize: 5 | 10 | 20;
  showPageSizeMenu: boolean;
  pageSizeOptions: Array<5 | 10 | 20>;
  totalPages: number;
  currentPage: number;
  onToggleMenu: () => void;
  onSelectPageSize: (value: 5 | 10 | 20) => void;
  onGoToPage: (page: number) => void;
};

export const SettingsTablePagination = ({
  pageSize,
  showPageSizeMenu,
  pageSizeOptions,
  totalPages,
  currentPage,
  onToggleMenu,
  onSelectPageSize,
  onGoToPage,
}: PaginationProps) => (
  <div className="mt-4 flex items-center justify-between">
    <div className="inline-flex items-center gap-3 text-[14px] text-[#666]">
      <span>Show</span>
      <div className="relative">
        <button
          type="button"
          className="inline-flex h-10 min-w-[82px] items-center justify-center gap-2 rounded-[14px] border border-[#D1D5DB] bg-white px-3 text-[14px] text-[#2D2D2D]"
          onClick={onToggleMenu}
        >
          {pageSize}
          <ChevronDown
            className={`h-4 w-4 text-[#7A7A7A] transition-transform ${
              showPageSizeMenu ? "rotate-180" : ""
            }`}
          />
        </button>
        {showPageSizeMenu ? (
          <div className="absolute bottom-[46px] left-0 z-10 w-full rounded-[12px] border border-[#D9DCE2] bg-white py-1 shadow-[0_8px_24px_rgba(16,24,40,0.12)]">
            {pageSizeOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`block w-full px-3 py-1 text-center text-[14px] ${
                  option === pageSize ? "text-[#2563EB]" : "text-[#2D2D2D]"
                }`}
                onClick={() => onSelectPageSize(option)}
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>

    <div className="flex items-center gap-4">
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF3F9] text-[#C6CCD8]"
        onClick={() => onGoToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <button
            key={page}
            type="button"
            className={`px-1 font-['Poppins'] text-[24px] ${
              page === currentPage
                ? "border-b-4 border-[#2563EB] pb-2 text-[#2563EB]"
                : "text-[#B1B5BE]"
            }`}
            onClick={() => onGoToPage(page)}
          >
            {page}
          </button>
        ),
      )}
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF3F9] text-[#2563EB]"
        onClick={() => onGoToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  </div>
);

type DisableModalProps = {
  isOpen: boolean;
  title: string;
  line1: string;
  line2: string;
  onClose: () => void;
};

export const SettingsDisableBlockedModal = ({
  isOpen,
  title,
  line1,
  line2,
  onClose,
}: DisableModalProps) => {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[2147483644] bg-black/70" />
      <div className="fixed inset-0 z-[2147483645] flex items-center justify-center p-4">
        <div className="w-full max-w-[600px] rounded-[24px] bg-white px-8 py-10 text-center shadow-[0_24px_48px_rgba(0,0,0,0.25)]">
          <div className="mx-auto mb-5 flex h-[74px] w-[74px] items-center justify-center rounded-[22px] bg-[#FACC15]">
            <AlertTriangle className="h-10 w-10 fill-white text-white" />
          </div>
          <h2 className="font-['Poppins'] text-[40px] font-semibold text-[#2D2D2D] max-[1200px]:text-[28px]">
            {title}
          </h2>
          <p className="mt-4 font-['Poppins'] text-[18px] leading-[1.4] text-[#777]">
            {line1}
            <br />
            {line2}
          </p>
          <button
            type="button"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-[12px] border border-[#D1D5DB] px-6 text-[16px] font-medium text-[#374151]"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Portal>
  );
};
