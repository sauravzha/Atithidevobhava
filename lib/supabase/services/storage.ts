/**
 * Supabase Storage Service - Atithi Devo Bhava.
 * Manages uploads and access policies for:
 *   - listing-images (Public)
 *   - user-avatars (Public)
 *   - host-documents (Private / Restricted)
 */

import { getSupabaseAdmin } from "@/src/lib/supabase";

export type StorageBucket = "listing-images" | "user-avatars" | "host-documents";

/**
 * Upload a file to Supabase Storage.
 */
export async function uploadFile(
  bucket: StorageBucket,
  path: string,
  fileBody: Buffer | Blob | Uint8Array,
  contentType: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, fileBody, {
      contentType,
      upsert: true,
    });

  if (error) {
    return { success: false, error: error.message };
  }

  if (bucket === "host-documents") {
    // Private bucket: do not return public URL
    return { success: true, url: path };
  }

  // Public bucket: return public CDN URL
  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);
  return { success: true, url: publicData.publicUrl };
}

/**
 * Create a signed URL for private host documents (Admin/Owner only).
 */
export async function getPrivateDocumentSignedUrl(
  path: string,
  expiresInSeconds: number = 3600
): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from("host-documents")
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data) return null;
  return data.signedUrl;
}

/**
 * Delete a file from Supabase Storage.
 */
export async function deleteFile(
  bucket: StorageBucket,
  path: string
): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  return !error;
}
