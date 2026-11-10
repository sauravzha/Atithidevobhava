"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { StatusLabel } from "@/components/ui/status-label";
import {
  ShieldCheck,
  Lock,
  Eye,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import {
  adminViewIdDocumentAction,
  adminReviewVerificationAction,
} from "@/app/actions/admin";

export interface VerificationRecordItem {
  id: string;
  user_id: string;
  verification_type: string;
  status: "pending" | "approved" | "rejected";
  provider: string;
  id_document_image_path?: string | null;
  selfie_image_path?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  decision_reason?: string | null;
  auto_purge_scheduled_at?: string | null;
  created_at: string;
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
  records: VerificationRecordItem[];
  isHindi: boolean;
}

export function AdminVerificationsClient({ records, isHindi }: Props) {
  const router = useRouter();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRecord, setSelectedRecord] = useState<VerificationRecordItem | null>(null);

  // Modal Step: "unlock_reason" | "viewing"
  const [viewStep, setViewStep] = useState<"unlock_reason" | "viewing">("unlock_reason");
  const [viewJustification, setViewJustification] = useState("");
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);

  // Review Decision State
  const [reviewDecision, setReviewDecision] = useState<"approve" | "reject" | null>(null);
  const [decisionReason, setDecisionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredRecords = records.filter((r) => {
    if (statusFilter === "all") return true;
    return r.status === statusFilter;
  });

  const handleUnlockView = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    if (viewJustification.trim().length < 5) {
      setErrorMessage(
        isHindi
          ? "दस्तावेज़ देखने के लिए कम से कम 5 अक्षरों का कारण अनिवार्य है।"
          : "A justification of at least 5 characters is required before document view can be granted."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await adminViewIdDocumentAction({
        verificationRecordId: selectedRecord.id,
        reason: viewJustification.trim(),
      });

      if (!res.success || !res.data) {
        setErrorMessage(res.error || "Failed to log and authorize document view.");
        setIsSubmitting(false);
        return;
      }

      setDocumentUrl(res.data.documentRef);
      setViewStep("viewing");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error authorizing document view.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord || !reviewDecision) return;

    if (decisionReason.trim().length < 5) {
      setErrorMessage(
        isHindi
          ? "कम से कम 5 अक्षरों का निर्णय कारण अनिवार्य है।"
          : "A justification of at least 5 characters is mandatory for the verification decision."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await adminReviewVerificationAction({
        verificationRecordId: selectedRecord.id,
        decision: reviewDecision,
        reason: decisionReason.trim(),
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to record verification decision.");
        setIsSubmitting(false);
        return;
      }

      // Reset and close
      handleCloseViewer();
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error submitting decision.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseViewer = () => {
    setSelectedRecord(null);
    setViewStep("unlock_reason");
    setViewJustification("");
    setDocumentUrl(null);
    setReviewDecision(null);
    setDecisionReason("");
    setErrorMessage(null);
  };

  const getStatusVariant = (
    status: string
  ): "default" | "success" | "warning" | "error" | "info" => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
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
            {["all", "pending", "approved", "rejected"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-sm text-[11px] font-mono transition-colors ${
                  statusFilter === st
                    ? "bg-text text-paper"
                    : "bg-warm hover:bg-warm/80 text-secondary"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-secondary font-mono">
          {filteredRecords.length} {isHindi ? "सत्यापन अनुरोध" : "records"}
        </div>
      </div>

      {/* Verification Records Table */}
      <div className="border border-rule rounded-sm bg-paper overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-warm/40 border-b border-rule font-medium text-secondary">
            <tr>
              <th className="py-2.5 px-4">{isHindi ? "उपयोगकर्ता खाता" : "Account Identity"}</th>
              <th className="py-2.5 px-3">{isHindi ? "सत्यापन प्रकार" : "Verification Tier"}</th>
              <th className="py-2.5 px-3">{isHindi ? "प्रदाता" : "Review Method"}</th>
              <th className="py-2.5 px-3">{isHindi ? "स्थिति" : "Status"}</th>
              <th className="py-2.5 px-3">{isHindi ? "अनुरोध तिथि" : "Requested"}</th>
              <th className="py-2.5 px-4 text-right">{isHindi ? "कार्रवाई" : "Audited View"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule font-sans">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-secondary">
                  {isHindi
                    ? "कोई सत्यापन रिकॉर्ड नहीं मिला।"
                    : "No verification records found matching this status filter."}
                </td>
              </tr>
            ) : (
              filteredRecords.map((item) => {
                const userEmail = Array.isArray(item.users)
                  ? item.users[0]?.email
                  : item.users?.email;

                return (
                  <tr key={item.id} className="hover:bg-warm/10">
                    <td className="py-3 px-4">
                      <div className="font-medium text-text">
                        {userEmail || item.user_id.slice(0, 8)}
                      </div>
                      <div className="text-[10px] text-secondary font-mono mt-0.5">
                        UID: {item.user_id.slice(0, 8)}
                      </div>
                    </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-text capitalize">
                      {item.verification_type.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-secondary text-[11px] font-mono">
                    {item.provider}
                  </td>
                  <td className="py-3 px-3">
                    <StatusLabel
                      status={item.status}
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
                      onClick={() => {
                        setSelectedRecord(item);
                        setViewStep("unlock_reason");
                      }}
                      className="inline-flex items-center gap-1 text-forest hover:underline text-[11px] font-medium"
                    >
                      <Eye size={12} strokeWidth={1.5} />
                      <span>{isHindi ? "सुरक्षित देखें" : "Audited View"}</span>
                    </button>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Two-Step Secure Viewer Modal */}
      {selectedRecord && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-text/60 p-4"
        >
          <div className="bg-paper border border-rule max-w-2xl w-full p-6 rounded-sm shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-rule pb-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase text-forest tracking-wider">
                  <ShieldCheck size={14} strokeWidth={1.5} />
                  <span>Section 23: Identity Document Governance</span>
                </div>
                <h3 className="font-heading text-lg text-text mt-0.5">
                  Verification Record: {selectedRecord.verification_type.replace(/_/g, " ")}
                </h3>
              </div>
              <StatusLabel
                status={selectedRecord.status}
                variant={getStatusVariant(selectedRecord.status)}
              />
            </div>

            {/* Step 1: Pre-View Audit Justification */}
            {viewStep === "unlock_reason" && (
              <div className="space-y-4">
                <div className="p-3 bg-warm/40 border border-rule rounded-sm text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-medium text-text">
                    <Lock size={14} strokeWidth={1.5} className="text-terracotta" />
                    <span>Mandatory Access Control Requirement</span>
                  </div>
                  <p className="text-secondary leading-relaxed">
                    Under Section 23 of the platform security standard, identity verification documents cannot be previewed casually. You must enter a verified administrative justification before decryption/view. This access attempt is recorded permanently in the append-only audit log with your admin identity.
                  </p>
                </div>

                <form onSubmit={handleUnlockView} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-text mb-1">
                      {isHindi
                        ? "दस्तावेज़ देखने का प्रशासनिक कारण (अनिवार्य ऑडिट रिकॉर्ड):"
                        : "Mandatory Audit Justification (Minimum 5 characters):"}
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder={
                        isHindi
                          ? "दस्तावेज़ सत्यापन का कारण दर्ज करें (उदा. 'स्थानीय सदस्य प्रोफ़ाइल सत्यापन')..."
                          : "State the administrative purpose for viewing this document (e.g. 'Identity review for host onboarding')..."
                      }
                      value={viewJustification}
                      onChange={(e) => setViewJustification(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
                    />
                  </div>

                  {errorMessage && (
                    <Notice variant="error">
                      <p className="text-xs">{errorMessage}</p>
                    </Notice>
                  )}

                  <div className="flex justify-end gap-2 pt-2 border-t border-rule">
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      onClick={handleCloseViewer}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="small"
                      disabled={isSubmitting || viewJustification.trim().length < 5}
                    >
                      {isSubmitting ? "Logging Access..." : "Authorize & Decrypt View"}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Secure Audited Viewer with NO Download Button */}
            {viewStep === "viewing" && (
              <div className="space-y-4">
                {/* Security Viewer Container */}
                <div
                  className="relative p-4 bg-warm/30 border border-rule rounded-sm select-none"
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                >
                  {/* Floating Watermark Banner */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-15 overflow-hidden"
                  >
                    <div className="text-center transform -rotate-12 font-mono font-bold text-lg md:text-xl text-text leading-loose">
                      CONFIDENTIAL • AUDITED ADMIN VIEW
                      <br />
                      NO DOWNLOAD AUTHORIZED • ATITHI DEVO BHAVA
                    </div>
                  </div>

                  {/* Document Preview Display */}
                  <div className="min-h-56 flex flex-col items-center justify-center border border-dashed border-rule bg-paper p-6 rounded-xs relative z-10">
                    <div className="text-center space-y-2 max-w-md">
                      <ShieldCheck size={36} strokeWidth={1.5} className="mx-auto text-forest" />
                      <div className="font-heading text-base text-text">
                        Protected Document Reference
                      </div>
                      <p className="text-[11px] font-mono text-secondary break-all">
                        {documentUrl || selectedRecord.id_document_image_path || "Encrypted storage payload"}
                      </p>
                      <p className="text-[11px] text-secondary leading-relaxed pt-2">
                        Per Zero-Storage policy: Raw government identification numbers are discarded upon verification. File retention follows DPDP statutory limits.
                      </p>
                    </div>
                  </div>

                  {/* Viewer Guardrail Notice */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-secondary font-mono">
                    <span>Viewer Mode: Read-Only Stream</span>
                    <span className="text-forest">Download Disabled</span>
                  </div>
                </div>

                {/* Review Decision Form */}
                <div className="p-4 bg-warm/20 border border-rule rounded-sm space-y-3">
                  <span className="text-xs font-medium text-text block">
                    {isHindi ? "सत्यापन निर्णय दर्ज करें:" : "Record Verification Outcome:"}
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setReviewDecision("approve")}
                      className={`px-3 py-1.5 border rounded-sm text-xs font-medium flex items-center gap-1.5 transition-colors ${
                        reviewDecision === "approve"
                          ? "border-forest bg-forest text-paper"
                          : "border-rule bg-paper hover:bg-warm text-secondary"
                      }`}
                    >
                      <CheckCircle size={13} strokeWidth={1.5} />
                      <span>Approve Verification</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReviewDecision("reject")}
                      className={`px-3 py-1.5 border rounded-sm text-xs font-medium flex items-center gap-1.5 transition-colors ${
                        reviewDecision === "reject"
                          ? "border-terracotta bg-terracotta text-paper"
                          : "border-rule bg-paper hover:bg-warm text-secondary"
                      }`}
                    >
                      <XCircle size={13} strokeWidth={1.5} />
                      <span>Reject Verification</span>
                    </button>
                  </div>

                  {reviewDecision && (
                    <form onSubmit={handleReviewDecisionSubmit} className="space-y-3 pt-2">
                      <div>
                        <label className="block text-xs font-medium text-text mb-1">
                          {isHindi
                            ? "निर्णय का कारण (अनिवार्य ऑडिट रिकॉर्ड):"
                            : "Decision Justification (Mandatory audit trail, min 5 chars):"}
                        </label>
                        <textarea
                          rows={2}
                          required
                          placeholder={
                            isHindi
                              ? "कम से कम 5 अक्षरों में अनुमोदन अथवा अस्वीकृति का कारण लिखें..."
                              : "Record the reason for this verification approval or rejection..."
                          }
                          value={decisionReason}
                          onChange={(e) => setDecisionReason(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
                        />
                      </div>

                      {errorMessage && (
                        <Notice variant="error">
                          <p className="text-xs">{errorMessage}</p>
                        </Notice>
                      )}

                      <div className="flex justify-end gap-2 pt-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="small"
                          onClick={() => setReviewDecision(null)}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          size="small"
                          disabled={isSubmitting || decisionReason.trim().length < 5}
                        >
                          {isSubmitting ? "Recording..." : "Save Verification Decision"}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="flex justify-end pt-2 border-t border-rule">
                  <Button
                    type="button"
                    variant="secondary"
                    size="small"
                    onClick={handleCloseViewer}
                  >
                    Close Viewer
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
