import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FullScreenLoading } from "@/components/feedback/loading/full-screen-loading";
import { ListingDetailHeader } from "./ListingDetailHeader";
import { ListingDetailInfo } from "./ListingDetailInfo";
import {
  useAdminListingDetail,
  useApproveListingMutation,
  useRejectListingMutation,
  useHideListingMutation,
  useUnhideListingMutation,
} from "@/services/admin-listings.service";
import {
  ApproveListingModal,
  HideListingModal,
  UnhideListingModal,
  RejectListingModal,
  RejectListingSummaryModal,
} from "@/components/admin/modals";
import type { HideReason, RejectionReason } from "@/types/admin";

export default function AdminListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectSummaryModalOpen, setRejectSummaryModalOpen] = useState(false);
  const [rejectData, setRejectData] = useState<{
    reason: RejectionReason;
    selectedIssues: Array<{ group: string; issue: string }>;
    comments: Array<{ group: string; comment: string }>;
  } | null>(null);
  const [hideModalOpen, setHideModalOpen] = useState(false);
  const [unhideModalOpen, setUnhideModalOpen] = useState(false);

  // Fetch listing details
  const { data: listing, isLoading, error } = useAdminListingDetail(id!);

  // Mutations
  const approveMutation = useApproveListingMutation();
  const rejectMutation = useRejectListingMutation();
  const hideMutation = useHideListingMutation();
  const unhideMutation = useUnhideListingMutation();

  const handleApprove = async () => {
    if (!listing) return;

    try {
      await approveMutation.mutateAsync(listing.id);
      setApproveModalOpen(false);
      // Optionally navigate back or show success message
    } catch (error) {
      console.error("Failed to approve listing:", error);
    }
  };

  const handleReject = async (reason: RejectionReason, comment: string) => {
    if (!listing) return;

    try {
      await rejectMutation.mutateAsync({
        listingId: listing.id,
        reason,
        comment,
      });
      setRejectSummaryModalOpen(false);
      setRejectModalOpen(false);
      setRejectData(null);
      // Optionally navigate back or show success message
    } catch (error) {
      console.error("Failed to reject listing:", error);
    }
  };

  const handleReviewAndSubmit = (data: {
    reason: RejectionReason;
    selectedIssues: Array<{ group: string; issue: string }>;
    comments: Array<{ group: string; comment: string }>;
  }) => {
    setRejectData(data);
    setRejectModalOpen(false);
    setRejectSummaryModalOpen(true);
  };

  const handleBackToRejectModal = () => {
    setRejectSummaryModalOpen(false);
    setRejectModalOpen(true);
  };

  const handleConfirmRejection = async () => {
    if (!listing || !rejectData) return;

    const selectedDetails = rejectData.selectedIssues.map(
      (item) => `${item.group} ${item.issue}`,
    );

    const commentLines = [
      "Issues:",
      ...selectedDetails.map((issue) => `- ${issue}`),
    ];

    if (rejectData.comments.length > 0) {
      commentLines.push(
        "",
        ...rejectData.comments.map(
          (item) => `Note (${item.group}): ${item.comment}`,
        ),
      );
    }

    await handleReject(rejectData.reason, commentLines.join("\n"));
  };

  const handleHide = async (reason: HideReason, comment?: string) => {
    if (!listing) return;

    try {
      await hideMutation.mutateAsync({
        listingId: listing.id,
        reason,
        comment,
      });
      setHideModalOpen(false);
      // Optionally navigate back or show success message
    } catch (error) {
      console.error("Failed to hide listing:", error);
    }
  };

  const handleUnhide = async () => {
    if (!listing) return;

    try {
      await unhideMutation.mutateAsync(listing.id);
      setUnhideModalOpen(false);
      // Optionally navigate back or show success message
    } catch (error) {
      console.error("Failed to unhide listing:", error);
    }
  };

  // Loading State
  if (isLoading) {
    return <FullScreenLoading message="Loading listing details..." />;
  }

  // Error State
  if (error || !listing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-error"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-neutral-foreground">
            Listing Not Found
          </h2>
          <p className="mt-2 text-neutral">
            The listing you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/admin/listings")}
            className="mt-6 rounded-md bg-primary px-6 py-2 text-white hover:bg-primary/90"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  const isAnyMutationLoading =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    hideMutation.isPending ||
    unhideMutation.isPending;

  return (
    <div className="min-h-screen bg-neutral-5">
      {/* Content Container */}
      <div className="mx-auto max-w-[1500px] space-y-8 p-6">
        {/* Header */}
        <ListingDetailHeader
          listing={listing}
          onApprove={() => setApproveModalOpen(true)}
          onReject={() => setRejectModalOpen(true)}
          onHide={() => setHideModalOpen(true)}
          onUnhide={() => setUnhideModalOpen(true)}
          isLoading={isAnyMutationLoading}
        />

        {/* Content Card */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <ListingDetailInfo listing={listing} />
        </div>
      </div>

      {/* Modals */}
      <ApproveListingModal
        open={approveModalOpen}
        onOpenChange={setApproveModalOpen}
        listingName={listing.name}
        onConfirm={handleApprove}
        isLoading={approveMutation.isPending}
      />

      <RejectListingModal
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        listingName={listing.name}
        onConfirm={handleReject}
        onReviewAndSubmit={handleReviewAndSubmit}
        isLoading={rejectMutation.isPending}
      />

      {rejectData && (
        <RejectListingSummaryModal
          open={rejectSummaryModalOpen}
          onOpenChange={setRejectSummaryModalOpen}
          listingName={listing.name}
          primaryReason={rejectData.reason}
          selectedIssues={rejectData.selectedIssues}
          comments={rejectData.comments}
          onConfirm={handleConfirmRejection}
          onBack={handleBackToRejectModal}
          isLoading={rejectMutation.isPending}
        />
      )}

      <HideListingModal
        open={hideModalOpen}
        onOpenChange={setHideModalOpen}
        listingName={listing.name}
        onConfirm={handleHide}
        isLoading={hideMutation.isPending}
      />

      <UnhideListingModal
        open={unhideModalOpen}
        onOpenChange={setUnhideModalOpen}
        listingName={listing.name}
        onConfirm={handleUnhide}
        isLoading={unhideMutation.isPending}
      />
    </div>
  );
}
