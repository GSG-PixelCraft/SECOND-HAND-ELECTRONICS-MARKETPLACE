import { useEffect, useMemo, useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { ChevronUp, Search } from "lucide-react";
import { initialCountries, type Country } from "./countriesSettings.data";
import {
  SettingsDisableBlockedModal,
  SettingsTablePagination,
  SettingsToastBanner,
  StatusFilterPortal,
} from "./components/SettingsManagementShared";

type ToastState = {
  type: "success" | "error";
  message: string;
};
type PageSizeOption = 5 | 10 | 20;

const CountriesSettingsPage = () => {
  const [countries, setCountries] = useState<Country[]>(initialCountries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "enabled" | "disabled"
  >("all");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [statusMenuPosition, setStatusMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [showPageSizeMenu, setShowPageSizeMenu] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [pageSize, setPageSize] = useState<PageSizeOption>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const statusButtonRef = useRef<HTMLButtonElement | null>(null);

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase();
    return countries.filter((country) => {
      const matchesSearch =
        !query ||
        `${country.name} ${country.currency}`.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "enabled"
            ? country.enabled
            : !country.enabled;
      return matchesSearch && matchesStatus;
    });
  }, [countries, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCountries.length / pageSize),
  );

  const paginatedCountries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCountries.slice(start, start + pageSize);
  }, [filteredCountries, currentPage, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const applyCountryStatus = (countryId: string, enabled: boolean) => {
    setCountries((prev) =>
      prev.map((item) => (item.id === countryId ? { ...item, enabled } : item)),
    );
  };

  const syncCountryStatus = async () => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      throw new Error("offline");
    }
    await new Promise((resolve) => window.setTimeout(resolve, 250));
  };

  const handleStatusChange = async (country: Country, enabled: boolean) => {
    if (!enabled && country.hasActiveUsersOrListings) {
      setShowDisableModal(true);
      return;
    }

    try {
      await syncCountryStatus();
      applyCountryStatus(country.id, enabled);
      setToast({
        type: "success",
        message: `Country ${enabled ? "enabled" : "disabled"} successfully`,
      });
    } catch {
      setToast({
        type: "error",
        message: `Failed to ${enabled ? "enable" : "disable"} country`,
      });
    }
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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

  const statusFilterLabel =
    statusFilter === "all"
      ? "Status"
      : statusFilter === "enabled"
        ? "Enabled"
        : "Disabled";
  const pageSizeOptions: PageSizeOption[] = [5, 10, 20];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-['Poppins'] text-[44px] font-semibold leading-[1.2] text-[#101010] max-[1200px]:text-[32px]">
          Country Management
        </h1>
        <SettingsToastBanner toast={toast} onUndo={() => setToast(null)} />
      </div>

      <section className="rounded-[18px] border border-[#e8e8e8] bg-white p-6 shadow-[0px_1px_2px_rgba(16,24,40,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eceff3] pb-3">
          <div className="inline-flex items-center gap-2 border-b-2 border-[#3B82F6] pb-2">
            <h2 className="font-['Poppins'] text-[28px] font-medium text-[#2563EB]">
              Countries
            </h2>
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#DDE7FF] px-1 text-[14px] font-medium text-[#2563EB]">
              {filteredCountries.length}
            </span>
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:flex-nowrap">
            <div className="relative min-w-0 flex-1 lg:w-[800px] lg:flex-none">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9ca3af]" />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by country name"
                className="h-12 w-full rounded-[12px] border border-[#D9DCE2] bg-white px-3 py-0 pl-12 text-[16px] leading-[48px] text-[#3D3D3D] outline-none placeholder:text-[#b8bcc5]"
              />
            </div>

            <div className="relative shrink-0">
              <button
                ref={statusButtonRef}
                type="button"
                className="inline-flex h-12 min-w-[110px] items-center justify-center gap-2 rounded-[12px] border border-[#2563EB] px-4 text-[16px] font-medium"
                style={{
                  backgroundColor: "#F3F4F6",
                  borderColor: "#D1D5DB",
                  color: "#6B7280",
                }}
                onClick={toggleStatusMenu}
              >
                <span style={{ color: "#6B7280" }}>{statusFilterLabel}</span>
                <ChevronUp
                  className={`h-4 w-4 transition-transform ${
                    showStatusMenu ? "" : "rotate-180"
                  }`}
                  style={{ color: "#6B7280" }}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead>
              <tr className="bg-[#EEF3FF] text-left">
                <th className="rounded-l-[10px] px-4 py-3 text-[14px] font-medium text-[#3f3f46]">
                  Country
                </th>
                <th className="px-4 py-3 text-[14px] font-medium text-[#3f3f46]">
                  Currency
                </th>
                <th className="px-4 py-3 text-[14px] font-medium text-[#3f3f46]">
                  Users
                </th>
                <th className="px-4 py-3 text-[14px] font-medium text-[#3f3f46]">
                  Listings
                </th>
                <th className="rounded-r-[10px] px-4 py-3 text-[14px] font-medium text-[#3f3f46]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedCountries.map((country) => (
                <tr key={country.id} className="border-b border-[#eceff3]">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://flagcdn.com/w40/${country.iso2}.png`}
                        alt={`${country.name} flag`}
                        className="h-6 w-8 rounded object-cover"
                        loading="lazy"
                      />
                      <span className="text-[14px] font-medium text-[#3D3D3D]">
                        {country.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[14px] text-[#52525b]">
                    {country.currency}
                  </td>
                  <td className="px-4 py-4 text-[14px] text-[#52525b]">
                    {country.users.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-[14px] text-[#52525b]">
                    {country.listings.toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <Switch
                      checked={country.enabled}
                      onCheckedChange={(enabled) => {
                        void handleStatusChange(country, enabled);
                      }}
                      className="h-6 w-12"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
      </section>
      <StatusFilterPortal
        isOpen={showStatusMenu}
        position={statusMenuPosition}
        options={[
          { value: "all", label: "All" },
          { value: "enabled", label: "Enabled" },
          { value: "disabled", label: "Disabled" },
        ]}
        selected={statusFilter}
        onClose={() => setShowStatusMenu(false)}
        onSelect={(value) => {
          setStatusFilter(value);
          setCurrentPage(1);
          setShowStatusMenu(false);
        }}
      />
      <SettingsDisableBlockedModal
        isOpen={showDisableModal}
        title="This country cannot be disabled"
        line1="This country has active users and listings."
        line2="Disabling it may affect live data and user experience."
        onClose={() => setShowDisableModal(false)}
      />
    </div>
  );
};

export default CountriesSettingsPage;
