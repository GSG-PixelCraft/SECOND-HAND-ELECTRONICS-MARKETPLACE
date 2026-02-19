import { useEffect, useMemo, useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  X,
} from "lucide-react";
import { initialCurrencies, type Currency } from "./currenciesSettings.data";
import {
  SettingsDisableBlockedModal,
  SettingsTablePagination,
  SettingsToastBanner,
  StatusFilterPortal,
} from "./components/SettingsManagementShared";

type StatusFilter = "all" | "enabled" | "disabled";
type PageSizeOption = 5 | 10 | 20;

type ToastState = {
  type: "success" | "error";
  message: string;
};

const CurrenciesSettingsPage = () => {
  const [currencies, setCurrencies] = useState<Currency[]>(initialCurrencies);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [statusMenuPosition, setStatusMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [showPageSizeMenu, setShowPageSizeMenu] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [pageSize, setPageSize] = useState<PageSizeOption>(10);
  const [currentPage, setCurrentPage] = useState(1);

  const statusButtonRef = useRef<HTMLButtonElement | null>(null);

  const filteredCurrencies = useMemo(() => {
    const query = search.trim().toLowerCase();
    return currencies.filter((currency) => {
      const matchesSearch =
        !query ||
        `${currency.name} ${currency.code}`.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "enabled"
            ? currency.enabled
            : !currency.enabled;
      return matchesSearch && matchesStatus;
    });
  }, [currencies, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCurrencies.length / pageSize),
  );

  const paginatedCurrencies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCurrencies.slice(start, start + pageSize);
  }, [filteredCurrencies, currentPage, pageSize]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const toggleStatusMenu = () => {
    if (showStatusMenu) {
      setShowStatusMenu(false);
      return;
    }
    const rect = statusButtonRef.current?.getBoundingClientRect();
    if (rect) {
      setStatusMenuPosition({ top: rect.bottom + 8, left: rect.right - 220 });
    }
    setShowStatusMenu(true);
  };

  const applyCurrencyStatus = (currencyId: string, enabled: boolean) => {
    setCurrencies((prev) =>
      prev.map((currency) =>
        currency.id === currencyId ? { ...currency, enabled } : currency,
      ),
    );
  };

  const syncCurrencyStatus = async () => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      throw new Error("offline");
    }
    await new Promise((resolve) => window.setTimeout(resolve, 250));
  };

  const handleStatusChange = async (
    currency: Currency,
    nextEnabled: boolean,
  ) => {
    if (!nextEnabled && currency.hasActiveCountriesOrListings) {
      setShowDisableModal(true);
      return;
    }

    try {
      await syncCurrencyStatus();
      applyCurrencyStatus(currency.id, nextEnabled);
      setToast({
        type: "success",
        message: `Currency ${nextEnabled ? "enabled" : "disabled"} successfully`,
      });
    } catch {
      setToast({
        type: "error",
        message: `Failed to ${nextEnabled ? "enable" : "disable"} currency`,
      });
    }
  };

  const statusFilterLabel =
    statusFilter === "all"
      ? "Status"
      : statusFilter === "enabled"
        ? "Enabled"
        : "Disabled";

  const statusOptions: Array<{ value: StatusFilter; label: string }> = [
    { value: "all", label: "All" },
    { value: "enabled", label: "Enabled" },
    { value: "disabled", label: "Disabled" },
  ];
  const pageSizeOptions: PageSizeOption[] = [5, 10, 20];

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-['Poppins'] text-[44px] font-semibold leading-[1.2] text-[#101010] max-[1200px]:text-[32px]">
          Currency Management
        </h1>

        <SettingsToastBanner toast={toast} onUndo={() => setToast(null)} />
      </div>

      <section className="rounded-[18px] border border-[#e8e8e8] bg-white p-6 shadow-[0px_1px_2px_rgba(16,24,40,0.04)]">
        <div className="flex items-center justify-between gap-3">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8a8a8a]" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by currency name or code"
              className="h-12 w-full rounded-[14px] border border-[#D9DCE2] bg-white py-0 pl-12 pr-12 font-['Poppins'] text-[16px] leading-[48px] text-[#2D2D2D] outline-none placeholder:text-[#b8bcc5]"
            />
            {search ? (
              <button
                type="button"
                aria-label="Clear search"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                onClick={() => setSearch("")}
              >
                <X className="h-5 w-5" />
              </button>
            ) : null}
          </div>

          <div className="relative shrink-0">
            <button
              ref={statusButtonRef}
              type="button"
              className={`inline-flex h-12 min-w-[110px] items-center justify-center gap-2 rounded-[14px] border px-4 font-['Poppins'] text-[16px] font-medium ${
                showStatusMenu
                  ? "border-[#2563EB] text-[#2D2D2D]"
                  : "border-[#D1D5DB] text-[#5E5E5E]"
              }`}
              onClick={toggleStatusMenu}
            >
              <span>{statusFilterLabel}</span>
              {showStatusMenu ? (
                <ChevronUp className="h-5 w-5 text-[#7A7A7A]" />
              ) : (
                <ChevronDown className="h-5 w-5 text-[#7A7A7A]" />
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead>
              <tr className="bg-[#EEF3FF] text-left">
                <th className="rounded-l-[14px] px-4 py-3">
                  <div className="inline-flex items-center gap-2">
                    <span className="font-['Poppins'] text-[14px] font-medium text-[#2D2D2D]">
                      Currency
                    </span>
                    <ChevronsUpDown className="h-4 w-4 text-[#7A7A7A]" />
                  </div>
                </th>
                <th className="px-4 py-3 font-['Poppins'] text-[14px] font-medium text-[#2D2D2D]">
                  Code
                </th>
                <th className="px-4 py-3 font-['Poppins'] text-[14px] font-medium text-[#2D2D2D]">
                  Countries
                </th>
                <th className="px-4 py-3 font-['Poppins'] text-[14px] font-medium text-[#2D2D2D]">
                  Listings
                </th>
                <th className="px-4 py-3 font-['Poppins'] text-[14px] font-medium text-[#2D2D2D]">
                  Exchange Rate
                </th>
                <th className="rounded-r-[14px] px-4 py-3 font-['Poppins'] text-[14px] font-medium text-[#2D2D2D]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedCurrencies.map((currency) => (
                <tr key={currency.id} className="border-b border-[#eceff3]">
                  <td className="px-4 py-4 font-['Poppins'] text-[14px] text-[#3D3D3D]">
                    {currency.name}
                  </td>
                  <td className="px-4 py-4 font-['Poppins'] text-[14px] text-[#52525B]">
                    {currency.code}
                  </td>
                  <td className="px-4 py-4 font-['Poppins'] text-[14px] text-[#52525B]">
                    {currency.countries}
                  </td>
                  <td className="px-4 py-4 font-['Poppins'] text-[14px] text-[#52525B]">
                    {currency.listings}
                  </td>
                  <td className="px-4 py-4 font-['Poppins'] text-[14px] text-[#52525B]">
                    {currency.exchangeRate}
                  </td>
                  <td className="px-4 py-4">
                    <Switch
                      checked={currency.enabled}
                      onCheckedChange={(enabled) => {
                        void handleStatusChange(currency, enabled);
                      }}
                      className="h-6 w-12"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!filteredCurrencies.length ? (
          <div className="flex min-h-[520px] flex-col items-center justify-center gap-5 px-4 text-center">
            <div className="relative">
              <div className="h-[84px] w-[120px] rounded-[12px] bg-[#14B8A6]" />
              <div className="absolute left-[14px] top-[14px] h-[56px] w-[92px] rounded-[10px] border-[8px] border-[#6EE7B7]" />
              <div className="absolute -right-[12px] top-[28px] flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#F0526A]">
                <X className="h-8 w-8 text-white" />
              </div>
              <div className="absolute left-[58px] top-[33px] h-4 w-4 rounded-full bg-[#FFD18D]" />
            </div>
            <p className="font-['Poppins'] text-[22px] font-medium text-[#2D2D2D]">
              There are no results that match your search
            </p>
            <p className="max-w-[760px] font-['Poppins'] text-[16px] text-[#8A8A8A]">
              Try searching for something else or clear the search to see all
              currencies.
            </p>
          </div>
        ) : (
          <SettingsTablePagination
            pageSize={pageSize}
            showPageSizeMenu={showPageSizeMenu}
            pageSizeOptions={pageSizeOptions}
            totalPages={totalPages}
            currentPage={currentPage}
            onToggleMenu={() => setShowPageSizeMenu((prev) => !prev)}
            onSelectPageSize={(value) => {
              setPageSize(value);
              setCurrentPage(1);
              setShowPageSizeMenu(false);
            }}
            onGoToPage={goToPage}
          />
        )}
      </section>
      <StatusFilterPortal
        isOpen={showStatusMenu}
        position={statusMenuPosition}
        options={statusOptions}
        selected={statusFilter}
        onClose={() => setShowStatusMenu(false)}
        onSelect={(value) => {
          setStatusFilter(value);
          setCurrentPage(1);
          setShowStatusMenu(false);
        }}
        itemPaddingClass="py-3"
      />
      <SettingsDisableBlockedModal
        isOpen={showDisableModal}
        title="This currency cannot be disabled"
        line1="This currency has active countries and listings."
        line2="Disabling it may affect live data and user experience."
        onClose={() => setShowDisableModal(false)}
      />
    </div>
  );
};

export default CurrenciesSettingsPage;
