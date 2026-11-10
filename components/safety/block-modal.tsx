"use client";

import { useState } from "react";
import { blockUserAction } from "@/app/actions/safety";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { ShieldAlert, X } from "lucide-react";

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockedUserId: string;
  blockedUserName: string;
  locale: string;
  onBlockedSuccess?: () => void;
}

export function BlockModal({
  isOpen,
  onClose,
  blockedUserId,
  blockedUserName,
  locale,
  onBlockedSuccess,
}: BlockModalProps) {
  const isHindi = locale === "hi";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBlock = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    const result = await blockUserAction({
      blocked_id: blockedUserId,
      reason: "Blocked from user interface",
    });

    setIsSubmitting(false);

    if (result.success) {
      if (onBlockedSuccess) onBlockedSuccess();
      onClose();
    } else {
      setErrorMsg(result.error || "Failed to block user");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-page border border-rule rounded-sm max-w-md w-full p-6 space-y-5 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rule pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} strokeWidth={1.5} className="text-terracotta" />
            <h2 className="font-heading text-lg font-medium text-text">
              {isHindi ? "उपयोगकर्ता को ब्लॉक करें" : "Block User"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-text"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {errorMsg && (
          <Notice variant="error">
            <strong className="block mb-1 font-semibold">
              {isHindi ? "त्रुटि" : "Error"}
            </strong>
            <p className="text-xs">{errorMsg}</p>
          </Notice>
        )}

        <div className="text-xs text-secondary space-y-2 leading-relaxed">
          <p>
            {isHindi ? "क्या आप वाकई " : "Are you sure you want to block "}
            <strong className="text-text">{blockedUserName}</strong>?
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              {isHindi
                ? "यह चैट तुरंत स्थायी रूप से बंद कर दी जाएगी।"
                : "Active conversations will be permanently closed immediately."}
            </li>
            <li>
              {isHindi
                ? "सभी संपर्क आदान-प्रदान और पता प्रकटीकरण तुरंत रद्द कर दिए जाएंगे।"
                : "All mutual contact disclosures and address reveals are revoked."}
            </li>
            <li>
              {isHindi
                ? "यह व्यक्ति आपको भविष्य में कोई नया अनुरोध नहीं भेज सकेगा।"
                : "This person will not be able to send you future requests."}
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-rule">
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {isHindi ? "रद्द करें" : "Cancel"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={handleBlock}
            disabled={isSubmitting}
            className="text-terracotta border-terracotta/40 hover:bg-terracotta/10"
          >
            {isSubmitting
              ? isHindi
                ? "ब्लॉक किया जा रहा है..."
                : "Blocking..."
              : isHindi
              ? "ब्लॉक की पुष्टि करें"
              : "Confirm Block"}
          </Button>
        </div>
      </div>
    </div>
  );
}
