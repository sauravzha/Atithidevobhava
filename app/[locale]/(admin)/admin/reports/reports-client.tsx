"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { StatusLabel } from "@/components/ui/status-label";
import {
  AlertTriangle,
  ShieldAlert,
  MessageSquare,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import { adminTriageReportAction } from "@/app/actions/admin";

export interface SnapshotMessage {
  id?: string;
  sender_id?: string;
  sender_role?: string;
  body?: string;
  content?: string;
  created_at?: string;
}

export interface ReportItem {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: string;
  target_entity: string;
  target_id?: string | null;
  details: string;
  snapshot_messages?: SnapshotMessage[] | null;
  is_urgent: boolean;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  resolution_notes?: string | null;
  created_at: string;
}

interface Props {
  reports: ReportItem[];
  isHindi: boolean;
}

export function AdminReportsClient({ reports, isHindi }: Props) {
  const router = useRouter();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [triageAction, setTriageAction] = useState<
    "investigate" | "resolve" | "dismiss" | "suspend_user" | null
  >(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const urgentPendingCount = reports.filter(
    (r) => r.is_urgent && (r.status === "pending" || r.status === "investigating")
  ).length;

  const filteredReports = reports.filter((r) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "urgent") return r.is_urgent;
    return r.status === statusFilter;
  });

  const handleTriageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport || !triageAction) return;

    if (notes.trim().length < 5) {
      setErrorMessage(
        isHindi
          ? "कम से कम 5 अक्षरों का ट्राइएज विवरण अनिवार्य है।"
          : "Resolution notes of at least 5 characters are required."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await adminTriageReportAction({
        reportId: selectedReport.id,
        action: triageAction,
        notes: notes.trim(),
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to complete triage action.");
        setIsSubmitting(false);
        return;
      }

      setSelectedReport(null);
      setTriageAction(null);
      setNotes("");
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error executing triage action.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case "unsafe_or_threatening":
        return isHindi ? "असुरक्षित या धमकी भरा व्यवहार" : "Unsafe or Threatening Conduct";
      case "harassment":
        return isHindi ? "उत्पीड़न" : "Harassment";
      case "asked_for_money":
        return isHindi ? "अनाधिकृत धन की मांग" : "Unauthorized Solicitation";
      case "fake_profile":
        return isHindi ? "फर्जी प्रोफाइल" : "Misrepresented Profile";
      case "discrimination":
        return isHindi ? "भेदभाव" : "Discrimination";
      case "inappropriate_sexual_content":
        return isHindi ? "अनुचित सामग्री" : "Inappropriate Sexual Content";
      case "suspected_trafficking_or_exploitation":
        return isHindi ? "संदिग्ध शोषण या तस्करी" : "Suspected Exploitation Alert";
      default:
        return reason.replace(/_/g, " ");
    }
  };

  const getStatusVariant = (
    status: string
  ): "default" | "success" | "warning" | "error" | "info" => {
    switch (status) {
      case "resolved":
        return "success";
      case "investigating":
        return "info";
      case "dismissed":
        return "default";
      case "pending":
      default:
        return "warning";
    }
  };

  return (
    <div className="space-y-4">
      {/* Urgent Warning Banner */}
      {urgentPendingCount > 0 && (
        <div className="p-4 bg-terracotta/10 border-l-4 border-terracotta rounded-sm flex items-start gap-3">
          <AlertTriangle size={18} strokeWidth={1.5} className="text-terracotta shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-terracotta uppercase tracking-wider">
              {isHindi ? "उच्च प्राथमिकता सुरक्षा चेतावनी" : "High Priority Safety Escalation"}
            </div>
            <p className="text-xs text-text mt-0.5 leading-relaxed">
              {urgentPendingCount}{" "}
              {isHindi
                ? "अत्यावश्यक सुरक्षा रिपोर्ट ट्राइएज की प्रतीक्षा कर रही हैं। कृपया तत्काल समीक्षा करें।"
                : "urgent incident reports require immediate administrative evaluation and triage."}
            </p>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-paper p-3 border border-rule rounded-sm text-xs">
        <div className="flex items-center gap-2">
          <Filter size={14} strokeWidth={1.5} className="text-secondary" />
          <span className="font-medium text-text">
            {isHindi ? "फ़िल्टर:" : "Filter:"}
          </span>
          <div className="flex flex-wrap gap-1">
            {["all", "urgent", "pending", "investigating", "resolved", "dismissed"].map(
              (st) => (
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
              )
            )}
          </div>
        </div>

        <div className="text-[11px] text-secondary font-mono">
          {filteredReports.length} {isHindi ? "रिपोर्ट" : "reports listed"}
        </div>
      </div>

      {/* Reports Table */}
      <div className="border border-rule rounded-sm bg-paper overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-warm/40 border-b border-rule font-medium text-secondary">
            <tr>
              <th className="py-2.5 px-4">{isHindi ? "प्राथमिकता एवं श्रेणी" : "Priority & Category"}</th>
              <th className="py-2.5 px-3">{isHindi ? "विवरण सारांश" : "Report Summary"}</th>
              <th className="py-2.5 px-3">{isHindi ? "लक्ष्य" : "Target Entity"}</th>
              <th className="py-2.5 px-3">{isHindi ? "स्थिति" : "Status"}</th>
              <th className="py-2.5 px-3">{isHindi ? "तिथि" : "Submitted"}</th>
              <th className="py-2.5 px-4 text-right">{isHindi ? "कार्रवाई" : "Triage"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule font-sans">
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-secondary">
                  {isHindi
                    ? "कोई सुरक्षा रिपोर्ट नहीं मिली।"
                    : "No incident reports found matching this filter."}
                </td>
              </tr>
            ) : (
              filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-warm/10">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      {report.is_urgent && (
                        <span className="px-1.5 py-0.5 bg-red-100 text-terracotta border border-red-200 rounded-xs text-[10px] font-mono font-semibold uppercase">
                          Urgent
                        </span>
                      )}
                      <span className="font-medium text-text">
                        {getReasonLabel(report.reason)}
                      </span>
                    </div>
                    <div className="text-[10px] text-secondary font-mono mt-0.5">
                      ID: {report.id.slice(0, 8)}
                    </div>
                  </td>
                  <td className="py-3 px-3 max-w-xs">
                    <p className="text-secondary line-clamp-2 leading-relaxed">
                      {report.details}
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-1.5 py-0.5 bg-warm border border-rule rounded-xs text-[10px] font-mono text-secondary">
                      {report.target_entity}
                    </span>
                    <div className="text-[10px] text-secondary font-mono mt-1">
                      Reported: {report.reported_user_id.slice(0, 8)}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <StatusLabel
                      status={report.status}
                      variant={getStatusVariant(report.status)}
                    />
                  </td>
                  <td className="py-3 px-3 text-secondary text-[11px] font-mono">
                    {new Date(report.created_at).toLocaleDateString(
                      isHindi ? "hi-IN" : "en-IN"
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="inline-flex items-center gap-1 text-forest hover:underline text-[11px] font-medium"
                    >
                      <Eye size={12} strokeWidth={1.5} />
                      <span>{isHindi ? "जांचें" : "Investigate"}</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Report Investigation Drawer / Modal */}
      {selectedReport && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-text/50 p-4"
        >
          <div className="bg-paper border border-rule max-w-2xl w-full p-6 rounded-sm shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-rule pb-3">
              <div>
                <div className="flex items-center gap-2">
                  {selectedReport.is_urgent && (
                    <span className="px-1.5 py-0.5 bg-red-100 text-terracotta border border-red-200 rounded-xs text-[10px] font-mono uppercase font-semibold">
                      Urgent Escalation
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-secondary">
                    Report ID: {selectedReport.id}
                  </span>
                </div>
                <h3 className="font-heading text-xl text-text mt-1">
                  {getReasonLabel(selectedReport.reason)}
                </h3>
              </div>
              <StatusLabel
                status={selectedReport.status}
                variant={getStatusVariant(selectedReport.status)}
              />
            </div>

            {/* Target & Context Details */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-warm/30 border border-rule rounded-sm text-xs font-mono">
              <div>
                <span className="text-secondary block text-[10px] uppercase">Reporter User ID:</span>
                <span className="text-text">{selectedReport.reporter_id}</span>
              </div>
              <div>
                <span className="text-secondary block text-[10px] uppercase">Reported User ID:</span>
                <span className="text-text">{selectedReport.reported_user_id}</span>
              </div>
              <div>
                <span className="text-secondary block text-[10px] uppercase">Entity Type:</span>
                <span className="text-text capitalize">{selectedReport.target_entity}</span>
              </div>
              <div>
                <span className="text-secondary block text-[10px] uppercase">Created At:</span>
                <span className="text-text">
                  {new Date(selectedReport.created_at).toLocaleString(
                    isHindi ? "hi-IN" : "en-IN"
                  )}
                </span>
              </div>
            </div>

            {/* Reported Details Body */}
            <div className="p-3 border border-rule rounded-sm text-xs space-y-1">
              <span className="font-medium text-text block">
                {isHindi ? "शिकायतकर्ता द्वारा दर्ज विवरण:" : "Statement of Incident:"}
              </span>
              <p className="text-secondary leading-relaxed whitespace-pre-line">
                {selectedReport.details}
              </p>
            </div>

            {/* 20-Message Snapshot Transcript Inspector */}
            <div className="p-3 border border-rule rounded-sm text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-text flex items-center gap-1.5">
                  <MessageSquare size={14} strokeWidth={1.5} className="text-secondary" />
                  <span>
                    {isHindi
                      ? "घटना संदर्भ संदेश स्नैपशॉट (अधिकतम 20 संदेश):"
                      : "Message Transcript Snapshot (Last 20 Messages):"}
                  </span>
                </span>
                <span className="text-[10px] font-mono text-secondary">
                  Section 23: Tamper-evident record
                </span>
              </div>

              {selectedReport.snapshot_messages && selectedReport.snapshot_messages.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-warm/20 rounded-xs border border-rule text-xs">
                  {selectedReport.snapshot_messages.map((msg, i) => (
                    <div
                      key={msg.id || i}
                      className="p-2 bg-paper border border-rule rounded-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-secondary">
                        <span className="text-text font-semibold">
                          Sender: {msg.sender_role || msg.sender_id || "Participant"}
                        </span>
                        {msg.created_at && (
                          <span>{new Date(msg.created_at).toLocaleTimeString()}</span>
                        )}
                      </div>
                      <p className="text-text">{msg.body || msg.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-secondary italic">
                  {isHindi
                    ? "इस रिपोर्ट के साथ कोई संदेश स्नैपशॉट संलग्न नहीं है (यह प्रोफाइल या आवास स्तर की रिपोर्ट हो सकती है)।"
                    : "No direct message transcript snapshot attached to this report."}
                </p>
              )}
            </div>

            {/* Existing Resolution Notes */}
            {selectedReport.resolution_notes && (
              <div className="p-3 bg-warm/40 border border-rule rounded-sm text-xs space-y-1">
                <span className="font-medium text-text block">
                  {isHindi ? "मौजूदा समाधान नोट्स:" : "Existing Triage Resolution Notes:"}
                </span>
                <p className="text-secondary leading-relaxed font-mono">
                  {selectedReport.resolution_notes}
                </p>
              </div>
            )}

            {/* Triage Decision Section */}
            <div className="pt-4 border-t border-rule space-y-3">
              <span className="text-xs font-medium text-text block">
                {isHindi ? "प्रशासनिक कार्रवाई चुनें:" : "Select Triage Resolution:"}
              </span>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setTriageAction("investigate")}
                  className={`p-2.5 border rounded-sm text-xs font-medium text-left transition-colors ${
                    triageAction === "investigate"
                      ? "border-forest bg-forest/10 text-forest"
                      : "border-rule bg-paper hover:bg-warm text-secondary"
                  }`}
                >
                  <Clock size={14} strokeWidth={1.5} className="mb-1" />
                  <div className="font-semibold">Investigate</div>
                  <div className="text-[10px] opacity-80">Mark in progress</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTriageAction("resolve")}
                  className={`p-2.5 border rounded-sm text-xs font-medium text-left transition-colors ${
                    triageAction === "resolve"
                      ? "border-forest bg-forest/10 text-forest"
                      : "border-rule bg-paper hover:bg-warm text-secondary"
                  }`}
                >
                  <CheckCircle size={14} strokeWidth={1.5} className="mb-1" />
                  <div className="font-semibold">Resolve</div>
                  <div className="text-[10px] opacity-80">Close with notes</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTriageAction("dismiss")}
                  className={`p-2.5 border rounded-sm text-xs font-medium text-left transition-colors ${
                    triageAction === "dismiss"
                      ? "border-secondary bg-warm text-text"
                      : "border-rule bg-paper hover:bg-warm text-secondary"
                  }`}
                >
                  <XCircle size={14} strokeWidth={1.5} className="mb-1" />
                  <div className="font-semibold">Dismiss</div>
                  <div className="text-[10px] opacity-80">Unsubstantiated</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTriageAction("suspend_user")}
                  className={`p-2.5 border rounded-sm text-xs font-medium text-left transition-colors ${
                    triageAction === "suspend_user"
                      ? "border-terracotta bg-red-50 text-terracotta"
                      : "border-rule bg-paper hover:bg-warm text-terracotta"
                  }`}
                >
                  <ShieldAlert size={14} strokeWidth={1.5} className="mb-1 text-terracotta" />
                  <div className="font-semibold">Suspend Account</div>
                  <div className="text-[10px] opacity-80">Immediate suspension</div>
                </button>
              </div>

              {triageAction && (
                <form onSubmit={handleTriageSubmit} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-text mb-1">
                      {isHindi
                        ? "समाधान नोट्स (अनिवार्य ऑडिट रिकॉर्ड, न्यूनतम 5 अक्षर):"
                        : "Mandatory Resolution Notes (Audit Log Record, min 5 chars):"}
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder={
                        isHindi
                          ? "जांच का निष्कर्ष और की गई कार्रवाई का विवरण दर्ज करें..."
                          : "Record findings, decisions taken, and any safety escalations..."
                      }
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
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
                      onClick={() => {
                        setTriageAction(null);
                        setNotes("");
                        setErrorMessage(null);
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel Action
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="small"
                      disabled={isSubmitting || notes.trim().length < 5}
                    >
                      {isSubmitting ? "Executing..." : "Confirm & Save Triage"}
                    </Button>
                  </div>
                </form>
              )}

              {!triageAction && (
                <div className="flex justify-end pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="small"
                    onClick={() => setSelectedReport(null)}
                  >
                    Close Window
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
