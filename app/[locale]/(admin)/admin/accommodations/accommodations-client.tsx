"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { StatusLabel } from "@/components/ui/status-label";
import {
  Home,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Filter,
} from "lucide-react";
import { adminModerateAccommodationAction } from "@/app/actions/admin";

export interface AccommodationListingItem {
  id: string;
  title: string;
  accommodation_type: string;
  room_type: string;
  bathroom_type: string;
  max_guests: number;
  room_count: number;
  food_provided: boolean;
  general_location: string;
  household_adults_count: number;
  has_children: boolean;
  has_pets: boolean;
  other_residents_description?: string | null;
  house_rules?: string | null;
  price_per_night_paise: number;
  status: string;
  verification_tier: string;
  created_at: string;
  host_id: string;
  users?:
    | {
        email: string;
      }
    | Array<{
        email: string;
      }>
    | null;
}

interface Props {
  listings: AccommodationListingItem[];
  isHindi: boolean;
}

export function AdminAccommodationsClient({ listings, isHindi }: Props) {
  const router = useRouter();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [inspectListing, setInspectListing] = useState<AccommodationListingItem | null>(null);
  const [decisionModal, setDecisionModal] = useState<{
    listing: AccommodationListingItem;
    decision: "approve" | "reject" | "request_changes" | "suspend";
  } | null>(null);

  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredListings = listings.filter((item) => {
    if (statusFilter === "all") return true;
    return item.status === statusFilter;
  });

  const handleDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionModal) return;

    if (reason.trim().length < 5) {
      setErrorMessage(
        isHindi
          ? "कम से कम 5 अक्षरों का कारण अनिवार्य है।"
          : "A justification of at least 5 characters is mandatory."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await adminModerateAccommodationAction({
        listingId: decisionModal.listing.id,
        decision: decisionModal.decision,
        reason: reason.trim(),
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to update accommodation status.");
        setIsSubmitting(false);
        return;
      }

      setDecisionModal(null);
      setInspectListing(null);
      setReason("");
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error moderating accommodation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusVariant = (
    status: string
  ): "default" | "success" | "warning" | "error" | "info" => {
    switch (status) {
      case "approved":
        return "success";
      case "pending_review":
        return "warning";
      case "rejected":
      case "suspended":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-paper p-3 border border-rule rounded-sm text-xs">
        <div className="flex items-center gap-2">
          <Filter size={14} strokeWidth={1.5} className="text-secondary" />
          <span className="font-medium text-text">
            {isHindi ? "स्थिति फ़िल्टर:" : "Filter Status:"}
          </span>
          <div className="flex gap-1">
            {["all", "pending_review", "approved", "rejected", "suspended"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-sm text-[11px] font-mono transition-colors ${
                  statusFilter === st
                    ? "bg-text text-paper"
                    : "bg-warm hover:bg-warm/80 text-secondary"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-secondary font-mono">
          {filteredListings.length} {isHindi ? "आवास सूचीबद्ध" : "listings found"}
        </div>
      </div>

      {/* Listings Table */}
      <div className="border border-rule rounded-sm bg-paper overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-warm/40 border-b border-rule font-medium text-secondary">
            <tr>
              <th className="py-2.5 px-4">{isHindi ? "आवास शीर्षक व मेजबान" : "Listing & Host"}</th>
              <th className="py-2.5 px-3">{isHindi ? "प्रकार एवं शुल्क" : "Type & Pricing"}</th>
              <th className="py-2.5 px-3">{isHindi ? "सार्वजनिक क्षेत्र" : "General Area"}</th>
              <th className="py-2.5 px-3">{isHindi ? "स्थिति" : "Status"}</th>
              <th className="py-2.5 px-3">{isHindi ? "पंजीकृत" : "Submitted"}</th>
              <th className="py-2.5 px-4 text-right">{isHindi ? "समीक्षा" : "Review"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule font-sans">
            {filteredListings.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-secondary">
                  {isHindi
                    ? "इस श्रेणी में कोई आवास सूची नहीं मिली।"
                    : "No accommodation listings match the selected filter."}
                </td>
              </tr>
            ) : (
              filteredListings.map((item) => {
                const priceFormatted =
                  item.price_per_night_paise === 0
                    ? isHindi
                      ? "निशुल्क आतिथ्य"
                      : "Free Hospitality"
                    : `₹${(item.price_per_night_paise / 100).toLocaleString("en-IN")}/night`;

                const hostEmail = Array.isArray(item.users)
                  ? item.users[0]?.email
                  : item.users?.email;

                return (
                  <tr key={item.id} className="hover:bg-warm/10">
                    <td className="py-3 px-4">
                      <div className="font-medium text-text">{item.title}</div>
                      <div className="text-[11px] text-secondary font-mono">
                        {hostEmail || item.host_id.slice(0, 8)}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-text capitalize">
                        {item.accommodation_type.replace(/_/g, " ")}
                      </div>
                      <div className="text-[11px] text-forest font-mono">{priceFormatted}</div>
                    </td>
                    <td className="py-3 px-3 text-secondary text-[11px]">
                      {item.general_location}
                    </td>
                    <td className="py-3 px-3">
                      <StatusLabel
                        status={item.status.replace(/_/g, " ")}
                        variant={getStatusVariant(item.status)}
                      />
                    </td>
                    <td className="py-3 px-3 text-secondary text-[11px] font-mono">
                      {new Date(item.created_at).toLocaleDateString(
                        isHindi ? "hi-IN" : "en-IN"
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setInspectListing(item)}
                        className="inline-flex items-center gap-1 text-forest hover:underline text-[11px] font-medium"
                      >
                        <Eye size={12} strokeWidth={1.5} />
                        <span>{isHindi ? "विवरण देखें" : "Inspect"}</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Inspection Drawer / Modal */}
      {inspectListing && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-text/50 p-4"
        >
          <div className="bg-paper border border-rule max-w-2xl w-full p-6 rounded-sm shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-rule pb-3">
              <div>
                <span className="text-[11px] font-mono uppercase text-forest tracking-wider">
                  {inspectListing.accommodation_type.replace(/_/g, " ")}
                </span>
                <h3 className="font-heading text-xl text-text mt-0.5">
                  {inspectListing.title}
                </h3>
              </div>
              <StatusLabel
                status={inspectListing.status.replace(/_/g, " ")}
                variant={getStatusVariant(inspectListing.status)}
              />
            </div>

            {/* Safety & Compliance Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-warm/30 border border-rule rounded-sm space-y-1.5">
                <div className="flex items-center gap-1.5 font-medium text-text">
                  <Users size={14} strokeWidth={1.5} className="text-secondary" />
                  <span>{isHindi ? "पारिवारिक संरचना" : "Household Composition"}</span>
                </div>
                <div className="text-secondary leading-relaxed">
                  Adults residing: <strong className="text-text">{inspectListing.household_adults_count}</strong>
                  <br />
                  Children present: <strong className="text-text">{inspectListing.has_children ? "Yes" : "No"}</strong>
                  <br />
                  Pets present: <strong className="text-text">{inspectListing.has_pets ? "Yes" : "No"}</strong>
                  {inspectListing.other_residents_description && (
                    <p className="mt-1 text-[11px] italic text-text">
                      &quot;{inspectListing.other_residents_description}&quot;
                    </p>
                  )}
                </div>
              </div>

              <div className="p-3 bg-warm/30 border border-rule rounded-sm space-y-1.5">
                <div className="flex items-center gap-1.5 font-medium text-text">
                  <Home size={14} strokeWidth={1.5} className="text-secondary" />
                  <span>{isHindi ? "आवास व्यवस्था" : "Quarters & Capacity"}</span>
                </div>
                <div className="text-secondary leading-relaxed">
                  Max capacity: <strong className="text-text">{inspectListing.max_guests} guests (Limit: 2)</strong>
                  <br />
                  Rooms: <strong className="text-text">{inspectListing.room_count}</strong> ({inspectListing.room_type.replace(/_/g, " ")})
                  <br />
                  Bathroom: <strong className="text-text capitalize">{inspectListing.bathroom_type}</strong>
                  <br />
                  Meals included: <strong className="text-text">{inspectListing.food_provided ? "Yes" : "No"}</strong>
                </div>
              </div>
            </div>

            {/* Location Privacy Check */}
            <div className="p-3 border border-rule rounded-sm text-xs space-y-1">
              <span className="font-medium text-text block">
                {isHindi ? "सार्वजनिक बैठक या लैंडमार्क क्षेत्र:" : "Public Meeting Area / Landmark:"}
              </span>
              <p className="text-secondary font-mono">{inspectListing.general_location}</p>
              <p className="text-[11px] text-forest">
                Section 21 Invariant: Only public landmarks and approximate locality centroids are displayed to travellers prior to confirmed booking.
              </p>
            </div>

            {/* House Rules */}
            {inspectListing.house_rules && (
              <div className="p-3 border border-rule rounded-sm text-xs space-y-1">
                <span className="font-medium text-text block">
                  {isHindi ? "गृह नियम:" : "House Rules:"}
                </span>
                <p className="text-secondary whitespace-pre-line leading-relaxed">
                  {inspectListing.house_rules}
                </p>
              </div>
            )}

            {/* Moderation Action Buttons */}
            <div className="pt-4 border-t border-rule flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="secondary"
                size="small"
                onClick={() => setInspectListing(null)}
              >
                {isHindi ? "बंद करें" : "Close Inspection"}
              </Button>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    setDecisionModal({ listing: inspectListing, decision: "request_changes" })
                  }
                  className="px-3 py-1.5 border border-rule rounded-sm text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 flex items-center gap-1"
                >
                  <AlertCircle size={13} strokeWidth={1.5} />
                  <span>Request Changes</span>
                </button>
                <button
                  onClick={() =>
                    setDecisionModal({ listing: inspectListing, decision: "reject" })
                  }
                  className="px-3 py-1.5 border border-rule rounded-sm text-xs font-medium text-terracotta bg-red-50 hover:bg-red-100 flex items-center gap-1"
                >
                  <XCircle size={13} strokeWidth={1.5} />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() =>
                    setDecisionModal({ listing: inspectListing, decision: "approve" })
                  }
                  className="px-3 py-1.5 border border-forest/40 rounded-sm text-xs font-medium text-paper bg-forest hover:bg-forest/90 flex items-center gap-1"
                >
                  <CheckCircle size={13} strokeWidth={1.5} />
                  <span>Approve Listing</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decision Justification Modal */}
      {decisionModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-text/60 p-4"
        >
          <div className="bg-paper border border-rule max-w-md w-full p-6 rounded-sm shadow-2xl space-y-4">
            <h3 className="font-heading text-lg text-text capitalize">
              Confirm Decision: {decisionModal.decision.replace(/_/g, " ")}
            </h3>

            <p className="text-xs text-secondary leading-relaxed">
              Target listing: <strong className="text-text">{decisionModal.listing.title}</strong>
            </p>

            <form onSubmit={handleDecisionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text mb-1">
                  {isHindi
                    ? "प्रशासनिक कारण (ऑडिट एवं मेजबान को स्पष्टीकरण हेतु):"
                    : "Administrative Justification (Mandatory audit trail):"}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={
                    isHindi
                      ? "कम से कम 5 अक्षरों में निर्णय का कारण लिखें..."
                      : "Record the reason for this moderation decision (minimum 5 characters)..."
                  }
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
                />
              </div>

              {errorMessage && (
                <Notice variant="error">
                  <p className="text-xs">{errorMessage}</p>
                </Notice>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-rule">
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    setDecisionModal(null);
                    setReason("");
                    setErrorMessage(null);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="small"
                  disabled={isSubmitting || reason.trim().length < 5}
                >
                  {isSubmitting ? "Recording..." : "Confirm & Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
