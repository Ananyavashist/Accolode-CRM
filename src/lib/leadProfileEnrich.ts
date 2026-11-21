import type { Lead } from "@/types";
import { isShiftHonaRoutedLead } from "@/lib/brokerRouting";

export function defaultMustHaves(lead: Lead): { label: string; value: string }[] {
  return [
    {
      label: "Furnishing",
      value: lead.dealType === "Rent" ? "Semi furnished or fully furnished" : "Ready to move",
    },
    { label: "Parking", value: "At least one covered slot" },
    { label: "Commute", value: `Near ${lead.location.split(",")[0]}` },
    { label: "Move in", value: lead.preference.timeline },
  ];
}

/** Details copy: no hyphen or dash characters; single flowing paragraph. */
export function sanitizeDetailParagraph(text: string): string {
  return text
    .replace(/\n+/g, " ")
    .replace(/-/g, " ")
    .replace(/—/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

export function defaultInquiryDetails(lead: Lead): string {
  const formNote = lead.inquiryFilled
    ? "The inquiry form is complete."
    : "They are still completing the inquiry form.";
  return sanitizeDetailParagraph(
    `Focused on ${lead.location} for ${lead.bhk} with budget ${lead.budget}, prioritising commute and daily convenience over premium extras. ` +
      `They are looking for ${lead.preference.propertyType} and hope to move within ${lead.preference.timeline}. ` +
      `${formNote} ` +
      `They have viewed ${lead.viewedProperties} listings recently and want a shortlist that matches their must haves before scheduling site visits.`,
  );
}

function sentenceCount(text: string): number {
  return text.split(/(?<=[.!?])\s+/).filter((s) => s.length > 0).length;
}

/** One paragraph (about three to four wrapped lines) for every broker queue lead. */
export function resolveInquiryDetails(lead: Lead): string {
  const raw = sanitizeDetailParagraph(lead.inquiryDetails ?? "");
  if (raw && sentenceCount(raw) >= 3) {
    return raw;
  }
  return defaultInquiryDetails(lead);
}

/** Ensure broker queue leads share the same detail panel shape. */
export function enrichLeadProfile(lead: Lead): Lead {
  if (!isShiftHonaRoutedLead(lead)) return lead;

  return {
    ...lead,
    inquiryDetails: resolveInquiryDetails(lead),
    mustHaves: lead.mustHaves?.length ? lead.mustHaves : defaultMustHaves(lead),
  };
}