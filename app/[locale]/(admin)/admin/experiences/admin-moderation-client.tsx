"use client";

import { useState } from "react";
import { adminModerateExperienceAction } from "@/app/actions/experiences";
import { Button } from "@/components/ui/button";
import { StatusLabel } from "@/components/ui/status-label";
import { Notice } from "@/components/ui/notice";
import { Field } from "@/components/ui/field";
import {
  Check,
  X,
  History,
  Eye,
} from "lucide-react";

interface ModerationItem {
  id: string;
  titleEn: string;
  titleHi: string;
  categoryNameEn: string;
  categoryNameHi: string;
  hostName: string;
  hostNameHi: string;
  hostRole: string;
  districtName: string;
  generalMeetingArea: string;
  durationEn: string;
  maxParticipants: number;
  descriptionEn: string;
  descriptionHi: string;
  status: "pending_review" | "published" | "changes_requested" | "rejected" | "suspended";
  submittedAt: string;
}

interface AuditLogItem {
  id: string;
  adminName: string;
  action: string;
  targetTitle: string;
  decision: string;
  reason: string;
  timestamp: string;
}

interface AdminModerationClientProps {
  initialItems: ModerationItem[];
  initialLogs: AuditLogItem[];
  locale: string;
}

export function AdminModerationClient({
  initialItems,
  initialLogs,
  locale,
}: AdminModerationClientProps) {
  const isHindi = locale === "hi";
  const [items, setItems] = useState<ModerationItem[]>(initialItems);
  const [logs, setLogs] = useState<AuditLogItem[]>(initialLogs);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [inspectingItem, setInspectingItem] = useState<ModerationItem | null>(null);

  // Decision Modal State
  const [decisionType, setDecisionType] = useState<"approve" | "reject" | "request_changes" | "suspend" | null>(null);
  const [targetItem, setTargetItem] = useState<ModerationItem | null>(null);
  const [reasonInput, setReasonInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    if (activeFilter === "all") return true;
    return item.status === activeFilter;
  });

  const openDecisionModal = (
    item: ModerationItem,
    type: "approve" | "reject" | "request_changes" | "suspend"
  ) => {
    setTargetItem(item);
    setDecisionType(type);
    setReasonInput(type === "approve" ? "Verified against platform standards" : "");
    setFeedbackInput("");
    setActionError(null);
  };

  const handleExecuteDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetItem || !decisionType) return;

    if (decisionType !== "approve" && reasonInput.trim().length < 5) {
      setActionError("A reason of at least 5 characters is mandatory for audit compliance.");
      return;
    }

    setIsProcessing(true);
    setActionError(null);

    const result = await adminModerateExperienceAction({
      experience_id: targetItem.id,
      decision: decisionType,
      reason: reasonInput,
      feedback: feedbackInput || undefined,
    });

    setIsProcessing(false);

    if (result.success) {
      const newStatus =
        decisionType === "approve"
          ? "published"
          : decisionType === "request_changes"
          ? "changes_requested"
          : decisionType === "reject"
          ? "rejected"
          : "suspended";

      setItems((prev) =>
        prev.map((i) => (i.id === targetItem.id ? { ...i, status: newStatus } : i))
      );

      // Append to live audit log
      const newLog: AuditLogItem = {
        id: `log-${Date.now()}`,
        adminName: "Active Moderator (MFA AAL2)",
        action: "experience_moderated",
        targetTitle: targetItem.titleEn,
        decision: decisionType,
        reason: reasonInput,
        timestamp: new Date().toISOString(),
      };
      setLogs((prev) => [newLog, ...prev]);

      setActionSuccess(
        isHindi
          ? `निर्णय (${decisionType}) सफलतापूर्वक दर्ज किया गया।`
          : `Moderation decision (${decisionType}) successfully applied and audit-logged.`
      );

      setTargetItem(null);
      setDecisionType(null);
      setInspectingItem(null);
    } else {
      setActionError(result.error || "Failed to execute moderation decision");
    }
  };

  const getStatusLabel = (status: ModerationItem["status"]) => {
    switch (status) {
      case "published":
        return { text: isHindi ? "प्रकाशित" : "Published", variant: "success" as const };
      case "pending_review":
        return { text: isHindi ? "समीक्षाधीन" : "Pending Review", variant: "warning" as const };
      case "changes_requested":
        return { text: isHindi ? "परिवर्तन अपेक्षित" : "Changes Needed", variant: "warning" as const };
      case "rejected":
        return { text: isHindi ? "अस्वीकृत" : "Rejected", variant: "error" as const };
      case "suspended":
        return { text: isHindi ? "निलंबित" : "Suspended", variant: "error" as const };
    }
  };

  return (
    <div className="space-y-8">
      {actionSuccess && (
        <Notice variant="default">
          <strong className="block mb-1 font-semibold">
            {isHindi ? "समीक्षा पूर्ण" : "Audit Logged"}
          </strong>
          <p className="text-xs">{actionSuccess}</p>
        </Notice>
      )}

      {actionError && (
        <Notice variant="error">
          <strong className="block mb-1 font-semibold">
            {isHindi ? "त्रुटि" : "Moderation Error"}
          </strong>
          <p className="text-xs">{actionError}</p>
        </Notice>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-rule pb-3">
        {[
          { key: "all", labelEn: "All Listings", labelHi: "सभी सूचियां" },
          { key: "pending_review", labelEn: "Pending Review", labelHi: "समीक्षाधीन" },
          { key: "published", labelEn: "Published", labelHi: "प्रकाशित" },
          { key: "changes_requested", labelEn: "Changes Requested", labelHi: "परिवर्तन अपेक्षित" },
          { key: "rejected", labelEn: "Rejected", labelHi: "अस्वीकृत" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveFilter(tab.key)}
            className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
              activeFilter === tab.key
                ? "bg-text text-page"
                : "border border-rule text-secondary hover:text-text"
            }`}
          >
            {isHindi ? tab.labelHi : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Dense Table */}
      <div className="border border-rule rounded-sm overflow-x-auto bg-page">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-rule bg-warm/25 text-secondary uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 font-semibold">Title & Host</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold">Location</th>
              <th className="py-3 px-4 font-semibold">Public Meeting Venue</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule/60">
            {filteredItems.map((item) => {
              const statusInfo = getStatusLabel(item.status);

              return (
                <tr key={item.id} className="hover:bg-warm/10 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-text">
                      {isHindi ? item.titleHi : item.titleEn}
                    </div>
                    <div className="text-[11px] text-secondary">
                      {item.hostName} ({item.hostRole})
                    </div>
                  </td>

                  <td className="py-3 px-4 text-secondary">
                    {isHindi ? item.categoryNameHi : item.categoryNameEn}
                  </td>

                  <td className="py-3 px-4 text-secondary">
                    {item.districtName}
                  </td>

                  <td className="py-3 px-4 text-text max-w-xs truncate">
                    {item.generalMeetingArea}
                  </td>

                  <td className="py-3 px-4">
                    <StatusLabel status={statusInfo.text} variant={statusInfo.variant} />
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => setInspectingItem(item)}
                        title="Inspect full details"
                      >
                        <Eye size={12} strokeWidth={1.5} className="mr-1" />
                        <span>{isHindi ? "निरीक्षण" : "Inspect"}</span>
                      </Button>

                      {item.status === "pending_review" && (
                        <>
                          <Button
                            variant="primary"
                            size="small"
                            onClick={() => openDecisionModal(item, "approve")}
                            title="Approve for publication"
                          >
                            <Check size={12} strokeWidth={1.5} className="mr-1" />
                            <span>{isHindi ? "अनुमोदित" : "Approve"}</span>
                          </Button>

                          <Button
                            variant="secondary"
                            size="small"
                            onClick={() => openDecisionModal(item, "request_changes")}
                            title="Request modifications from host"
                          >
                            <span>{isHindi ? "बदलाव" : "Changes"}</span>
                          </Button>

                          <Button
                            variant="secondary"
                            size="small"
                            onClick={() => openDecisionModal(item, "reject")}
                            className="text-terracotta hover:bg-terracotta/10"
                            title="Reject listing"
                          >
                            <X size={12} strokeWidth={1.5} />
                          </Button>
                        </>
                      )}

                      {item.status === "published" && (
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => openDecisionModal(item, "suspend")}
                          className="text-terracotta hover:bg-terracotta/10"
                          title="Suspend active listing"
                        >
                          <span>{isHindi ? "निलंबित" : "Suspend"}</span>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Full Inspection Modal */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-page border border-rule rounded-sm max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-rule pb-3">
              <h2 className="font-heading text-lg font-medium text-text">
                {isHindi ? "सांस्कृतिक सूची का विस्तृत निरीक्षण" : "Experience Listing Details"}
              </h2>
              <button
                type="button"
                onClick={() => setInspectingItem(null)}
                className="text-secondary hover:text-text"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-semibold text-secondary uppercase tracking-wider block text-[11px]">
                  Title (EN / HI)
                </span>
                <p className="text-text font-medium text-sm mt-0.5">{inspectingItem.titleEn}</p>
                <p className="text-secondary">{inspectingItem.titleHi}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-secondary uppercase tracking-wider block text-[11px]">
                    Category
                  </span>
                  <p className="text-text mt-0.5">{inspectingItem.categoryNameEn}</p>
                </div>
                <div>
                  <span className="font-semibold text-secondary uppercase tracking-wider block text-[11px]">
                    Host Provider
                  </span>
                  <p className="text-text mt-0.5">{inspectingItem.hostName} ({inspectingItem.hostRole})</p>
                </div>
              </div>

              <div>
                <span className="font-semibold text-secondary uppercase tracking-wider block text-[11px]">
                  General Public Meeting Venue
                </span>
                <p className="text-text font-medium mt-0.5 p-2.5 bg-warm/25 border border-rule rounded-sm">
                  {inspectingItem.generalMeetingArea}
                </p>
              </div>

              <div>
                <span className="font-semibold text-secondary uppercase tracking-wider block text-[11px]">
                  Detailed Description (English)
                </span>
                <p className="text-text mt-0.5 leading-relaxed whitespace-pre-line p-3 border border-rule rounded-sm bg-warm/10">
                  {inspectingItem.descriptionEn}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-rule">
              <Button variant="secondary" size="small" onClick={() => setInspectingItem(null)}>
                {isHindi ? "बंद करें" : "Close"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Decision Prompt Modal */}
      {decisionType && targetItem && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form
            onSubmit={handleExecuteDecision}
            className="bg-page border border-rule rounded-sm max-w-md w-full p-6 space-y-4 shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-rule pb-2">
              <h3 className="font-heading text-base font-medium text-text">
                Confirm Moderation: {decisionType.toUpperCase()}
              </h3>
              <button
                type="button"
                onClick={() => setDecisionType(null)}
                className="text-secondary hover:text-text"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            <p className="text-xs text-secondary">
              Listing: <strong className="text-text">{targetItem.titleEn}</strong>
            </p>

            <Field
              label="Mandatory Reason (Audit Log Record)"
              htmlFor="moderation_reason"
              helperText={
                decisionType === "approve"
                  ? "Audit justification for approval"
                  : "Must be at least 5 characters explaining why"
              }
            >
              <textarea
                id="moderation_reason"
                rows={3}
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                required
                className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary"
              />
            </Field>

            {decisionType === "request_changes" && (
              <Field
                label="Host Feedback"
                htmlFor="moderation_feedback"
                helperText="Specific instructions for the host to update their listing"
              >
                <textarea
                  id="moderation_feedback"
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full px-3 py-2 border border-rule rounded-sm text-xs bg-page focus:ring-1 focus:ring-primary"
                />
              </Field>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-rule">
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={() => setDecisionType(null)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={decisionType === "reject" || decisionType === "suspend" ? "secondary" : "primary"}
                size="small"
                disabled={isProcessing}
                className={
                  decisionType === "reject" || decisionType === "suspend"
                    ? "text-terracotta border-terracotta/40 hover:bg-terracotta/10"
                    : ""
                }
              >
                {isProcessing ? "Processing..." : `Confirm ${decisionType}`}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Append-Only Audit Log Trail */}
      <section className="space-y-3 pt-6 border-t border-rule">
        <div className="flex items-center gap-2">
          <History size={16} strokeWidth={1.5} className="text-primary" />
          <h2 className="font-heading text-lg font-medium text-text">
            {isHindi ? "संपादकीय ऑडिट लॉग रिकॉर्ड" : "Editorial Audit Trail (Append-Only)"}
          </h2>
        </div>

        <div className="border border-rule rounded-sm overflow-x-auto bg-page">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-rule bg-warm/25 text-secondary uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-4 font-semibold">Timestamp</th>
                <th className="py-2.5 px-4 font-semibold">Admin Identity</th>
                <th className="py-2.5 px-4 font-semibold">Experience Listing</th>
                <th className="py-2.5 px-4 font-semibold">Decision</th>
                <th className="py-2.5 px-4 font-semibold">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule/60 text-secondary">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-warm/10">
                  <td className="py-2.5 px-4 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleString([], {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-2.5 px-4 text-text font-medium">{log.adminName}</td>
                  <td className="py-2.5 px-4 text-text">{log.targetTitle}</td>
                  <td className="py-2.5 px-4">
                    <span className="uppercase text-[10px] font-semibold px-2 py-0.5 bg-warm border border-rule rounded-sm">
                      {log.decision}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 italic">{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
