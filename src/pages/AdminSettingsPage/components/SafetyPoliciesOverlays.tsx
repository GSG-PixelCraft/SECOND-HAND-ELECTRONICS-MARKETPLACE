import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Portal } from "@/components/ui/Portal/portal";
import { Switch } from "@/components/ui/Switch/switch";
import { AlertTriangle, X } from "lucide-react";
import type {
  Accordion,
  AppliesTo,
  DeleteState,
  Faq,
  FaqModalState,
  ListingReason,
  PhotoTipModalState,
  PrimaryIssue,
  PrimaryIssueModalState,
  RejectReasonModalState,
  Report,
  ReportModalState,
  SpecificIssueModalState,
  VerifyReason,
} from "../safetyPolicies.data";

type SafetyPoliciesOverlaysProps = {
  faqModal: FaqModalState | null;
  setFaqModal: Dispatch<SetStateAction<FaqModalState | null>>;
  setFaqs: Dispatch<SetStateAction<Faq[]>>;
  photoTipModal: PhotoTipModalState | null;
  setPhotoTipModal: Dispatch<SetStateAction<PhotoTipModalState | null>>;
  setPhoto: Dispatch<SetStateAction<Accordion[]>>;
  reportModal: ReportModalState | null;
  setReportModal: Dispatch<SetStateAction<ReportModalState | null>>;
  setReports: Dispatch<SetStateAction<Report[]>>;
  rejectReasonModal: RejectReasonModalState | null;
  setRejectReasonModal: Dispatch<SetStateAction<RejectReasonModalState | null>>;
  setVerify: Dispatch<SetStateAction<VerifyReason[]>>;
  primaryIssueModal: PrimaryIssueModalState | null;
  setPrimaryIssueModal: Dispatch<SetStateAction<PrimaryIssueModalState | null>>;
  setPrimaryIssues: Dispatch<SetStateAction<PrimaryIssue[]>>;
  specificIssueModal: SpecificIssueModalState | null;
  setSpecificIssueModal: Dispatch<
    SetStateAction<SpecificIssueModalState | null>
  >;
  setListing: Dispatch<SetStateAction<ListingReason[]>>;
  primaryIssues: PrimaryIssue[];
  deleteState: DeleteState | null;
  setDeleteState: Dispatch<SetStateAction<DeleteState | null>>;
  deleteItem: () => void;
};

const OverlayRoot = ({ children }: { children: ReactNode }) => (
  <Portal>
    <div className="fixed inset-0 z-[2147483644] bg-black/70" />
    <div className="fixed inset-0 z-[2147483645] flex items-center justify-center p-4">
      {children}
    </div>
  </Portal>
);

const ModalHeader = ({
  title,
  onClose,
  titleClassName = "text-[24px] font-semibold text-[#2D2D2D]",
}: {
  title: string;
  onClose: () => void;
  titleClassName?: string;
}) => (
  <div className="mb-4 flex items-center justify-between">
    <h3 className={titleClassName}>{title}</h3>
    <button type="button" onClick={onClose}>
      <X className="h-5 w-5 text-[#9CA3AF]" />
    </button>
  </div>
);

const Field = ({
  label,
  required = false,
  children,
  mb = "mb-3",
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  mb?: string;
}) => (
  <label className={`${mb} block text-[14px] text-[#4A4A4A]`}>
    {label} {required ? <span className="text-[#FF5C5C]">*</span> : null}
    {children}
  </label>
);

const ModalActions = ({
  submitLabel,
  onSubmit,
  onCancel,
  disabled,
  compact = false,
}: {
  submitLabel: string;
  onSubmit: () => void;
  onCancel: () => void;
  disabled?: boolean;
  compact?: boolean;
}) => {
  const h = compact ? "h-10 text-[14px]" : "h-11 text-[15px]";
  return (
    <div className="space-y-2">
      <button
        type="button"
        className={`${h} w-full rounded-[10px] bg-[#2563EB] font-medium text-white disabled:bg-[#D9D9D9]`}
        disabled={disabled}
        onClick={onSubmit}
      >
        {submitLabel}
      </button>
      <button
        type="button"
        className={`${h} w-full rounded-[10px] border border-[#AEB4BF] text-[#6B7280]`}
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
};

const YesNo = ({
  value,
  onChange,
  horizontal = false,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  horizontal?: boolean;
}) => (
  <div className={horizontal ? "mt-2 flex gap-4" : "mt-2 space-y-1"}>
    <label className="flex items-center gap-2">
      <input type="radio" checked={value} onChange={() => onChange(true)} />
      Yes
    </label>
    <label className="flex items-center gap-2">
      <input type="radio" checked={!value} onChange={() => onChange(false)} />
      No
    </label>
  </div>
);

const VisibilitySwitch = ({
  checked,
  onChange,
  mb = "mb-4",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  mb?: string;
}) => (
  <div className={`${mb} flex items-center justify-between`}>
    <span className="text-[14px] text-[#4A4A4A]">
      Visibility <span className="text-[#FF5C5C]">*</span>
    </span>
    <Switch checked={checked} onCheckedChange={onChange} className="h-6 w-11" />
  </div>
);

const modalCardClass =
  "max-h-[84vh] overflow-y-auto rounded-[20px] bg-white p-5";
const modalCardStyle = { width: "min(520px, calc(100vw - 32px))" };
const inputClass =
  "mt-1 h-11 w-full rounded-[10px] border border-[#D9DCE2] px-3 text-[14px] outline-none placeholder:text-[#C3C7CF]";

const SafetyPoliciesOverlays = ({
  faqModal,
  setFaqModal,
  setFaqs,
  photoTipModal,
  setPhotoTipModal,
  setPhoto,
  reportModal,
  setReportModal,
  setReports,
  rejectReasonModal,
  setRejectReasonModal,
  setVerify,
  primaryIssueModal,
  setPrimaryIssueModal,
  setPrimaryIssues,
  specificIssueModal,
  setSpecificIssueModal,
  setListing,
  primaryIssues,
  deleteState,
  setDeleteState,
  deleteItem,
}: SafetyPoliciesOverlaysProps) => {
  const saveFaq = () => {
    if (!faqModal?.q.trim() || !faqModal.a.trim()) return;
    if (faqModal.id)
      setFaqs((prev) =>
        prev.map((x) =>
          x.id === faqModal.id
            ? { ...x, q: faqModal.q.trim(), a: faqModal.a.trim() }
            : x,
        ),
      );
    else
      setFaqs((prev) => [
        ...prev,
        {
          id: `${Date.now()}`,
          q: faqModal.q.trim(),
          a: faqModal.a.trim(),
          visible: true,
        },
      ]);
    setFaqModal(null);
  };

  const savePhotoTip = () => {
    if (!photoTipModal?.title.trim() || !photoTipModal.body.trim()) return;
    if (photoTipModal.id)
      setPhoto((prev) =>
        prev.map((x) =>
          x.id === photoTipModal.id
            ? {
                ...x,
                title: photoTipModal.title.trim(),
                body: photoTipModal.body.trim(),
              }
            : x,
        ),
      );
    else
      setPhoto((prev) => [
        ...prev,
        {
          id: `${Date.now()}`,
          title: photoTipModal.title.trim(),
          body: photoTipModal.body.trim(),
          open: true,
          visible: true,
        },
      ]);
    setPhotoTipModal(null);
  };

  const saveReport = () => {
    if (!reportModal?.reason.trim() || !reportModal.applies.length) return;
    if (reportModal.id)
      setReports((prev) =>
        prev.map((x) =>
          x.id === reportModal.id
            ? {
                ...x,
                reason: reportModal.reason.trim(),
                applies: reportModal.applies,
                needDesc: reportModal.needDesc,
                visible: reportModal.visible,
              }
            : x,
        ),
      );
    else
      setReports((prev) => [
        ...prev,
        {
          id: `${Date.now()}`,
          reason: reportModal.reason.trim(),
          applies: reportModal.applies,
          needDesc: reportModal.needDesc,
          visible: reportModal.visible,
        },
      ]);
    setReportModal(null);
  };

  const saveReject = () => {
    if (!rejectReasonModal?.reason.trim()) return;
    if (rejectReasonModal.mode === "add")
      setVerify((prev) => [
        ...prev,
        {
          id: `${Date.now()}`,
          reason: rejectReasonModal.reason.trim(),
          needDesc: rejectReasonModal.needDesc,
          visible: rejectReasonModal.visible,
        },
      ]);
    else if (rejectReasonModal.id)
      setVerify((prev) =>
        prev.map((x) =>
          x.id === rejectReasonModal.id
            ? {
                ...x,
                reason: rejectReasonModal.reason.trim(),
                needDesc: rejectReasonModal.needDesc,
                visible: rejectReasonModal.visible,
              }
            : x,
        ),
      );
    setRejectReasonModal(null);
  };

  const savePrimary = () => {
    if (!primaryIssueModal?.issue.trim()) return;
    if (primaryIssueModal.mode === "add")
      setPrimaryIssues((prev) => [
        ...prev,
        {
          id: `${Date.now()}`,
          issue: primaryIssueModal.issue.trim(),
          visible: primaryIssueModal.visible,
        },
      ]);
    else if (primaryIssueModal.id)
      setPrimaryIssues((prev) =>
        prev.map((x) =>
          x.id === primaryIssueModal.id
            ? {
                ...x,
                issue: primaryIssueModal.issue.trim(),
                visible: primaryIssueModal.visible,
              }
            : x,
        ),
      );
    setPrimaryIssueModal(null);
  };

  const saveSpecific = () => {
    if (!specificIssueModal?.issue.trim() || !specificIssueModal.primary)
      return;
    if (specificIssueModal.mode === "add")
      setListing((prev) => [
        ...prev,
        {
          id: `${Date.now()}`,
          issue: specificIssueModal.issue.trim(),
          primary: specificIssueModal.primary,
          needDesc: specificIssueModal.needDesc,
          visible: specificIssueModal.visible,
        },
      ]);
    else if (specificIssueModal.id)
      setListing((prev) =>
        prev.map((x) =>
          x.id === specificIssueModal.id
            ? {
                ...x,
                issue: specificIssueModal.issue.trim(),
                primary: specificIssueModal.primary,
                needDesc: specificIssueModal.needDesc,
                visible: specificIssueModal.visible,
              }
            : x,
        ),
      );
    setSpecificIssueModal(null);
  };

  return (
    <>
      {faqModal ? (
        <OverlayRoot>
          <div className="w-full max-w-[520px] rounded-[20px] bg-white p-5">
            <ModalHeader
              title={faqModal.id ? "Edit FAQ" : "Add FAQ"}
              onClose={() => setFaqModal(null)}
            />
            <input
              value={faqModal.q}
              onChange={(e) =>
                setFaqModal((p) => (p ? { ...p, q: e.target.value } : p))
              }
              placeholder="Question"
              className="mb-3 h-11 w-full rounded-[10px] border border-[#D9DCE2] px-3 text-[14px] outline-none"
            />
            <textarea
              value={faqModal.a}
              onChange={(e) =>
                setFaqModal((p) => (p ? { ...p, a: e.target.value } : p))
              }
              placeholder="Answer"
              className="h-28 w-full rounded-[10px] border border-[#D9DCE2] p-3 text-[14px] outline-none"
            />
            <div className="mt-4">
              <ModalActions
                submitLabel={faqModal.id ? "Edit" : "Add"}
                onSubmit={saveFaq}
                onCancel={() => setFaqModal(null)}
              />
            </div>
          </div>
        </OverlayRoot>
      ) : null}

      {photoTipModal ? (
        <OverlayRoot>
          <div className="w-full max-w-[760px] rounded-[22px] bg-white p-6">
            <ModalHeader
              title={photoTipModal.id ? "Edit Photo Tip" : "Add Photo Tip"}
              onClose={() => setPhotoTipModal(null)}
            />
            <Field label="Tip title" required>
              <input
                value={photoTipModal.title}
                onChange={(e) =>
                  setPhotoTipModal((p) =>
                    p ? { ...p, title: e.target.value } : p,
                  )
                }
                placeholder="Enter tip title"
                className={inputClass}
              />
            </Field>
            <Field label="Description" required mb="mb-0">
              <textarea
                value={photoTipModal.body}
                onChange={(e) =>
                  setPhotoTipModal((p) =>
                    p ? { ...p, body: e.target.value } : p,
                  )
                }
                placeholder="Explain the tip in detail..."
                className="mt-1 h-56 w-full rounded-[10px] border border-[#D9DCE2] p-3 text-[14px] outline-none placeholder:text-[#C3C7CF]"
              />
            </Field>
            <div className="mt-4">
              <ModalActions
                submitLabel={photoTipModal.id ? "Save" : "Add"}
                disabled={
                  !photoTipModal.title.trim() || !photoTipModal.body.trim()
                }
                onSubmit={savePhotoTip}
                onCancel={() => setPhotoTipModal(null)}
              />
            </div>
          </div>
        </OverlayRoot>
      ) : null}

      {reportModal ? (
        <OverlayRoot>
          <div className={modalCardClass} style={modalCardStyle}>
            <ModalHeader
              title={
                reportModal.id ? "Edit report reason" : "Add new report reason"
              }
              onClose={() => setReportModal(null)}
              titleClassName="text-[20px] font-semibold text-[#2D2D2D]"
            />
            <Field label="Reason" required mb="mb-2.5">
              <input
                value={reportModal.reason}
                onChange={(e) =>
                  setReportModal((p) =>
                    p ? { ...p, reason: e.target.value } : p,
                  )
                }
                placeholder="Enter reason e.g. Scam or misleading information"
                className="mt-1 h-10 w-full rounded-[10px] border border-[#D9DCE2] px-3 text-[14px] outline-none placeholder:text-[#C3C7CF]"
              />
            </Field>
            <div className="mb-2.5 text-[14px] text-[#4A4A4A]">
              Applies to <span className="text-[#FF5C5C]">*</span>
              <div className="mt-2 space-y-1">
                {(["Listing", "User", "Chat"] as AppliesTo[]).map((target) => (
                  <label
                    key={target}
                    className="flex items-center gap-2 text-[14px] text-[#4A4A4A]"
                  >
                    <input
                      type="checkbox"
                      checked={reportModal.applies.includes(target)}
                      onChange={(e) =>
                        setReportModal((p) =>
                          p
                            ? {
                                ...p,
                                applies: e.target.checked
                                  ? [...p.applies, target]
                                  : p.applies.filter((x) => x !== target),
                              }
                            : p,
                        )
                      }
                    />
                    {target}
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-2.5 text-[14px] text-[#4A4A4A]">
              Requires description <span className="text-[#FF5C5C]">*</span>
              <YesNo
                value={reportModal.needDesc}
                onChange={(v) =>
                  setReportModal((p) => (p ? { ...p, needDesc: v } : p))
                }
                horizontal
              />
            </div>
            <VisibilitySwitch
              checked={reportModal.visible}
              onChange={(v) =>
                setReportModal((p) => (p ? { ...p, visible: v } : p))
              }
              mb="mb-5"
            />
            <ModalActions
              submitLabel={reportModal.id ? "Edit" : "Add"}
              compact
              disabled={
                !reportModal.reason.trim() || !reportModal.applies.length
              }
              onSubmit={saveReport}
              onCancel={() => setReportModal(null)}
            />
          </div>
        </OverlayRoot>
      ) : null}

      {rejectReasonModal ? (
        <OverlayRoot>
          <div className={modalCardClass} style={modalCardStyle}>
            <ModalHeader
              title={
                rejectReasonModal.mode === "add"
                  ? "Add new reject reason"
                  : "Edit reject reason"
              }
              onClose={() => setRejectReasonModal(null)}
            />
            <Field label="Reason" required>
              <input
                value={rejectReasonModal.reason}
                onChange={(e) =>
                  setRejectReasonModal((p) =>
                    p ? { ...p, reason: e.target.value } : p,
                  )
                }
                placeholder="Enter reason e.g. Scam or misleading information"
                className={inputClass}
              />
            </Field>
            <div className="mb-3 text-[14px] text-[#4A4A4A]">
              Requires description <span className="text-[#FF5C5C]">*</span>
              <YesNo
                value={rejectReasonModal.needDesc}
                onChange={(v) =>
                  setRejectReasonModal((p) => (p ? { ...p, needDesc: v } : p))
                }
              />
            </div>
            <VisibilitySwitch
              checked={rejectReasonModal.visible}
              onChange={(v) =>
                setRejectReasonModal((p) => (p ? { ...p, visible: v } : p))
              }
            />
            <ModalActions
              submitLabel={rejectReasonModal.mode === "add" ? "Add" : "Edit"}
              disabled={!rejectReasonModal.reason.trim()}
              onSubmit={saveReject}
              onCancel={() => setRejectReasonModal(null)}
            />
          </div>
        </OverlayRoot>
      ) : null}

      {primaryIssueModal ? (
        <OverlayRoot>
          <div className={modalCardClass} style={modalCardStyle}>
            <ModalHeader
              title={
                primaryIssueModal.mode === "add"
                  ? "Add new Primary Issue"
                  : "Edit Primary Issue"
              }
              onClose={() => setPrimaryIssueModal(null)}
            />
            <Field label="Issue" required mb="mb-4">
              <input
                value={primaryIssueModal.issue}
                onChange={(e) =>
                  setPrimaryIssueModal((p) =>
                    p ? { ...p, issue: e.target.value } : p,
                  )
                }
                placeholder="Enter issue e.g. Scam or misleading information"
                className={inputClass}
              />
            </Field>
            <VisibilitySwitch
              checked={primaryIssueModal.visible}
              onChange={(v) =>
                setPrimaryIssueModal((p) => (p ? { ...p, visible: v } : p))
              }
            />
            <ModalActions
              submitLabel={primaryIssueModal.mode === "add" ? "Add" : "Edit"}
              disabled={!primaryIssueModal.issue.trim()}
              onSubmit={savePrimary}
              onCancel={() => setPrimaryIssueModal(null)}
            />
          </div>
        </OverlayRoot>
      ) : null}

      {specificIssueModal ? (
        <OverlayRoot>
          <div className={modalCardClass} style={modalCardStyle}>
            <ModalHeader
              title={
                specificIssueModal.mode === "add"
                  ? "Add new Specific Issue"
                  : "Edit Specific Issue"
              }
              onClose={() => setSpecificIssueModal(null)}
            />
            <Field label="Issue" required>
              <input
                value={specificIssueModal.issue}
                onChange={(e) =>
                  setSpecificIssueModal((p) =>
                    p ? { ...p, issue: e.target.value } : p,
                  )
                }
                placeholder="Enter issue e.g. Scam or misleading information"
                className={inputClass}
              />
            </Field>
            <Field label="Primary Issue" required>
              <select
                value={specificIssueModal.primary}
                onChange={(e) =>
                  setSpecificIssueModal((p) =>
                    p ? { ...p, primary: e.target.value } : p,
                  )
                }
                className="mt-1 h-11 w-full rounded-[10px] border border-[#D9DCE2] bg-white px-3 text-[14px] text-[#4A4A4A] outline-none"
              >
                <option value="">Choose primary issue</option>
                {primaryIssues.map((item) => (
                  <option key={item.id} value={item.issue}>
                    {item.issue}
                  </option>
                ))}
              </select>
            </Field>
            <div className="mb-3 text-[14px] text-[#4A4A4A]">
              Requires description <span className="text-[#FF5C5C]">*</span>
              <YesNo
                value={specificIssueModal.needDesc}
                onChange={(v) =>
                  setSpecificIssueModal((p) => (p ? { ...p, needDesc: v } : p))
                }
              />
            </div>
            <VisibilitySwitch
              checked={specificIssueModal.visible}
              onChange={(v) =>
                setSpecificIssueModal((p) => (p ? { ...p, visible: v } : p))
              }
            />
            <ModalActions
              submitLabel={specificIssueModal.mode === "add" ? "Add" : "Edit"}
              disabled={
                !specificIssueModal.issue.trim() || !specificIssueModal.primary
              }
              onSubmit={saveSpecific}
              onCancel={() => setSpecificIssueModal(null)}
            />
          </div>
        </OverlayRoot>
      ) : null}

      {deleteState ? (
        <OverlayRoot>
          <div className="w-full max-w-[420px] rounded-[20px] bg-white p-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#FACC15]">
              <AlertTriangle className="h-8 w-8 fill-white text-white" />
            </div>
            <h3 className="text-[24px] font-semibold text-[#2D2D2D]">
              Are you sure you want to delete this item?
            </h3>
            <p className="mt-3 text-[14px] text-[#8A8A8A]">
              This action will remove it from all places where it is displayed.
            </p>
            <div className="mt-4 space-y-2">
              <button
                type="button"
                className="h-11 w-full rounded-[10px] bg-[#EF4444] text-[15px] font-semibold text-white"
                onClick={deleteItem}
              >
                Yes, Delete
              </button>
              <button
                type="button"
                className="h-11 w-full rounded-[10px] border border-[#AEB4BF] text-[15px] text-[#6B7280]"
                onClick={() => setDeleteState(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </OverlayRoot>
      ) : null}
    </>
  );
};

export default SafetyPoliciesOverlays;
