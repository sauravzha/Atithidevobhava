/**
 * Contact Submissions Database Service - Atithi Devo Bhava.
 * Captures visitor inquiries, feedback, and support tickets in PostgreSQL.
 */

import { getSupabaseAdmin } from "@/src/lib/supabase";

export interface ContactSubmissionInput {
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactSubmissionRecord {
  id: string;
  user_id?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: "unread" | "in_progress" | "resolved" | "archived";
  resolution_notes?: string | null;
  created_at: string;
}

/**
 * Submit contact form inquiry to Supabase.
 */
export async function submitContactInquiry(
  input: ContactSubmissionInput
): Promise<{ success: boolean; submissionId?: string; error?: string }> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("contact_submissions")
    .insert({
      user_id: input.userId || null,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim() || null,
      subject: input.subject.trim(),
      message: input.message.trim(),
      status: "unread",
    })
    .select("id")
    .single();

  if (error || !data) {
    return { success: false, error: error?.message || "Failed to submit inquiry" };
  }

  return { success: true, submissionId: data.id };
}

/**
 * Fetch all contact submissions for admin review.
 */
export async function getContactSubmissions(
  statusFilter?: string
): Promise<ContactSubmissionRecord[]> {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data as ContactSubmissionRecord[];
}

/**
 * Resolve contact submission with notes.
 */
export async function resolveContactSubmission(
  submissionId: string,
  resolvedBy: string,
  resolutionNotes: string
): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("contact_submissions")
    .update({
      status: "resolved",
      resolved_by: resolvedBy,
      resolution_notes: resolutionNotes,
    })
    .eq("id", submissionId);

  return !error;
}

