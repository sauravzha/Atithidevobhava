"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Bi } from "@/components/ui/bi";
import { StatusLabel } from "@/components/ui/status-label";
import {
  listUserConnections,
  type StoredConnection,
} from "@/app/actions/connections";

export default function ConnectionsDashboardPage() {
  const locale = useLocale();
  const isHindi = locale === "hi";

  const [connections, setConnections] = useState<StoredConnection[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "past">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listUserConnections().then((items) => {
      setConnections(items);
      setIsLoading(false);
    });
  }, []);

  const filtered = connections.filter((conn) => {
    if (filter === "pending") return conn.status === "PENDING";
    if (filter === "active") return ["ACCEPTED", "SCHEDULED"].includes(conn.status);
    if (filter === "past")
      return ["COMPLETED", "DECLINED", "CANCELLED", "WITHDRAWN", "EXPIRED"].includes(
        conn.status
      );
    return true;
  });

  return (
    <div className="site-container py-12 max-w-3xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="text-xs font-mono tracking-wider uppercase text-secondary mb-2" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              {isHindi ? "मुखपृष्ठ" : "Dispatch"}
            </Link>
          </li>
          <li aria-hidden="true" className="text-rule">/</li>
          <li className="text-text font-medium" aria-current="page">
            {isHindi ? "मुलाकातें" : "Connections"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-terracotta block mb-1">
            {isHindi ? "माध्यम 1 डैशबोर्ड" : "Product A Dashboard"}
          </span>
          <Bi
            hindi="आपकी मुलाकातें और संवाद"
            english="Your Connections & Meetups"
            as="h1"
            className="text-2xl sm:text-3xl font-heading font-medium text-text mb-2"
          />
          <p className="text-xs text-secondary font-heading">
            {isHindi
              ? "स्थानीय निवासियों के साथ निर्धारित एवं लंबित मुलाकातों का प्रबंधन करें।"
              : "Manage incoming and outgoing Meet a Local requests, schedules, and contact exchanges."}
          </p>
        </div>

        <Link
          href="/explore/people"
          className="px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-xs text-xs font-mono uppercase tracking-wider self-start sm:self-auto transition-all shadow-xs tactile-button"
        >
          {isHindi ? "नए स्थानीय लोग खोजें" : "Find Locals"}
        </Link>
      </header>

      {/* Filters */}
      <div className="neumorph-inset p-1 rounded-sm border border-rule/80 inline-flex flex-wrap gap-1 text-xs">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-xs font-mono uppercase tracking-wider text-[11px] transition-all ${
            filter === "all"
              ? "bg-text text-page font-medium shadow-xs"
              : "text-secondary hover:text-text"
          }`}
        >
          {isHindi ? "सभी मुलाकातें" : "All Requests"} ({connections.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("active")}
          className={`px-3 py-1.5 rounded-xs font-mono uppercase tracking-wider text-[11px] transition-all ${
            filter === "active"
              ? "bg-text text-page font-medium shadow-xs"
              : "text-secondary hover:text-text"
          }`}
        >
          {isHindi ? "सक्रिय (Active)" : "Active / Scheduled"}
        </button>
        <button
          type="button"
          onClick={() => setFilter("pending")}
          className={`px-3 py-1.5 rounded-xs font-mono uppercase tracking-wider text-[11px] transition-all ${
            filter === "pending"
              ? "bg-text text-page font-medium shadow-xs"
              : "text-secondary hover:text-text"
          }`}
        >
          {isHindi ? "लंबित (Pending)" : "Pending"}
        </button>
        <button
          type="button"
          onClick={() => setFilter("past")}
          className={`px-3 py-1.5 rounded-xs font-mono uppercase tracking-wider text-[11px] transition-all ${
            filter === "past"
              ? "bg-text text-page font-medium shadow-xs"
              : "text-secondary hover:text-text"
          }`}
        >
          {isHindi ? "पूर्ववत (Past)" : "Past / Closed"}
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="py-8 text-xs font-mono text-secondary">
          {isHindi ? "लोड हो रहा है..." : "Loading connections..."}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((conn) => (
            <article
              key={conn.id}
              className="journal-paper p-5 border border-rule rounded-sm shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-forest/50 transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-heading text-base font-medium text-text">
                    {conn.travellerName} & {conn.localMemberName}
                  </span>
                  <StatusLabel status={conn.status.toLowerCase() as any} />
                </div>

                <p className="text-xs text-secondary font-mono">
                  <span className="capitalize">{conn.purpose.replace(/_/g, " ")}</span> •{" "}
                  {conn.suggestedPublicPlace}
                </p>

                <p className="text-xs text-secondary/80 font-mono">
                  {isHindi ? "प्रस्तावित: " : "Proposed: "}
                  {conn.proposedDates}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/connections/${conn.id}`}
                  className="px-4 py-2 border border-rule hover:border-forest text-text hover:text-forest bg-surface rounded-xs text-xs font-mono uppercase tracking-wider transition-all tactile-button shadow-xs"
                >
                  {isHindi ? "विवरण देखें" : "View Details"}
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="p-12 border border-dashed border-rule rounded-sm text-center max-w-md mx-auto space-y-3">
          <h3 className="font-heading text-base font-medium text-text">
            {isHindi ? "कोई मुलाकात अनुरोध नहीं मिला" : "No Connections in this Filter"}
          </h3>
          <p className="text-xs text-secondary leading-relaxed">
            {isHindi
              ? "स्थानीय निवासियों से संपर्क करें और चाय या बाज़ार वॉक के लिए अनुरोध भेजें।"
              : "Discover verified local residents in our pilot districts and send your first meetup proposal."}
          </p>
          <Link
            href="/explore/people"
            className="inline-block text-xs text-primary font-medium hover:underline pt-1"
          >
            {isHindi ? "स्थानीय लोग देखें" : "Browse local residents"} →
          </Link>
        </div>
      )}
    </div>
  );
}

