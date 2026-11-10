"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { StatusLabel } from "@/components/ui/status-label";
import {
  FileText,
  ExternalLink,
  Plus,
  Lock,
} from "lucide-react";
import {
  saveHostComplianceChecklistAction,
  recordGuestComplianceEntryAction,
} from "@/app/actions/accommodation";

interface ComplianceRecord {
  checklist_completed: boolean;
  foreigner_duty_acknowledged: boolean;
  state_tourism_registration_number: string | null;
}

interface GuestRecord {
  id: string;
  guest_full_name_encrypted: string;
  nationality: string;
  arrival_date: string;
  departure_date: string;
  form_submitted: boolean;
  submission_date: string | null;
  submission_reference: string | null;
  created_at: string;
}

interface Props {
  compliance: ComplianceRecord | null;
  guestRecords: GuestRecord[];
  isHindi: boolean;
  userId: string;
}

export function HostComplianceClient({
  compliance,
  guestRecords,
  isHindi,
}: Props) {
  const router = useRouter();

  // Checklist state
  const [dutyAcknowledged, setDutyAcknowledged] = useState(
    compliance?.foreigner_duty_acknowledged || false
  );
  const [tourismRegNumber, setTourismRegNumber] = useState(
    compliance?.state_tourism_registration_number || ""
  );
  const [isSavingChecklist, setIsSavingChecklist] = useState(false);
  const [checklistSaved, setChecklistSaved] = useState(
    compliance?.foreigner_duty_acknowledged || false
  );

  // New guest entry form state
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [nationality, setNationality] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submissionReference, setSubmissionReference] = useState("");
  const [isSubmittingGuest, setIsSubmittingGuest] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSaveChecklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dutyAcknowledged) return;

    setIsSavingChecklist(true);
    setErrorMessage(null);

    try {
      const res = await saveHostComplianceChecklistAction({
        foreignerDutyAcknowledged: true,
        checklistCompleted: true,
        stateTourismRegistrationNumber: tourismRegNumber.trim() || undefined,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to save compliance checklist");
        setIsSavingChecklist(false);
        return;
      }

      setChecklistSaved(true);
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error saving checklist");
    } finally {
      setIsSavingChecklist(false);
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!guestName || !nationality || !arrivalDate || !departureDate) {
      setErrorMessage(isHindi ? "कृपया सभी आवश्यक विवरण भरें" : "Please fill all required guest fields");
      return;
    }

    setIsSubmittingGuest(true);

    try {
      const res = await recordGuestComplianceEntryAction({
        guestFullName: guestName.trim(),
        nationality: nationality.trim(),
        arrivalDate,
        departureDate,
        formSubmitted,
        submissionDate: formSubmitted ? new Date().toISOString().split("T")[0] : undefined,
        submissionReference: submissionReference.trim() || undefined,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to record guest entry");
        setIsSubmittingGuest(false);
        return;
      }

      setIsAddingGuest(false);
      setGuestName("");
      setNationality("");
      setArrivalDate("");
      setDepartureDate("");
      setFormSubmitted(false);
      setSubmissionReference("");
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error recording guest");
    } finally {
      setIsSubmittingGuest(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Official Legal Disclaimer per Section 8 */}
      <Notice variant="warning">
        <strong className="font-semibold block mb-1">
          {isHindi ? "वैधानिक अस्वीकरण और दायित्व" : "Statutory Disclaimer & Host Responsibility"}
        </strong>
        <p className="text-xs leading-relaxed">
          {isHindi
            ? "अतिथि देवो भव (Atithi Devo Bhava) कोई सरकारी रिपोर्टिंग एजेंसी नहीं है और सीधे सरकारी पोर्टलों पर रिपोर्ट जमा नहीं करता। भारतीय विदेशी पंजीकरण अधिनियम के अंतर्गत, विदेशी नागरिकों के आगमन की सूचना 24 घंटे के भीतर सीधे गृह मंत्रालय के e-FRRO पोर्टल (indianfrro.gov.in) पर दर्ज करना मेजबान का व्यक्तिगत वैधानिक दायित्व है।"
            : "Atithi Devo Bhava is not an official government reporting agency and does not submit filings directly to government systems. Under the Foreigners Act and Registration of Foreigners Rules, hosts must file Form C / Form III directly on the Ministry of Home Affairs e-FRRO portal (indianfrro.gov.in) within 24 hours of guest arrival."}
        </p>
      </Notice>

      {errorMessage && (
        <Notice variant="error">
          <p className="text-xs">{errorMessage}</p>
        </Notice>
      )}

      {/* Section 1: Host Statutory Checklist */}
      <section className="p-6 border border-rule rounded-sm bg-paper space-y-4">
        <div className="flex items-center justify-between border-b border-rule pb-3">
          <div className="flex items-center gap-2">
            <FileText size={16} strokeWidth={1.5} className="text-forest" />
            <h2 className="font-heading text-lg text-text">
              {isHindi ? "1. मेजबान वैधानिक दायित्व घोषणा" : "1. Statutory Host Declaration"}
            </h2>
          </div>
          <StatusLabel
            status={checklistSaved ? "Completed" : "Pending Acknowledgment"}
            variant={checklistSaved ? "success" : "warning"}
          />
        </div>

        <form onSubmit={handleSaveChecklist} className="space-y-4 text-xs">
          <div className="p-4 bg-warm border border-rule rounded-sm space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={dutyAcknowledged}
                onChange={(e) => setDutyAcknowledged(e.target.checked)}
                className="mt-0.5 text-forest focus:ring-forest"
              />
              <span className="text-text leading-relaxed font-medium">
                {isHindi
                  ? "मैं स्वीकार करता/करती हूँ कि किसी भी विदेशी नागरिक (गैर-भारतीय पासपोर्ट धारक) को ठहराने पर आगमन के 24 घंटे के भीतर e-FRRO पोर्टल पर फॉर्म-सी / फॉर्म III दर्ज करना मेरा अनिवार्य दायित्व है।"
                  : "I acknowledge my statutory duty under Indian law to file Form C / Form III on the official e-FRRO portal within 24 hours of any foreign guest arrival."}
              </span>
            </label>
          </div>

          <div>
            <label className="block font-medium text-text mb-1">
              {isHindi
                ? "राज्य पर्यटन विभाग पंजीकरण संख्या (सशुल्क होमस्टे हेतु):"
                : "State Tourism Homestay Registration Number (if applicable):"}
            </label>
            <input
              type="text"
              placeholder="e.g. BHR-TOU-HST-2026-0042"
              value={tourismRegNumber}
              onChange={(e) => setTourismRegNumber(e.target.value)}
              className="w-full max-w-md px-3 py-2 text-xs border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <a
              href="https://indianfrro.gov.in/frro/FormC"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest hover:underline flex items-center gap-1 font-mono text-[11px]"
            >
              <span>{isHindi ? "आधिकारिक e-FRRO पोर्टल खोलें" : "Open Official e-FRRO Portal"}</span>
              <ExternalLink size={12} strokeWidth={1.5} />
            </a>

            <Button
              type="submit"
              variant="primary"
              size="small"
              disabled={isSavingChecklist || !dutyAcknowledged}
            >
              {isSavingChecklist
                ? isHindi
                  ? "सहेजा जा रहा है..."
                  : "Saving..."
                : isHindi
                ? "घोषणा सहेजें"
                : "Save Declaration"}
            </Button>
          </div>
        </form>
      </section>

      {/* Section 2: Minimal DPDP Foreign Guest Registry */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3">
          <div>
            <h2 className="font-heading text-lg text-text">
              {isHindi ? "2. विदेशी नागरिक उपस्थिति पंजी" : "2. Foreign Guest Attendance Log"}
            </h2>
            <p className="text-[11px] text-secondary">
              {isHindi
                ? "डीपीडीपी अधिनियम 2023 के अनुपालन में यहाँ केवल आवश्यक वैधानिक न्यूनतम विवरण ही रखे जाते हैं। पासपोर्ट नंबर कभी संग्रहित नहीं होते।"
                : "Minimal DPDP Act 2023 registry. Zero collection of passport scans or visa numbers."}
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => setIsAddingGuest(!isAddingGuest)}
          >
            <Plus size={13} strokeWidth={1.5} className="mr-1" />
            {isHindi ? "अतिथि जोड़ें" : "Log Foreign Guest"}
          </Button>
        </div>

        {/* Add Guest Form Drawer */}
        {isAddingGuest && (
          <form
            onSubmit={handleAddGuest}
            className="p-5 border border-forest/40 bg-warm/30 rounded-sm space-y-4 text-xs"
          >
            <div className="flex items-center gap-1.5 font-medium text-text">
              <Lock size={13} strokeWidth={1.5} className="text-forest" />
              <span>{isHindi ? "नया विदेशी अतिथि प्रविष्टि" : "New Foreign Guest Record"}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-secondary mb-1">
                  {isHindi ? "अतिथि का पूरा नाम" : "Guest Full Legal Name"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Johnathan Miller"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block text-secondary mb-1">
                  {isHindi ? "नागरिकता / देश" : "Nationality / Country"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. United Kingdom"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block text-secondary mb-1">
                  {isHindi ? "आगमन तिथि" : "Arrival Date"}
                </label>
                <input
                  type="date"
                  required
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block text-secondary mb-1">
                  {isHindi ? "प्रस्थान तिथि" : "Departure Date"}
                </label>
                <input
                  type="date"
                  required
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-rule space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formSubmitted}
                  onChange={(e) => setFormSubmitted(e.target.checked)}
                  className="text-forest focus:ring-forest"
                />
                <span className="font-medium text-text">
                  {isHindi
                    ? "मैंने e-FRRO पोर्टल पर फॉर्म-सी / फॉर्म III जमा कर दिया है"
                    : "I have filed Form C / Form III on the official e-FRRO portal"}
                </span>
              </label>

              {formSubmitted && (
                <div className="pt-1">
                  <label className="block text-secondary mb-1">
                    {isHindi
                      ? "e-FRRO संदर्भ / पावती संख्या:"
                      : "e-FRRO Application / Acknowledgment Number:"}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FRRO-DL-2026-98124"
                    value={submissionReference}
                    onChange={(e) => setSubmissionReference(e.target.value)}
                    className="w-full max-w-sm px-2.5 py-1.5 border border-rule rounded-sm bg-paper text-text focus:outline-none focus:border-forest"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-rule">
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={() => setIsAddingGuest(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="small"
                disabled={isSubmittingGuest}
              >
                {isSubmittingGuest ? "Saving..." : "Record Guest Entry"}
              </Button>
            </div>
          </form>
        )}

        {/* Existing Guest Table */}
        <div className="border border-rule rounded-sm bg-paper overflow-x-auto">
          {guestRecords.length === 0 ? (
            <div className="p-8 text-center text-xs text-secondary space-y-1">
              <p>{isHindi ? "कोई विदेशी अतिथि प्रविष्टि दर्ज नहीं है।" : "No foreign guest records logged yet."}</p>
              <p className="text-[11px]">
                {isHindi
                  ? "जब भी कोई अंतरराष्ट्रीय अतिथि ठहरने आए, 24 घंटे के भीतर उनका विवरण यहाँ दर्ज करें।"
                  : "When hosting international visitors, record their dates here to track statutory compliance."}
              </p>
            </div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead className="bg-warm/40 border-b border-rule font-medium text-secondary">
                <tr>
                  <th className="py-2.5 px-4">{isHindi ? "अतिथि का नाम" : "Guest Name"}</th>
                  <th className="py-2.5 px-3">{isHindi ? "नागरिकता" : "Nationality"}</th>
                  <th className="py-2.5 px-3">{isHindi ? "आगमन - प्रस्थान" : "Stay Dates"}</th>
                  <th className="py-2.5 px-3">{isHindi ? "e-FRRO स्थिति" : "e-FRRO Filing"}</th>
                  <th className="py-2.5 px-4">{isHindi ? "संदर्भ संख्या" : "Reference"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {guestRecords.map((g) => (
                  <tr key={g.id} className="hover:bg-warm/10">
                    <td className="py-2.5 px-4 font-medium text-text">
                      {g.guest_full_name_encrypted}
                    </td>
                    <td className="py-2.5 px-3 text-secondary">{g.nationality}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-secondary">
                      {g.arrival_date} &rarr; {g.departure_date}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusLabel
                        status={g.form_submitted ? "Filed" : "Pending 24h"}
                        variant={g.form_submitted ? "success" : "warning"}
                      />
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-secondary">
                      {g.submission_reference || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
