"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Bi } from "@/components/ui/bi";
import { Notice } from "@/components/ui/notice";
import {
  type ConnectionPurpose,
} from "@/lib/validation/connection";
import { createConnectionRequestAction } from "@/app/actions/connections";

interface NewConnectionPageProps {
  searchParams: Promise<{ recipientId?: string }>;
}

export default function NewConnectionPage({ searchParams }: NewConnectionPageProps) {
  const locale = useLocale();
  const router = useRouter();
  const isHindi = locale === "hi";

  const [recipientId, setRecipientId] = useState<string>("loc-br-01");
  const [purpose, setPurpose] = useState<ConnectionPurpose>("tea_or_coffee");
  const [proposedDates, setProposedDates] = useState<string>("");
  const [suggestedPublicPlace, setSuggestedPublicPlace] = useState<string>("");
  const [initialMessage, setInitialMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Read recipientId from searchParams on mount
  React.useEffect(() => {
    searchParams.then((params) => {
      if (params.recipientId) {
        setRecipientId(params.recipientId);
      }
    });
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (initialMessage.trim().length < 50) {
      setErrorMessage(
        isHindi
          ? "संदेश कम से कम 50 अक्षरों का होना चाहिए ताकि मेजबान आपकी रुचि समझ सके।"
          : "Introductory message must be at least 50 characters."
      );
      return;
    }

    if (suggestedPublicPlace.trim().length < 5) {
      setErrorMessage(
        isHindi
          ? "कृपया एक मान्य सार्वजनिक मिलन स्थल का नाम दर्ज करें।"
          : "Please suggest a valid public meeting venue."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const idempotencyKey = "idem_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
      const res = await createConnectionRequestAction({
        recipientId,
        purpose,
        proposedDates,
        suggestedPublicPlace,
        initialMessage,
        idempotencyKey,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Unable to send request.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/connections/${res.data?.connectionId || "conn-demo-01"}`);
    } catch {
      setErrorMessage("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="site-container py-12 max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-xs font-mono tracking-wider uppercase text-secondary mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              {isHindi ? "मुखपृष्ठ" : "Dispatch"}
            </Link>
          </li>
          <li aria-hidden="true" className="text-rule">/</li>
          <li>
            <Link href="/explore/people" className="hover:text-primary transition-colors">
              {isHindi ? "स्थानीय नागरिक" : "Meet a Local"}
            </Link>
          </li>
          <li aria-hidden="true" className="text-rule">/</li>
          <li className="text-text font-medium" aria-current="page">
            {isHindi ? "मुलाकात का अनुरोध" : "New Request"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="border-b border-rule pb-6 mb-8">
        <span className="text-xs font-mono font-semibold tracking-wider uppercase text-terracotta block mb-1">
          {isHindi ? "माध्यम 1: स्थानीय नागरिक से मिलें" : "Product A: Meet a Local"}
        </span>
        <Bi
          hindi="मुलाकात का प्रस्ताव भेजें"
          english="Propose a Public Meetup"
          as="h1"
          className="text-2xl sm:text-3xl font-heading font-medium text-text mb-2"
        />
        <p className="text-xs text-secondary font-heading">
          {isHindi
            ? "यह एक निशुल्क, गैर-व्यावसायिक सांस्कृतिक संवाद है। कोई भुगतान या पर्यटन शुल्क नहीं है।"
            : "This is a free, non-commercial cultural connection. No booking fee or commercial tour charge applies."}
        </p>
      </header>

      {/* Mandatory Public Meeting Rule Notice */}
      <div className="mb-6">
        <Notice variant="default">
          <div className="space-y-1 py-0.5 text-xs">
            <strong className="text-text block font-heading">
              {isHindi ? "अनिवार्य सार्वजनिक स्थल नियम" : "Public Venue Requirement"}
            </strong>
            <p className="text-secondary leading-relaxed font-heading">
              {isHindi
                ? "सभी प्रारंभिक बैठकें खुले और जाने-पहचाने सार्वजनिक स्थानों (जैसे कैफ़े, मुख्य चौराहा, पुस्तकालय परिसर) पर आयोजित की जानी चाहिए। किसी के निजी घर पर मिलना निषिद्ध है।"
                : "Initial encounters must always be conducted in open, visible public areas (campus tea stall, central square, library). Private residences are strictly prohibited for first meetings."}
            </p>
          </div>
        </Notice>
      </div>

      {errorMessage && (
        <div className="mb-6">
          <Notice variant="warning">
            <p className="text-xs">{errorMessage}</p>
          </Notice>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="journal-paper p-6 sm:p-8 border border-rule rounded-sm shadow-xs space-y-6">
        {/* Purpose */}
        <div>
          <label htmlFor="purpose" className="block text-xs font-mono uppercase tracking-wider text-text mb-1.5 font-medium">
            {isHindi ? "मुलाकात का उद्देश्य *" : "Purpose of Meetup *"}
          </label>
          <select
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value as ConnectionPurpose)}
            className="w-full px-3 py-2 border border-rule rounded-xs text-xs font-mono bg-paper text-text focus:outline-hidden focus:border-forest"
          >
            <option value="tea_or_coffee">
              {isHindi ? "चाय या कॉफ़ी पर अनौपचारिक बातचीत" : "Tea or coffee conversation"}
            </option>
            <option value="market_walk">
              {isHindi ? "स्थानीय बाज़ार या हाट की सैर" : "Local market or haat walk"}
            </option>
            <option value="language_exchange">
              {isHindi ? "भाषा और सांस्कृतिक संवाद" : "Language exchange practice"}
            </option>
            <option value="photography_walk">
              {isHindi ? "फोटोग्राफी और स्थापत्य वॉक" : "Photography and architectural walk"}
            </option>
            <option value="local_area_tour">
              {isHindi ? "मोहल्ला वॉक और ऐतिहासिक स्थल दर्शन" : "Neighbourhood exploration"}
            </option>
            <option value="other">
              {isHindi ? "अन्य गैर-व्यावसायिक उद्देश्य" : "Other non-commercial connection"}
            </option>
          </select>
        </div>

        {/* Proposed Dates */}
        <div>
          <label htmlFor="dates" className="block text-xs font-mono uppercase tracking-wider text-text mb-1.5 font-medium">
            {isHindi ? "प्रस्तावित तिथियां और समय *" : "Proposed Dates & Timing *"}
          </label>
          <input
            type="text"
            id="dates"
            value={proposedDates}
            onChange={(e) => setProposedDates(e.target.value)}
            required
            placeholder="e.g. Next Saturday morning, or flexible weekday after 4 PM"
            className="w-full px-3 py-2 border border-rule rounded-xs text-xs font-mono bg-paper text-text focus:outline-hidden focus:border-forest"
          />
        </div>

        {/* Suggested Public Venue */}
        <div>
          <label htmlFor="venue" className="block text-xs font-mono uppercase tracking-wider text-text mb-1.5 font-medium">
            {isHindi ? "सुझावित सार्वजनिक मिलन स्थल *" : "Suggested Public Meeting Venue *"}
          </label>
          <input
            type="text"
            id="venue"
            value={suggestedPublicPlace}
            onChange={(e) => setSuggestedPublicPlace(e.target.value)}
            required
            placeholder="e.g. Town Hall library square, or Central Clock Tower tea café"
            className="w-full px-3 py-2 border border-rule rounded-xs text-xs font-mono bg-paper text-text focus:outline-hidden focus:border-forest"
          />
          <p className="text-[11px] text-secondary mt-1 font-heading">
            {isHindi
              ? "यह एक ऐसा खुला सार्वजनिक स्थान होना चाहिए जहाँ दोनों पक्ष सहजता से मिल सकें।"
              : "Must be a recognized, well-lit public area with open access."}
          </p>
        </div>

        {/* Personal Message with Counter (50 to 600 characters) */}
        <div>
          <div className="flex justify-between items-baseline mb-1.5">
            <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-text font-medium">
              {isHindi ? "परिचयात्मक संदेश (50 - 600 अक्षर) *" : "Introductory Message (50 to 600 chars) *"}
            </label>
            <span
              className={`text-[11px] font-mono ${
                initialMessage.length < 50 || initialMessage.length > 600
                  ? "text-terracotta"
                  : "text-forest font-semibold"
              }`}
            >
              {initialMessage.length} / 50-600 characters
            </span>
          </div>
          <textarea
            id="message"
            rows={5}
            value={initialMessage}
            onChange={(e) => setInitialMessage(e.target.value)}
            required
            placeholder={
              isHindi
                ? "नमस्ते! अपने बारे में बताएं, आप इस शहर में क्यों आ रहे हैं और आप स्थानीय निवासी से क्या सीखना या साझा करना चाहते हैं (कम से कम 50 अक्षर)..."
                : "Introduce yourself politely: explain why you are visiting this region and what cultural interests or conversations you hope to share (minimum 50 characters)..."
            }
            className="w-full px-3 py-2 border border-rule rounded-xs text-xs font-heading bg-paper text-text focus:outline-hidden focus:border-forest"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-rule flex items-center justify-between">
          <Link
            href="/explore/people"
            className="text-xs font-mono uppercase tracking-wider text-secondary hover:text-text"
          >
            &larr; {isHindi ? "रद्द करें" : "Cancel"}
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-primary text-white hover:bg-primary-hover rounded-xs text-xs font-mono uppercase tracking-wider transition-all disabled:opacity-50 tactile-button shadow-xs"
          >
            {isSubmitting
              ? isHindi ? "भेजा जा रहा है..." : "Sending..."
              : isHindi ? "अनुरोध भेजें" : "Send Connection Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
