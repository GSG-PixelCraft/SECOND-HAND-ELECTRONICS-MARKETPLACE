import { useMemo, useState } from "react";
import { Switch } from "@/components/ui/Switch/switch";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import SafetyPoliciesOverlays from "./components/SafetyPoliciesOverlays";
import {
  faqSeed,
  listingSeed,
  photoSeed,
  primaryIssueSeed,
  reportSeed,
  safetySeed,
  verifySeed,
  type Accordion,
  type ApplyFilter,
  type DeleteState,
  type Faq,
  type FaqModalState,
  type PhotoTipModalState,
  type PrimaryIssueModalState,
  type RejectReasonModalState,
  type RejectTab,
  type ReportModalState,
  type SpecificIssueModalState,
  type Tip,
  type Tab,
} from "./safetyPolicies.data";

const SafetyPoliciesSettingsPage = () => {
  const [tab, setTab] = useState<Tab>("safety");
  const [rejectTab, setRejectTab] = useState<RejectTab>("verification");
  const [safety, setSafety] = useState(safetySeed);
  const [photo, setPhoto] = useState(photoSeed);
  const [faqs, setFaqs] = useState(faqSeed);
  const [reports, setReports] = useState(reportSeed);
  const [verify, setVerify] = useState(verifySeed);
  const [primaryIssues, setPrimaryIssues] = useState(primaryIssueSeed);
  const [listing, setListing] = useState(listingSeed);
  const [search, setSearch] = useState("");
  const [isEditingSafety, setIsEditingSafety] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [isEditingFaq, setIsEditingFaq] = useState(false);
  const [faqSnapshot, setFaqSnapshot] = useState<Faq[]>(faqSeed);
  const [photoSnapshot, setPhotoSnapshot] = useState<Accordion[]>(photoSeed);
  const [safetyDraft, setSafetyDraft] = useState<Tip[]>(safetySeed);
  const [applyFilter, setApplyFilter] = useState<ApplyFilter>("All");
  const [deleteState, setDeleteState] = useState<DeleteState | null>(null);
  const [faqModal, setFaqModal] = useState<FaqModalState | null>(null);
  const [photoTipModal, setPhotoTipModal] = useState<PhotoTipModalState | null>(
    null,
  );
  const [reportModal, setReportModal] = useState<ReportModalState | null>(null);
  const [rejectReasonModal, setRejectReasonModal] =
    useState<RejectReasonModalState | null>(null);
  const [primaryIssueModal, setPrimaryIssueModal] =
    useState<PrimaryIssueModalState | null>(null);
  const [specificIssueModal, setSpecificIssueModal] =
    useState<SpecificIssueModalState | null>(null);

  const filteredReports = useMemo(
    () =>
      reports.filter(
        (r) =>
          r.reason.toLowerCase().includes(search.toLowerCase()) &&
          (applyFilter === "All" || r.applies.includes(applyFilter)),
      ),
    [reports, search, applyFilter],
  );
  const filteredVerify = useMemo(
    () =>
      verify.filter((r) =>
        r.reason.toLowerCase().includes(search.toLowerCase()),
      ),
    [verify, search],
  );
  const filteredPrimaryIssues = useMemo(
    () =>
      primaryIssues.filter((r) =>
        r.issue.toLowerCase().includes(search.toLowerCase()),
      ),
    [primaryIssues, search],
  );
  const filteredListing = useMemo(
    () =>
      listing.filter((r) =>
        `${r.issue} ${r.primary}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [listing, search],
  );

  const tabBtn = (k: Tab, label: string) => (
    <button
      type="button"
      className={`border-b-2 px-2 pb-2 text-[16px] ${tab === k ? "border-[#2563EB] text-[#2563EB]" : "border-transparent text-[#8A8A8A]"}`}
      onClick={() => setTab(k)}
    >
      {label}
    </button>
  );

  const deleteItem = () => {
    if (!deleteState) return;
    if (deleteState.kind === "safety")
      setSafety((p) => p.filter((x) => x.id !== deleteState.id));
    if (deleteState.kind === "photo")
      setPhoto((p) => p.filter((x) => x.id !== deleteState.id));
    if (deleteState.kind === "faq")
      setFaqs((p) => p.filter((x) => x.id !== deleteState.id));
    if (deleteState.kind === "report")
      setReports((p) => p.filter((x) => x.id !== deleteState.id));
    if (deleteState.kind === "rejection") {
      if (deleteState.entity === "verification") {
        setVerify((p) => p.filter((x) => x.id !== deleteState.id));
      } else if (deleteState.entity === "primary") {
        setPrimaryIssues((p) => p.filter((x) => x.id !== deleteState.id));
      } else {
        setListing((p) => p.filter((x) => x.id !== deleteState.id));
      }
    }
    setDeleteState(null);
  };

  const startSafetyEdit = () => {
    setSafetyDraft(safety);
    setIsEditingSafety(true);
  };

  const cancelSafetyEdit = () => {
    setSafetyDraft(safety);
    setIsEditingSafety(false);
  };

  const saveSafetyEdit = () => {
    const cleaned = safetyDraft
      .map((item) => ({ ...item, text: item.text.trim() }))
      .filter((item) => item.text);
    setSafety(cleaned.length ? cleaned : safety);
    setIsEditingSafety(false);
  };

  const photoDirty = useMemo(
    () => JSON.stringify(photo) !== JSON.stringify(photoSnapshot),
    [photo, photoSnapshot],
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="font-['Poppins'] text-[44px] font-semibold leading-[1.2] text-[#101010] max-[1200px]:text-[32px]">
        Safety & Policies
      </h1>
      <section className="rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div className="mb-5 flex items-center gap-4 border-b border-[#E5E7EB]">
          {tabBtn("safety", "Safety Tips")}
          {tabBtn("photo", "Photo Tips")}
          {tabBtn("faq", "FAQ")}
          {tabBtn("report", "Report Reasons")}
          {tabBtn("rejection", "Rejection Reasons")}
        </div>

        {tab === "safety" ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[18px] text-[#4A4A4A]">
                These tips are shown on product details pages and at the start
                of chat conversations
              </p>
              {isEditingSafety ? (
                <button
                  type="button"
                  className="text-[14px] font-medium text-[#2563EB]"
                  onClick={() =>
                    setSafetyDraft((prev) => [
                      ...prev,
                      { id: `${Date.now()}`, text: "" },
                    ])
                  }
                >
                  Add new Tip
                </button>
              ) : (
                <button
                  type="button"
                  className="rounded-[12px] bg-[#2563EB] px-4 py-2 text-[14px] font-medium text-white"
                  onClick={startSafetyEdit}
                >
                  Edit safety tips
                </button>
              )}
            </div>
            <div className="space-y-3">
              {(isEditingSafety ? safetyDraft : safety).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-[14px] border border-[#E5E7EB] px-4 py-3"
                >
                  {isEditingSafety ? (
                    <input
                      value={t.text}
                      onChange={(e) =>
                        setSafetyDraft((prev) =>
                          prev.map((item) =>
                            item.id === t.id
                              ? { ...item, text: e.target.value }
                              : item,
                          ),
                        )
                      }
                      placeholder="Enter new safety tip"
                      className="w-full bg-transparent text-[16px] text-[#4A4A4A] outline-none placeholder:text-[#B8BCC5]"
                    />
                  ) : (
                    <span className="text-[16px] text-[#4A4A4A]">{t.text}</span>
                  )}
                  {isEditingSafety ? (
                    <button
                      type="button"
                      className="text-[#FF5C5C]"
                      onClick={() =>
                        setSafetyDraft((prev) =>
                          prev.filter((item) => item.id !== t.id),
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            {isEditingSafety ? (
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="h-11 w-[240px] rounded-[10px] border border-[#2563EB] text-[15px] font-medium text-[#2563EB]"
                  onClick={cancelSafetyEdit}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="h-11 w-[240px] rounded-[10px] bg-[#2563EB] text-[15px] font-medium text-white"
                  onClick={saveSafetyEdit}
                >
                  Save Changes
                </button>
              </div>
            ) : null}
          </>
        ) : null}

        {tab === "photo" ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[18px] text-[#4A4A4A]">
                Photo guidelines shown when users add listings
              </p>
              {isEditingPhoto ? (
                <button
                  type="button"
                  className="text-[14px] font-medium text-[#2563EB]"
                  onClick={() => setPhotoTipModal({ title: "", body: "" })}
                >
                  Add new Tip
                </button>
              ) : (
                <button
                  type="button"
                  className="rounded-[12px] bg-[#2563EB] px-4 py-2 text-[14px] font-medium text-white"
                  onClick={() => {
                    setPhotoSnapshot(photo);
                    setIsEditingPhoto(true);
                  }}
                >
                  Edit photo tips
                </button>
              )}
            </div>
            <div className="space-y-3">
              {photo.map((t) => (
                <div
                  key={t.id}
                  className="rounded-[14px] border border-[#E5E7EB]"
                >
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="text-[#B9BEC8]">::</span>
                      <button
                        type="button"
                        className="truncate text-left text-[16px] text-[#4A4A4A]"
                        onClick={() =>
                          setPhoto((p) =>
                            p.map((x) =>
                              x.id === t.id ? { ...x, open: !x.open } : x,
                            ),
                          )
                        }
                      >
                        {t.title}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      {isEditingPhoto ? (
                        <>
                          <span className="text-[12px] text-[#8A8A8A]">
                            Visible
                          </span>
                          <Switch
                            checked={t.visible}
                            onCheckedChange={(checked) =>
                              setPhoto((prev) =>
                                prev.map((item) =>
                                  item.id === t.id
                                    ? { ...item, visible: checked }
                                    : item,
                                ),
                              )
                            }
                            className="h-5 w-10"
                          />
                          <button
                            type="button"
                            className="text-[#8A8A8A]"
                            onClick={() =>
                              setPhotoTipModal({
                                id: t.id,
                                title: t.title,
                                body: t.body,
                              })
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="text-[#FF5C5C]"
                            onClick={() =>
                              setDeleteState({ kind: "photo", id: t.id })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : null}
                      <button
                        type="button"
                        className="text-[#8A8A8A]"
                        onClick={() =>
                          setPhoto((p) =>
                            p.map((x) =>
                              x.id === t.id ? { ...x, open: !x.open } : x,
                            ),
                          )
                        }
                      >
                        {t.open ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  {t.open ? (
                    <div className="border-t border-[#ECEFF3] px-4 py-3 text-[14px] text-[#8A8A8A]">
                      {t.body}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            {isEditingPhoto ? (
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="h-11 w-[240px] rounded-[10px] border border-[#2563EB] text-[15px] font-medium text-[#2563EB]"
                  onClick={() => {
                    setPhoto(photoSnapshot);
                    setIsEditingPhoto(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="h-11 w-[240px] rounded-[10px] bg-[#2563EB] text-[15px] font-medium text-white disabled:bg-[#D9D9D9]"
                  disabled={!photoDirty}
                  onClick={() => {
                    setPhotoSnapshot(photo);
                    setIsEditingPhoto(false);
                  }}
                >
                  Save Changes
                </button>
              </div>
            ) : null}
          </>
        ) : null}

        {tab === "faq" ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[18px] text-[#4A4A4A]">
                Manage Help Center FAQ content
              </p>
              {isEditingFaq ? (
                <button
                  type="button"
                  className="text-[14px] font-medium text-[#2563EB]"
                  onClick={() => setFaqModal({ q: "", a: "" })}
                >
                  <Plus className="mr-1 inline h-4 w-4" />
                  Add FAQ
                </button>
              ) : (
                <button
                  type="button"
                  className="rounded-[12px] bg-[#2563EB] px-4 py-2 text-[14px] font-medium text-white"
                  onClick={() => {
                    setFaqSnapshot(faqs);
                    setIsEditingFaq(true);
                  }}
                >
                  Edit FAQ
                </button>
              )}
            </div>
            <div className="space-y-3">
              {faqs.map((f) => (
                <div
                  key={f.id}
                  className="rounded-[14px] border border-[#E5E7EB] px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[16px] text-[#4A4A4A]">{f.q}</p>
                    <div className="flex items-center gap-2">
                      {isEditingFaq ? (
                        <>
                          <span className="text-[12px] text-[#8A8A8A]">
                            Visible
                          </span>
                          <Switch
                            checked={f.visible}
                            onCheckedChange={(checked) =>
                              setFaqs((p) =>
                                p.map((x) =>
                                  x.id === f.id
                                    ? { ...x, visible: checked }
                                    : x,
                                ),
                              )
                            }
                            className="h-5 w-10"
                          />
                          <button
                            type="button"
                            className="text-[#8A8A8A]"
                            onClick={() =>
                              setFaqModal({ id: f.id, q: f.q, a: f.a })
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="text-[#FF5C5C]"
                            onClick={() =>
                              setDeleteState({ kind: "faq", id: f.id })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <p className="mt-2 text-[14px] text-[#8A8A8A]">{f.a}</p>
                </div>
              ))}
            </div>
            {isEditingFaq ? (
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="h-11 w-[240px] rounded-[10px] border border-[#2563EB] text-[15px] font-medium text-[#2563EB]"
                  onClick={() => {
                    setFaqs(faqSnapshot);
                    setIsEditingFaq(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="h-11 w-[240px] rounded-[10px] bg-[#2563EB] text-[15px] font-medium text-white"
                  onClick={() => {
                    setFaqSnapshot(faqs);
                    setIsEditingFaq(false);
                  }}
                >
                  Save Changes
                </button>
              </div>
            ) : null}
          </>
        ) : null}

        {tab === "report" ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[18px] text-[#4A4A4A]">
                Manage report reasons for listings, users, and conversations
              </p>
              <button
                type="button"
                className="rounded-[12px] bg-[#2563EB] px-4 py-2 text-[14px] font-medium text-white"
                onClick={() =>
                  setReportModal({
                    reason: "",
                    applies: [],
                    needDesc: false,
                    visible: true,
                  })
                }
              >
                Add new reason
              </button>
            </div>
            <div className="mb-3 flex items-center gap-3">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search reason name..."
                  className="h-11 w-full rounded-[10px] border border-[#D9DCE2] bg-white pl-9 pr-3 text-[14px] outline-none"
                />
              </div>
              <select
                value={applyFilter}
                onChange={(e) => setApplyFilter(e.target.value as ApplyFilter)}
                className="h-11 rounded-[10px] border border-[#D9DCE2] bg-white px-3 text-[14px] text-[#6B7280] outline-none"
              >
                <option value="All">Applies to</option>
                <option value="Listing">Listing</option>
                <option value="User">User</option>
                <option value="Chat">Chat</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="bg-[#EEF3FF] text-left">
                    <th className="rounded-l-[12px] px-3 py-3 text-[14px]">
                      Reason
                    </th>
                    <th className="px-3 py-3 text-[14px]">Applies to</th>
                    <th className="px-3 py-3 text-[14px]">
                      Requires Description
                    </th>
                    <th className="px-3 py-3 text-[14px]">Visibility</th>
                    <th className="rounded-r-[12px] px-3 py-3 text-[14px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((r) => (
                    <tr key={r.id} className="border-b border-[#ECEFF3]">
                      <td className="px-3 py-3 text-[14px]">{r.reason}</td>
                      <td className="px-3 py-3 text-[14px]">
                        {r.applies.join(", ")}
                      </td>
                      <td className="px-3 py-3 text-[14px]">
                        {r.needDesc ? "Yes" : "No"}
                      </td>
                      <td className="px-3 py-3">
                        <Switch
                          checked={r.visible}
                          onCheckedChange={(checked) =>
                            setReports((p) =>
                              p.map((x) =>
                                x.id === r.id ? { ...x, visible: checked } : x,
                              ),
                            )
                          }
                          className="h-5 w-10"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="text-[#8A8A8A]"
                            onClick={() =>
                              setReportModal({
                                id: r.id,
                                reason: r.reason,
                                applies: r.applies,
                                needDesc: r.needDesc,
                                visible: r.visible,
                              })
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="text-[#FF5C5C]"
                            onClick={() =>
                              setDeleteState({ kind: "report", id: r.id })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

        {tab === "rejection" ? (
          <>
            <div className="mb-3 flex items-center gap-3">
              <button
                type="button"
                className={`h-10 rounded-[10px] px-3 text-[14px] ${rejectTab === "verification" ? "bg-[#DCE8FF] text-[#2563EB]" : "border border-[#D9DCE2] text-[#8A8A8A]"}`}
                onClick={() => setRejectTab("verification")}
              >
                Verification Rejection
              </button>
              <button
                type="button"
                className={`h-10 rounded-[10px] px-3 text-[14px] ${rejectTab === "listing" ? "bg-[#DCE8FF] text-[#2563EB]" : "border border-[#D9DCE2] text-[#8A8A8A]"}`}
                onClick={() => setRejectTab("listing")}
              >
                Listing Rejection
              </button>
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search issue name..."
                  className="h-11 w-full rounded-[10px] border border-[#D9DCE2] bg-white pl-9 pr-3 text-[14px] outline-none"
                />
              </div>
              {rejectTab === "verification" ? (
                <button
                  type="button"
                  className="text-[14px] font-medium text-[#2563EB]"
                  onClick={() =>
                    setRejectReasonModal({
                      mode: "add",
                      reason: "",
                      needDesc: false,
                      visible: true,
                    })
                  }
                >
                  Add new Reson
                </button>
              ) : null}
            </div>
            <div className="overflow-x-auto">
              {rejectTab === "verification" ? (
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="bg-[#EEF3FF] text-left">
                      <th className="rounded-l-[12px] px-3 py-3 text-[14px]">
                        Reason
                      </th>
                      <th className="px-3 py-3 text-[14px]">
                        Requires Description
                      </th>
                      <th className="px-3 py-3 text-[14px]">Visibility</th>
                      <th className="rounded-r-[12px] px-3 py-3 text-[14px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVerify.map((r) => (
                      <tr key={r.id} className="border-b border-[#ECEFF3]">
                        <td className="px-3 py-3 text-[14px]">{r.reason}</td>
                        <td className="px-3 py-3 text-[14px]">
                          {r.needDesc ? "Yes" : "No"}
                        </td>
                        <td className="px-3 py-3">
                          <Switch
                            checked={r.visible}
                            onCheckedChange={(checked) =>
                              setVerify((p) =>
                                p.map((x) =>
                                  x.id === r.id
                                    ? { ...x, visible: checked }
                                    : x,
                                ),
                              )
                            }
                            className="h-5 w-10"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="text-[#8A8A8A]"
                              onClick={() =>
                                setRejectReasonModal({
                                  mode: "edit",
                                  id: r.id,
                                  reason: r.reason,
                                  needDesc: r.needDesc,
                                  visible: r.visible,
                                })
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="text-[#FF5C5C]"
                              onClick={() =>
                                setDeleteState({
                                  kind: "rejection",
                                  id: r.id,
                                  entity: "verification",
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="space-y-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[24px] font-semibold text-[#2D2D2D]">
                        Primary Issues
                      </p>
                      <button
                        type="button"
                        className="text-[14px] font-medium text-[#2563EB]"
                        onClick={() =>
                          setPrimaryIssueModal({
                            mode: "add",
                            issue: "",
                            visible: true,
                          })
                        }
                      >
                        Add Primary Issue
                      </button>
                    </div>
                    <table className="w-full min-w-[760px]">
                      <thead>
                        <tr className="bg-[#EEF3FF] text-left">
                          <th className="rounded-l-[12px] px-3 py-3 text-[14px]">
                            Issue
                          </th>
                          <th className="px-3 py-3 text-[14px]">Visibility</th>
                          <th className="rounded-r-[12px] px-3 py-3 text-[14px]">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPrimaryIssues.map((p) => (
                          <tr key={p.id} className="border-b border-[#ECEFF3]">
                            <td className="px-3 py-3 text-[14px]">{p.issue}</td>
                            <td className="px-3 py-3">
                              <Switch
                                checked={p.visible}
                                onCheckedChange={(checked) =>
                                  setPrimaryIssues((prev) =>
                                    prev.map((x) =>
                                      x.id === p.id
                                        ? { ...x, visible: checked }
                                        : x,
                                    ),
                                  )
                                }
                                className="h-5 w-10"
                              />
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  className="text-[#8A8A8A]"
                                  onClick={() =>
                                    setPrimaryIssueModal({
                                      mode: "edit",
                                      id: p.id,
                                      issue: p.issue,
                                      visible: p.visible,
                                    })
                                  }
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  className="text-[#FF5C5C]"
                                  onClick={() =>
                                    setDeleteState({
                                      kind: "rejection",
                                      id: p.id,
                                      entity: "primary",
                                    })
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[24px] font-semibold text-[#2D2D2D]">
                        Specific Issues
                      </p>
                      <button
                        type="button"
                        className="text-[14px] font-medium text-[#2563EB]"
                        onClick={() =>
                          setSpecificIssueModal({
                            mode: "add",
                            issue: "",
                            primary: "",
                            needDesc: false,
                            visible: true,
                          })
                        }
                      >
                        Add Issue
                      </button>
                    </div>
                    <table className="w-full min-w-[860px]">
                      <thead>
                        <tr className="bg-[#EEF3FF] text-left">
                          <th className="rounded-l-[12px] px-3 py-3 text-[14px]">
                            Issue
                          </th>
                          <th className="px-3 py-3 text-[14px]">
                            Primary Issue
                          </th>
                          <th className="px-3 py-3 text-[14px]">
                            Requires Description
                          </th>
                          <th className="px-3 py-3 text-[14px]">Visibility</th>
                          <th className="rounded-r-[12px] px-3 py-3 text-[14px]">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredListing.map((r) => (
                          <tr key={r.id} className="border-b border-[#ECEFF3]">
                            <td className="px-3 py-3 text-[14px]">{r.issue}</td>
                            <td className="px-3 py-3 text-[13px] text-[#6B7280]">
                              {r.primary}
                            </td>
                            <td className="px-3 py-3 text-[14px]">
                              {r.needDesc ? "Yes" : "No"}
                            </td>
                            <td className="px-3 py-3">
                              <Switch
                                checked={r.visible}
                                onCheckedChange={(checked) =>
                                  setListing((p) =>
                                    p.map((x) =>
                                      x.id === r.id
                                        ? { ...x, visible: checked }
                                        : x,
                                    ),
                                  )
                                }
                                className="h-5 w-10"
                              />
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  className="text-[#8A8A8A]"
                                  onClick={() =>
                                    setSpecificIssueModal({
                                      mode: "edit",
                                      id: r.id,
                                      issue: r.issue,
                                      primary: r.primary,
                                      needDesc: r.needDesc,
                                      visible: r.visible,
                                    })
                                  }
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  className="text-[#FF5C5C]"
                                  onClick={() =>
                                    setDeleteState({
                                      kind: "rejection",
                                      id: r.id,
                                      entity: "specific",
                                    })
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}
      </section>

      <SafetyPoliciesOverlays
        faqModal={faqModal}
        setFaqModal={setFaqModal}
        setFaqs={setFaqs}
        photoTipModal={photoTipModal}
        setPhotoTipModal={setPhotoTipModal}
        setPhoto={setPhoto}
        reportModal={reportModal}
        setReportModal={setReportModal}
        setReports={setReports}
        rejectReasonModal={rejectReasonModal}
        setRejectReasonModal={setRejectReasonModal}
        setVerify={setVerify}
        primaryIssueModal={primaryIssueModal}
        setPrimaryIssueModal={setPrimaryIssueModal}
        setPrimaryIssues={setPrimaryIssues}
        specificIssueModal={specificIssueModal}
        setSpecificIssueModal={setSpecificIssueModal}
        setListing={setListing}
        primaryIssues={primaryIssues}
        deleteState={deleteState}
        setDeleteState={setDeleteState}
        deleteItem={deleteItem}
      />
    </div>
  );
};

export default SafetyPoliciesSettingsPage;
