"use client";

import { useState } from "react";
import Link from "next/link";
import { markNotificationReadAction } from "@/app/actions/safety";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  linkUrl: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsClientProps {
  initialNotifications: NotificationItem[];
  locale: string;
}

export function NotificationsClient({
  initialNotifications,
  locale,
}: NotificationsClientProps) {
  const isHindi = locale === "hi";
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await markNotificationReadAction(id);
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    for (const n of notifications.filter((item) => !item.isRead)) {
      await markNotificationReadAction(n.id);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between border-b border-rule pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-sm text-xs font-medium transition-colors ${
              filter === "all"
                ? "bg-text text-page"
                : "border border-rule text-secondary hover:text-text"
            }`}
          >
            {isHindi ? "सभी" : "All"} ({notifications.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`px-3 py-1 rounded-sm text-xs font-medium transition-colors ${
              filter === "unread"
                ? "bg-text text-page"
                : "border border-rule text-secondary hover:text-text"
            }`}
          >
            {isHindi ? "अपठित" : "Unread"} ({unreadCount})
          </button>
        </div>

        {unreadCount > 0 && (
          <Button
            type="button"
            variant="text"
            size="small"
            onClick={handleMarkAllRead}
            className="text-xs"
          >
            <Check size={12} strokeWidth={1.5} className="mr-1" />
            <span>{isHindi ? "सभी को पढ़ा हुआ चिह्नित करें" : "Mark all as read"}</span>
          </Button>
        )}
      </div>

      {/* Notifications Feed */}
      {filtered.length === 0 ? (
        <div className="p-8 border border-dashed border-rule rounded-sm text-center">
          <p className="text-xs text-secondary">
            {isHindi ? "कोई सूचना नहीं है।" : "No notifications in this view."}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-rule border border-rule rounded-sm bg-page">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                !item.isRead ? "bg-warm/20" : "hover:bg-warm/10"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {!item.isRead && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  )}
                  <h3 className="font-heading text-sm font-medium text-text">
                    {item.title}
                  </h3>
                  <span className="text-[10px] text-secondary font-mono">
                    {new Date(item.createdAt).toLocaleDateString(
                      isHindi ? "hi-IN" : "en-IN",
                      { month: "short", day: "numeric" }
                    )}
                  </span>
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  {item.body}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!item.isRead && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(item.id)}
                    className="text-[11px] text-secondary hover:text-text px-2 py-1 rounded-sm border border-rule"
                  >
                    {isHindi ? "पढ़ा हुआ" : "Mark read"}
                  </button>
                )}

                <Link
                  href={item.linkUrl}
                  onClick={() => handleMarkAsRead(item.id)}
                  className="tap-target px-3 py-1 bg-primary text-white hover:bg-primary-hover rounded-sm text-xs font-medium inline-flex items-center gap-1 transition-colors"
                >
                  <span>{isHindi ? "देखें" : "View"}</span>
                  <ArrowRight size={12} strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
