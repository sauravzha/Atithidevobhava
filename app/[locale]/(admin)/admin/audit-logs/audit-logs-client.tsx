"use client";

import { useState } from "react";
import { Search, Filter, Lock } from "lucide-react";

export interface AuditLogItem {
  id: string;
  action: string;
  target_entity: string;
  target_id?: string | null;
  performed_by: string;
  reason: string;
  ip_address?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}

interface Props {
  logs: AuditLogItem[];
  isHindi: boolean;
}

export function AdminAuditLogsClient({ logs, isHindi }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<string>("all");

  const entities = Array.from(new Set(logs.map((l) => l.target_entity).filter(Boolean)));

  const filteredLogs = logs.filter((log) => {
    if (selectedEntity !== "all" && log.target_entity !== selectedEntity) {
      return false;
    }
    const q = searchQuery.toLowerCase();
    const actionMatch = log.action.toLowerCase().includes(q);
    const reasonMatch = log.reason.toLowerCase().includes(q);
    const targetMatch = log.target_entity.toLowerCase().includes(q);
    const idMatch = log.target_id?.toLowerCase().includes(q);
    return actionMatch || reasonMatch || targetMatch || idMatch;
  });

  return (
    <div className="space-y-4">
      {/* Information Banner */}
      <div className="p-3 bg-warm/30 border border-rule rounded-sm flex items-start gap-3 text-xs">
        <Lock size={16} strokeWidth={1.5} className="text-forest shrink-0 mt-0.5" />
        <div className="leading-relaxed text-secondary">
          <strong className="text-text font-medium block">
            {isHindi ? "अपरिवर्तनीयता गारंटी (धारा 23)" : "Append-Only Immutability Guarantee (Section 23)"}
          </strong>
          {isHindi
            ? "डेटाबेस नियमों के अनुसार ऑडिट लॉग पंक्तियों में संशोधन (UPDATE) या निष्कासन (DELETE) अवरुद्ध है।"
            : "Audit log records are append-only. UPDATE and DELETE operations are blocked by PostgreSQL constraints to ensure complete regulatory accountability."}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-paper p-3 border border-rule rounded-sm text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search size={14} strokeWidth={1.5} className="text-secondary" />
          <input
            type="text"
            placeholder={
              isHindi
                ? "कार्रवाई, कारण या आईडी द्वारा खोजें..."
                : "Search by action, justification, or target ID..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-text focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} strokeWidth={1.5} className="text-secondary" />
          <span className="font-medium text-text">Entity:</span>
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="px-2 py-1 bg-warm border border-rule rounded-sm text-xs text-text focus:outline-none"
          >
            <option value="all">All Entities</option>
            {entities.map((ent) => (
              <option key={ent} value={ent}>
                {ent}
              </option>
            ))}
          </select>
        </div>

        <div className="text-[11px] text-secondary font-mono">
          {filteredLogs.length} entries
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="border border-rule rounded-sm bg-paper overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-warm/40 border-b border-rule font-medium text-secondary">
            <tr>
              <th className="py-2.5 px-4">{isHindi ? "समय" : "Timestamp"}</th>
              <th className="py-2.5 px-3">{isHindi ? "कार्रवाई" : "Action"}</th>
              <th className="py-2.5 px-3">{isHindi ? "लक्ष्य सत्ता" : "Target"}</th>
              <th className="py-2.5 px-3">{isHindi ? "प्रशासक" : "Admin ID"}</th>
              <th className="py-2.5 px-4">{isHindi ? "औचित्य / कारण" : "Justification"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule font-sans">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-secondary">
                  {isHindi
                    ? "कोई ऑडिट लॉग प्रविष्टि नहीं मिली।"
                    : "No audit log entries found matching this search criteria."}
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-warm/10">
                  <td className="py-2.5 px-4 font-mono text-[11px] text-secondary whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString(
                      isHindi ? "hi-IN" : "en-IN"
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 bg-warm border border-rule rounded-xs text-[10px] font-mono text-text font-semibold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px]">
                    <div className="text-text font-medium">{log.target_entity}</div>
                    {log.target_id && (
                      <div className="text-[10px] text-secondary">
                        {log.target_id.slice(0, 8)}
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-secondary whitespace-nowrap">
                    {log.performed_by.slice(0, 8)}
                  </td>
                  <td className="py-2.5 px-4 text-secondary leading-relaxed">
                    <p className="line-clamp-2">{log.reason}</p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
