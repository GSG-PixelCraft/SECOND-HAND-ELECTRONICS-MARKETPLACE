import { forwardRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog/dialog";
import { Button } from "@/components/ui/Button/button";
import { Text } from "@/components/ui/Text/text";
import { Select } from "@/components/ui/Select/select";
import { Checkbox } from "@/components/ui/Checkbox/checkbox";
import type { RejectionReason } from "@/types/admin";

export interface RejectListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingName: string;
  onConfirm: (reason: RejectionReason, comment: string) => void;
  onReviewAndSubmit?: (data: {
    reason: RejectionReason;
    selectedIssues: Array<{ group: string; issue: string }>;
    comments: Array<{ group: string; comment: string }>;
  }) => void;
}

const rejectionReasons: { value: RejectionReason; label: string }[] = [
  { value: "poor_quality_images", label: "Photos & Visual Accuracy." },
  { value: "incomplete_information", label: "Listing Information Accuracy" },
  { value: "pricing_issue", label: "Product Specifications Consistency" },
  { value: "inappropriate_content", label: "Description & Disclosure Quality" },
  { value: "prohibited_item", label: "Prohibited Item" },
  { value: "other", label: "Other" },
];

const issueGroups = [
  {
    id: "photos",
    title: "Photos & Visual Accuracy.",
    issues: [
      "Photos do not clearly show the actual item.",
      "Damage mentioned in the description is not visible in the photos.",
      "Images are blurry or low quality.",
      "Stock images used instead of real photos.",
    ],
  },
  {
    id: "listing-info",
    title: "Listing Information Accuracy",
    issues: [
      "Category selected does not match the item.",
      "Brand or model information is incorrect.",
      "Missing required listing details.",
    ],
  },
  {
    id: "specs",
    title: "Product Specifications Consistency",
    issues: [
      "Specifications do not match the item shown.",
      "Key specs are missing or inconsistent.",
    ],
  },
  {
    id: "description",
    title: "Description & Disclosure Quality",
    issues: [
      "Description is unclear or misleading.",
      "Condition details are not disclosed.",
    ],
  },
];

export const RejectListingModal = forwardRef<
  HTMLDialogElement,
  RejectListingModalProps
>(({ open, onOpenChange, listingName, onConfirm, onReviewAndSubmit }, ref) => {
  const [selectedReason, setSelectedReason] = useState<RejectionReason | "">(
    "",
  );
  const [expandedGroup, setExpandedGroup] = useState<string>(issueGroups[0].id);
  const [selectedIssues, setSelectedIssues] = useState<
    Record<string, string[]>
  >({});
  const [comments, setComments] = useState<Record<string, string>>({});

  const totalSelectedIssues = Object.values(selectedIssues).reduce(
    (total, issues) => total + issues.length,
    0,
  );

  const isValid = selectedReason !== "" && totalSelectedIssues > 0;

  const handleIssueToggle = (groupId: string, issue: string) => {
    setSelectedIssues((prev) => {
      const current = prev[groupId] || [];
      const next = current.includes(issue)
        ? current.filter((item) => item !== issue)
        : [...current, issue];
      return { ...prev, [groupId]: next };
    });
  };

  const handleConfirm = () => {
    if (!isValid || !selectedReason) return;

    // If onReviewAndSubmit is provided, use the new two-step flow
    if (onReviewAndSubmit) {
      const issuesData = issueGroups
        .flatMap((group) =>
          (selectedIssues[group.id] || []).map((issue) => ({
            group: group.title,
            issue,
          })),
        )
        .filter(Boolean);

      const commentsData = Object.entries(comments)
        .map(([groupId, note]) => {
          const group = issueGroups.find((item) => item.id === groupId);
          if (!group || !note.trim()) return null;
          return { group: group.title, comment: note.trim() };
        })
        .filter((item): item is { group: string; comment: string } =>
          Boolean(item),
        );

      onReviewAndSubmit({
        reason: selectedReason,
        selectedIssues: issuesData,
        comments: commentsData,
      });
      return;
    }

    // Legacy direct confirmation flow
    const selectedDetails = issueGroups.flatMap((group) =>
      (selectedIssues[group.id] || []).map(
        (issue) => `${group.title} ${issue}`,
      ),
    );

    const commentLines = [
      "Issues:",
      ...selectedDetails.map((issue) => `- ${issue}`),
    ];

    const commentNotes = Object.entries(comments)
      .map(([groupId, note]) => {
        const group = issueGroups.find((item) => item.id === groupId);
        if (!group || !note.trim()) return null;
        return `Note (${group.title}): ${note.trim()}`;
      })
      .filter((note): note is string => Boolean(note));

    if (commentNotes.length > 0) {
      commentLines.push("", ...commentNotes);
    }

    onConfirm(selectedReason, commentLines.join("\n"));
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form
    setTimeout(() => {
      setSelectedReason("");
      setExpandedGroup(issueGroups[0].id);
      setSelectedIssues({});
      setComments({});
    }, 300);
  };

  return (
    <Dialog
      ref={ref}
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      className="!left-auto !right-0 !top-0 !h-full !max-h-screen !w-[420px] !max-w-none !translate-x-0 !translate-y-0 !rounded-none !border-l !border-neutral-20 !p-8"
    >
      <div className="flex h-full flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-foreground">
              Rejection Reason
            </h2>
            <Text variant="bodySmall" className="mt-1 text-neutral">
              Select the main reason for rejection and mark the issues found in
              the listing.
            </Text>
            <Text variant="bodySmall" className="mt-2 text-neutral">
              Listing: <span className="text-neutral-90">{listingName}</span>
            </Text>
          </div>
          <button
            onClick={handleClose}
            className="text-neutral hover:text-neutral-foreground"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto pr-1">
          {/* Primary Reason */}
          <div className="space-y-2">
            <Text variant="label" className="text-neutral-90">
              Choose Primary Issue <span className="text-error">*</span>
            </Text>
            <Select
              value={selectedReason}
              onChange={(event) =>
                setSelectedReason(event.target.value as RejectionReason)
              }
              className="h-12"
            >
              <option value="" disabled>
                Choose Primary Issue
              </option>
              {rejectionReasons.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Issue Groups */}
          <div className="space-y-3">
            <Text variant="label" className="text-neutral-90">
              Identify the specific issues found:
            </Text>
            <div className="space-y-3">
              {issueGroups.map((group) => {
                const isExpanded = expandedGroup === group.id;
                return (
                  <div
                    key={group.id}
                    className="rounded-xl border border-neutral-20 bg-white"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedGroup(isExpanded ? "" : group.id)
                      }
                      className="flex w-full items-center justify-between px-4 py-3 text-left"
                    >
                      <Text className="text-neutral-90 font-medium">
                        {group.title}
                      </Text>
                      <ChevronDown
                        className={`text-neutral-60 size-5 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="space-y-4 border-t border-neutral-10 px-4 py-4">
                        <div className="space-y-3">
                          {group.issues.map((issue) => (
                            <Checkbox
                              key={issue}
                              label={issue}
                              checked={
                                selectedIssues[group.id]?.includes(issue) ||
                                false
                              }
                              onChange={() =>
                                handleIssueToggle(group.id, issue)
                              }
                            />
                          ))}
                        </div>

                        <div className="space-y-2">
                          <textarea
                            value={comments[group.id] || ""}
                            onChange={(event) =>
                              setComments((prev) => ({
                                ...prev,
                                [group.id]: event.target.value.slice(0, 500),
                              }))
                            }
                            placeholder="My reason..."
                            rows={4}
                            className="w-full rounded-lg border border-neutral-20 px-3 py-2 text-sm text-neutral-foreground placeholder:text-neutral focus:outline-none focus:ring-2 focus:ring-primary-20"
                          />
                          <Text
                            variant="caption"
                            className="text-right text-neutral"
                          >
                            {(comments[group.id] || "").length}/500
                          </Text>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Button
            onClick={handleConfirm}
            disabled={!isValid}
            className="h-12 w-full border-none bg-primary text-white hover:bg-primary/90"
          >
            Review and Submit
          </Button>
          <Text variant="caption" className="text-center text-neutral">
            The seller can update the listing and resubmit.
          </Text>
        </div>
      </div>
    </Dialog>
  );
});

RejectListingModal.displayName = "RejectListingModal";
