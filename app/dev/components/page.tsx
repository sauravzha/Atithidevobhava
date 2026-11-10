"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bi,
  Button,
  Field,
  OtpInput,
  Select,
  RuledTable,
  TableRow,
  TableCell,
  ListingRow,
  PersonRow,
  StatusLabel,
  VerificationLabel,
  Notice,
  ToastProvider,
  useToast,
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  CalendarRange,
  PhotoUploader,
  MapView,
  ConsentBanner,
  Figure,
} from "@/components/ui";
import { getFullContrastAudit } from "@/lib/contrast";

function ToastDemo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        onClick={() => toast({ message: "Request submitted successfully.", variant: "success" })}
      >
        Trigger Success Toast
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ message: "Connection request declined by local member.", variant: "default" })}
      >
        Trigger Default Toast
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ message: "Unable to send message. Please retry.", variant: "error" })}
      >
        Trigger Error Toast
      </Button>
    </div>
  );
}

export default function ComponentsDevPage() {
  const [isDark, setIsDark] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [selectValue, setSelectValue] = useState("darbhanga");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  );

  const contrastResults = getFullContrastAudit();

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <ToastProvider>
      <div className="site-container py-12">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-8 border-b border-rule gap-4">
          <div>
            <Link
              href="/"
              className="text-xs font-medium text-secondary hover:text-text transition-colors duration-[120ms] mb-2 inline-block"
            >
              ← Back to Home / मुख्य पृष्ठ पर वापस जाएं
            </Link>
            <Bi
              hindi="डिजाइन प्रणाली और घटक सूची"
              english="Design System Components & WCAG AA Contrast Audit (/dev/components)"
              as="h1"
            />
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="tap-target px-3 py-1.5 border border-rule hover:border-secondary rounded-sm text-xs font-medium text-text bg-surface transition-colors duration-[120ms]"
          >
            {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
        </header>

        {/* Section 0: Automated WCAG AA Contrast Table */}
        <section className="mb-16">
          <div className="mb-4">
            <h2 className="font-heading font-medium text-2xl text-text mb-1">
              Automated WCAG 2.2 AA Contrast Compliance Table
            </h2>
            <p className="font-body text-xs text-secondary max-w-prose">
              Mathematical contrast ratio evaluation according to W3C relative luminance standards.
              Minimum requirements: 4.5:1 for body text, 3.0:1 for large text (18pt / 14pt bold) and user interface borders.
            </p>
          </div>

          <div className="overflow-x-auto border border-rule rounded-sm bg-surface">
            <table className="w-full text-left font-body text-xs">
              <thead className="border-b border-rule bg-page text-secondary uppercase font-medium">
                <tr>
                  <th className="p-3">Color Pair Name</th>
                  <th className="p-3">Foreground</th>
                  <th className="p-3">Background</th>
                  <th className="p-3">Mode</th>
                  <th className="p-3">Contrast Ratio</th>
                  <th className="p-3">Normal Text (4.5:1)</th>
                  <th className="p-3">Large Text / UI (3.0:1)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {contrastResults.map((r, idx) => (
                  <tr key={idx} className="hover:bg-warm-grey/30 transition-colors duration-[120ms]">
                    <td className="p-3 font-medium text-text">{r.pairName}</td>
                    <td className="p-3 font-mono">
                      <span
                        className="inline-block w-3 h-3 mr-1.5 border border-rule rounded-sm align-middle"
                        style={{ backgroundColor: r.foregroundHex }}
                      />
                      {r.foregroundName} ({r.foregroundHex})
                    </td>
                    <td className="p-3 font-mono">
                      <span
                        className="inline-block w-3 h-3 mr-1.5 border border-rule rounded-sm align-middle"
                        style={{ backgroundColor: r.backgroundHex }}
                      />
                      {r.backgroundName} ({r.backgroundHex})
                    </td>
                    <td className="p-3 capitalize">{r.mode}</td>
                    <td className="p-3 font-mono font-medium">{r.ratioFormatted}</td>
                    <td className="p-3">
                      {r.normalTextPass ? (
                        <span className="border border-forest text-forest px-1.5 py-0.5 rounded-sm font-medium">
                          Pass
                        </span>
                      ) : (
                        <span className="border border-secondary text-secondary px-1.5 py-0.5 rounded-sm">
                          N/A (UI / Large only)
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {r.uiComponentPass ? (
                        <span className="border border-forest text-forest px-1.5 py-0.5 rounded-sm font-medium">
                          Pass
                        </span>
                      ) : (
                        <span className="border border-error text-error px-1.5 py-0.5 rounded-sm font-medium">
                          Fail
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 1: Bilingual Heading (Bi) */}
        <section className="mb-12 ruled-row">
          <h2 className="font-heading font-medium text-lg text-text mb-4">
            1. Bilingual Heading (Bi)
          </h2>
          <div className="space-y-4 border border-rule p-6 bg-surface rounded-sm">
            <Bi
              hindi="भारत को लोगों के साथ महसूस कीजिए"
              english="Experience India through its people"
              as="h1"
            />
            <Bi
              hindi="स्थानीय संस्कृति और परंपराएं"
              english="Local culture and living traditions"
              as="h2"
            />
            <Bi
              hindi="मिलने का सुरक्षित सार्वजनिक स्थान"
              english="Designated safe public meeting point"
              as="h3"
            />
          </div>
        </section>

        {/* Section 2: Buttons */}
        <section className="mb-12 ruled-row">
          <h2 className="font-heading font-medium text-lg text-text mb-4">
            2. Buttons (44px Minimum Tap Targets)
          </h2>
          <div className="flex flex-wrap items-center gap-4 border border-rule p-6 bg-surface rounded-sm">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="text">Text Link Button</Button>
            <Button variant="primary" loading>Loading Button</Button>
            <Button variant="secondary" disabled>Disabled Button</Button>
          </div>
        </section>

        {/* Section 3: Form Fields and Input States */}
        <section className="mb-12 ruled-row">
          <h2 className="font-heading font-medium text-lg text-text mb-4">
            3. Form Fields & Validation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border border-rule p-6 bg-surface rounded-sm">
            <Field
              label="Full legal name"
              htmlFor="field-name"
              helperText="Kept private. Used strictly for identity verification."
              required
            >
              <input
                id="field-name"
                type="text"
                placeholder="Rameshwar Jha"
                className="h-[44px] w-full px-4 text-sm bg-surface text-text border border-rule rounded-sm focus:border-forest focus:outline-none"
              />
            </Field>

            <Field
              label="Email address"
              htmlFor="field-email"
              error="A valid email address is required to receive OTP."
              required
            >
              <input
                id="field-email"
                type="email"
                defaultValue="invalid-email"
                className="h-[44px] w-full px-4 text-sm bg-surface text-text border border-error rounded-sm focus:border-error focus:outline-none"
              />
            </Field>
          </div>
        </section>

        {/* Section 4: 6-Digit Accessible OTP Input */}
        <section className="mb-12 ruled-row">
          <h2 className="font-heading font-medium text-lg text-text mb-4">
            4. 6-Digit OTP Input
          </h2>
          <div className="space-y-4 border border-rule p-6 bg-surface rounded-sm">
            <OtpInput
              onComplete={(code) => setOtpValue(code)}
            />
            {otpValue && (
              <p className="text-xs text-secondary font-mono">
                Captured OTP code: {otpValue}
              </p>
            )}
          </div>
        </section>

        {/* Section 5: Searchable Select */}
        <section className="mb-12 ruled-row">
          <h2 className="font-heading font-medium text-lg text-text mb-4">
            5. Searchable Select (Accessible Radix Primitive)
          </h2>
          <div className="max-w-md border border-rule p-6 bg-surface rounded-sm">
            <Select
              label="Select district"
              value={selectValue}
              onValueChange={setSelectValue}
              searchable
              options={[
                { value: "darbhanga", label: "Darbhanga (दरभंगा, बिहार)" },
                { value: "madhubani", label: "Madhubani (मधुबनी, बिहार)" },
                { value: "varanasi", label: "Varanasi (वाराणसी, उत्तर प्रदेश)" },
                { value: "jaipur", label: "Jaipur (जयपुर, राजस्थान)" },
                { value: "kochi", label: "Kochi (कोच्चि, केरल)" },
                { value: "shillong", label: "Shillong (शिलांग, मेघालय)" },
              ]}
            />
          </div>
        </section>

        {/* Section 6: Status Labels & Verification Badges */}
        <section className="mb-12 ruled-row">
          <h2 className="font-heading font-medium text-lg text-text mb-4">
            6. Status Labels & Verification Badges (Bordered text, no colored pills)
          </h2>
          <div className="space-y-4 border border-rule p-6 bg-surface rounded-sm">
            <div className="flex flex-wrap gap-2">
              <StatusLabel status="Pending Review" variant="default" />
              <StatusLabel status="Accepted" variant="success" />
              <StatusLabel status="Payment Pending" variant="warning" />
              <StatusLabel status="Declined" variant="error" />
              <StatusLabel status="Scheduled" variant="info" />
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <VerificationLabel
                label="Email verified"
                date="01 Nov 2026"
              />
              <VerificationLabel
                label="Mobile verified"
                date="03 Nov 2026"
              />
              <VerificationLabel
                label="Identity checked by our team"
                date="05 Nov 2026"
                showDisclaimer
              />
            </div>
          </div>
        </section>

        {/* Section 7: Left-Bordered Notices */}
        <section className="mb-12 ruled-row">
          <h2 className="font-heading font-medium text-lg text-text mb-4">
            7. Notice Component (Left 2px Rule)
          </h2>
          <div className="space-y-3 border border-rule p-6 bg-surface rounded-sm">
            <Notice variant="default">
              Initial meetups must always take place in designated public locations such as cafes, historic squares, or town centers.
            </Notice>
            <Notice variant="warning">
              Contact details are protected and will only be shared when both participants have explicitly consented.
            </Notice>
            <Notice variant="error">
              Two urgent reports received from different members will temporarily hide a profile pending moderation review.
            </Notice>
          </div>
        </section>

        {/* Section 8: Toast Notifications & Modal Dialog */}
        <section className="mb-12 ruled-row">
          <h2 className="font-heading font-medium text-lg text-text mb-4">
            8. Interactive Toast Notifications & Modal Dialog
          </h2>
          <div className="flex flex-wrap items-center gap-4 border border-rule p-6 bg-surface rounded-sm">
            <ToastDemo />

            <DialogRoot>
              <DialogTrigger asChild>
                <Button variant="primary">Open Accessible Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Mutual Contact Disclosure Confirmation</DialogTitle>
                <p className="font-body text-sm text-secondary my-4 leading-relaxed">
                  You are about to share your selected contact details with this member.
                  Your phone number and email will remain hidden until the other member also confirms.
                </p>
                <div className="flex justify-end gap-3 mt-6">
                  <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button variant="primary">Confirm Share</Button>
                </div>
              </DialogContent>
            </DialogRoot>
          </div>
        </section>

        {/* Section 9: Ruled Editorial Table */}
        <section className="mb-12 ruled-row">
          <h2 className="font-heading font-medium text-lg text-text mb-4">
            9. Ruled Editorial Table
          </h2>
          <div className="border border-rule rounded-sm bg-surface overflow-hidden">
            <RuledTable
              headers={["District", "State", "Active Hosts", "Cultural Focus"]}
              caption="Pilot Region Geography Inventory"
            >
              <TableRow>
                <TableCell>Darbhanga (दरभंगा)</TableCell>
                <TableCell>Bihar</TableCell>
                <TableCell>18</TableCell>
                <TableCell>Pond heritage, Maithili music, historic palaces</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Madhubani (मधुबनी)</TableCell>
                <TableCell>Bihar</TableCell>
                <TableCell>24</TableCell>
                <TableCell>Mithila painting, village craft, handloom</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Varanasi (वाराणसी)</TableCell>
                <TableCell>Uttar Pradesh</TableCell>
                <TableCell>12</TableCell>
                <TableCell>Ghat walks, silk weaving, classical morning music</TableCell>
              </TableRow>
            </RuledTable>
          </div>
        </section>

        {/* Section 10: Listing & Person Ruled Rows */}
        <section className="mb-12 ruled-row">
          <h2 className="font-heading font-medium text-lg text-text mb-4">
            10. Editorial Listing & Person Rows (Replacing standard cards)
          </h2>
          <div className="border border-rule rounded-sm bg-surface divide-y divide-rule px-4">
            <ListingRow
              title="Traditional Mithila Kohbar Painting Workshop"
              titleHi="पारंपरिक मिथिला कोहबर चित्रकला कार्यशाला"
              subtitle="Hosted by Vidya Devi and family in Ranti village"
              location="Madhubani, Bihar"
              meta="3 hours · Up to 4 participants"
              href="#listing-demo"
            />

            <PersonRow
              displayName="Anand Kumar Jha"
              location="Darbhanga, Bihar"
              languages={["Maithili", "Hindi", "English"]}
              interests={["Historic architecture", "Local tea culture", "Sanskrit literature"]}
              verified
              href="#person-demo"
            />
          </div>
        </section>

        {/* Section 11: Monday-Start Range Calendar */}
        <section className="mb-12 ruled-row">
          <h2 className="font-heading font-medium text-lg text-text mb-4">
            11. Range Calendar (Monday Start)
          </h2>
          <div className="border border-rule p-6 bg-surface rounded-sm flex flex-col sm:flex-row gap-6 items-start">
            <CalendarRange
              startDate={startDate}
              endDate={endDate}
              onRangeChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
            />
            <div className="space-y-2 text-xs text-secondary font-mono">
              <p>Selected Start Date: {startDate ? startDate.toLocaleDateString() : "None"}</p>
              <p>Selected End Date: {endDate ? endDate.toLocaleDateString() : "None"}</p>
              <p className="text-forest">Starts on Monday per Section 18 specification.</p>
            </div>
          </div>
        </section>

        {/* Section 12: Photo Uploader with EXIF Stripping Notice */}
        <section className="mb-12 ruled-row">
          <h2 className="font-heading font-medium text-lg text-text mb-4">
            12. Photo Uploader (EXIF & GPS Stripping Notice)
          </h2>
          <div className="max-w-md border border-rule p-6 bg-surface rounded-sm">
            <PhotoUploader
              label="Upload profile photograph"
              helperText="JPG, PNG, or WebP. Maximum size 5 MB."
            />
          </div>
        </section>

        {/* Section 13: MapView with Privacy Centroid */}
        <section className="mb-12 ruled-row">
          <h2 className="font-heading font-medium text-lg text-text mb-4">
            13. Approximate MapView (Locality Centroid Snapping)
          </h2>
          <div className="border border-rule p-6 bg-surface rounded-sm max-w-xl">
            <MapView
              locationName="Madhubani Bazaar Public Square"
              district="Madhubani"
              state="Bihar"
              coordinate={{ latitude: 26.35, longitude: 86.07 }}
            />
          </div>
        </section>

        {/* Section 14: Figure with Mandatory Alt, Credit, and License */}
        <section className="mb-12 ruled-row">
          <h2 className="font-heading font-medium text-lg text-text mb-4">
            14. Figure Component (Refuses render without Alt, Credit, Licence)
          </h2>
          <div className="border border-rule p-6 bg-surface rounded-sm max-w-md">
            <Figure
              src="/placeholder-photo.jpg"
              alt="Mithila artist demonstrating natural pigment mixing using local clay"
              credit="Arun Mishra"
              licence="CC BY-NC 4.0"
              caption="Natural pigment mixing in Jitwarpur village, Madhubani district."
            />
          </div>
        </section>

        {/* Section 15: Cookie & Privacy Notice Banner */}
        <section className="ruled-row">
          <h2 className="font-heading font-medium text-lg text-text mb-4">
            15. Privacy & Zero-Tracking Notice Banner
          </h2>
          <div className="border border-rule p-6 bg-surface rounded-sm">
            <ConsentBanner />
            <p className="text-xs text-secondary">
              The privacy banner states zero advertising trackers and zero third-party analytics.
            </p>
          </div>
        </section>
      </div>
    </ToastProvider>
  );
}
