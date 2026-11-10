"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { StatusLabel } from "@/components/ui/status-label";
import { Search, ShieldAlert, UserCheck } from "lucide-react";
import {
  adminSuspendUserAction,
  adminReactivateUserAction,
} from "@/app/actions/admin";

interface UserItem {
  id: string;
  email: string;
  birth_year: number;
  is_suspended: boolean;
  created_at: string;
  user_roles?: Array<{ role: string }>;
  traveller_profiles?: Array<{ full_name: string; country_of_residence: string }>;
  local_member_profiles?: Array<{ display_name: string; state_id: string }>;
}

interface Props {
  users: UserItem[];
  isHindi: boolean;
}

export function AdminUsersClient({ users, isHindi }: Props) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [actionType, setActionType] = useState<"suspend" | "reactivate" | null>(null);
  const [reason, setReason] = useState("");
  const [permanentBan, setPermanentBan] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const emailMatch = u.email?.toLowerCase().includes(q);
    const travellerName = u.traveller_profiles?.[0]?.full_name?.toLowerCase().includes(q);
    const localName = u.local_member_profiles?.[0]?.display_name?.toLowerCase().includes(q);
    return emailMatch || travellerName || localName;
  });

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !actionType) return;

    if (reason.trim().length < 5) {
      setErrorMessage(
        isHindi
          ? "कम से कम 5 अक्षरों का कारण अनिवार्य है"
          : "A justification of at least 5 characters is mandatory"
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      let res;
      if (actionType === "suspend") {
        res = await adminSuspendUserAction({
          userId: selectedUser.id,
          action: "suspend",
          reason: reason.trim(),
          permanent: permanentBan,
        });
      } else {
        res = await adminReactivateUserAction({
          userId: selectedUser.id,
          action: "reactivate",
          reason: reason.trim(),
          permanent: false,
        });
      }

      if (!res.success) {
        setErrorMessage(res.error || "Action failed");
        setIsSubmitting(false);
        return;
      }

      setSelectedUser(null);
      setActionType(null);
      setReason("");
      setPermanentBan(false);
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error executing action");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex items-center gap-3 bg-paper p-3 border border-rule rounded-sm">
        <Search size={14} strokeWidth={1.5} className="text-secondary" />
        <input
          type="text"
          placeholder={
            isHindi
              ? "ईमेल या नाम द्वारा खोजें..."
              : "Search users by email or display name..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-xs text-text focus:outline-none"
        />
        <span className="font-mono text-[11px] text-secondary">
          {filteredUsers.length} accounts
        </span>
      </div>

      {/* Users Table */}
      <div className="border border-rule rounded-sm bg-paper overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-warm/40 border-b border-rule font-medium text-secondary">
            <tr>
              <th className="py-2.5 px-4">{isHindi ? "उपयोगकर्ता" : "Account Identity"}</th>
              <th className="py-2.5 px-3">{isHindi ? "सक्रिय भूमिकाएं" : "Roles"}</th>
              <th className="py-2.5 px-3">{isHindi ? "स्थिति" : "Status"}</th>
              <th className="py-2.5 px-3">{isHindi ? "पंजीकरण तिथि" : "Registered"}</th>
              <th className="py-2.5 px-4 text-right">{isHindi ? "कार्रवाई" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule font-mono">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-secondary font-sans">
                  {isHindi ? "कोई खाता नहीं मिला।" : "No accounts match this query."}
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const name =
                  u.traveller_profiles?.[0]?.full_name ||
                  u.local_member_profiles?.[0]?.display_name ||
                  "—";
                const roles = u.user_roles?.map((r) => r.role) || [];

                return (
                  <tr key={u.id} className="hover:bg-warm/10 font-sans">
                    <td className="py-2.5 px-4">
                      <div className="font-medium text-text">{u.email}</div>
                      <div className="text-[11px] text-secondary">{name}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {roles.map((r) => (
                          <span
                            key={r}
                            className="px-1.5 py-0.5 bg-warm border border-rule rounded-xs text-[10px] text-secondary font-mono"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusLabel
                        status={u.is_suspended ? "Suspended" : "Active"}
                        variant={u.is_suspended ? "error" : "success"}
                      />
                    </td>
                    <td className="py-2.5 px-3 text-secondary text-[11px] font-mono">
                      {new Date(u.created_at).toLocaleDateString(
                        isHindi ? "hi-IN" : "en-IN"
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {u.is_suspended ? (
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setActionType("reactivate");
                          }}
                          className="text-forest hover:underline text-[11px] font-medium"
                        >
                          {isHindi ? "बहाल करें" : "Reactivate"}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setActionType("suspend");
                          }}
                          className="text-terracotta hover:underline text-[11px] font-medium"
                        >
                          {isHindi ? "निलंबित करें" : "Suspend"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Action Modal */}
      {selectedUser && actionType && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-text/50 p-4"
        >
          <div className="bg-paper border border-rule max-w-md w-full p-6 rounded-sm shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-rule pb-3">
              {actionType === "suspend" ? (
                <ShieldAlert size={18} strokeWidth={1.5} className="text-terracotta" />
              ) : (
                <UserCheck size={18} strokeWidth={1.5} className="text-forest" />
              )}
              <h3 className="font-heading text-lg text-text">
                {actionType === "suspend"
                  ? isHindi
                    ? "उपयोगकर्ता निलंबन"
                    : "Suspend User Account"
                  : isHindi
                  ? "उपयोगकर्ता बहाली"
                  : "Reactivate User Account"}
              </h3>
            </div>

            <p className="text-xs text-secondary leading-relaxed">
              Target account: <span className="font-mono text-text font-semibold">{selectedUser.email}</span>
            </p>

            <form onSubmit={handleAction} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text mb-1">
                  {isHindi ? "प्रशासनिक कारण (अनिवार्य, ऑडिट हेतु):" : "Mandatory Justification (Audit Log):"}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={
                    isHindi
                      ? "कम से कम 5 अक्षरों में कार्रवाई का कारण दर्ज करें..."
                      : "Please record the justification for this moderation decision (min 5 characters)..."
                  }
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
                />
              </div>

              {actionType === "suspend" && (
                <div className="p-3 bg-warm border border-rule rounded-sm">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permanentBan}
                      onChange={(e) => setPermanentBan(e.target.checked)}
                      className="text-terracotta focus:ring-terracotta"
                    />
                    <span className="text-text font-medium">
                      Permanent Ban (Requires super_admin role)
                    </span>
                  </label>
                </div>
              )}

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
                    setSelectedUser(null);
                    setActionType(null);
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
                  {isSubmitting
                    ? "Saving..."
                    : actionType === "suspend"
                    ? "Confirm Suspension"
                    : "Confirm Reactivation"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
