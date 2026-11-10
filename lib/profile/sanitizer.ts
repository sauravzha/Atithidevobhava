/**
 * Profile Sanitization Engine.
 * Enforces field-level access control, visibility barriers, and privacy invariants.
 * Spec reference: Section 2, 4, 5, 6, and 9 of docs/SPEC.md.
 */

export interface RawLocalProfile {
  id: string;
  userId: string;
  legalFullName: string; // Strictly private
  displayName: string;
  email: string; // Strictly private (revealed only via can_reveal)
  mobile: string; // Strictly private (revealed only via can_reveal)
  stateId: string;
  districtId: string;
  cityId?: string;
  stateName: string;
  districtName: string;
  cityName?: string;
  localityCentroid: string; // Locality or general area
  exactResidentialAddress?: string; // Strictly private
  exactLat?: number; // Strictly private
  exactLng?: number; // Strictly private
  languages: string[];
  interests: string[];
  bio: string;
  meetupPreferences: string[];
  preferredPublicMeetingSpots: string;
  availability: string;
  photoUrl?: string;
  profileVisibility: "public" | "members_only";
  emailVerified: boolean;
  mobileVerified: boolean;
  communityVouched: boolean;
  memberSince: string;
}

export interface SanitizedProfileView {
  id: string;
  displayName: string;
  stateName: string;
  districtName: string;
  cityName?: string;
  generalArea: string;
  languages: string[];
  interests: string[];
  bio: string;
  meetupPreferences: string[];
  preferredPublicMeetingSpots: string;
  availability: string;
  photoUrl?: string;
  isRestricted: boolean; // True if members_only and viewer is anonymous
  verification: {
    emailVerified: boolean;
    mobileVerified: boolean;
    communityVouched: boolean;
  };
  memberSince: string;
}

/**
 * Sanitize a local profile according to the viewer's authentication state.
 *
 * Rules:
 * 1. Legal full name is stripped.
 * 2. Mobile, email, and exact residential address are stripped.
 * 3. Exact GPS coordinates are stripped.
 * 4. If visibility is 'members_only' and viewer is anonymous, return restricted state.
 */
export function sanitizeLocalProfile(
  raw: RawLocalProfile,
  viewerId: string | null | undefined
): SanitizedProfileView {
  const isAnonymous = !viewerId;
  const isMembersOnly = raw.profileVisibility === "members_only";

  // If profile is members-only and viewer is not logged in, return restricted barrier
  if (isMembersOnly && isAnonymous) {
    return {
      id: raw.id,
      displayName: raw.displayName,
      stateName: raw.stateName,
      districtName: raw.districtName,
      cityName: raw.cityName,
      generalArea: raw.localityCentroid,
      languages: [], // Concealed until sign-in
      interests: [], // Concealed until sign-in
      bio: "This profile is visible to registered members only. Please sign in or join to view.",
      meetupPreferences: [],
      preferredPublicMeetingSpots: "Available to registered members.",
      availability: "Available to registered members.",
      photoUrl: undefined,
      isRestricted: true,
      verification: {
        emailVerified: raw.emailVerified,
        mobileVerified: raw.mobileVerified,
        communityVouched: raw.communityVouched,
      },
      memberSince: raw.memberSince,
    };
  }

  // Full sanitized view for members or public profiles
  return {
    id: raw.id,
    displayName: raw.displayName,
    stateName: raw.stateName,
    districtName: raw.districtName,
    cityName: raw.cityName,
    generalArea: raw.localityCentroid,
    languages: raw.languages,
    interests: raw.interests,
    bio: raw.bio,
    meetupPreferences: raw.meetupPreferences,
    preferredPublicMeetingSpots: raw.preferredPublicMeetingSpots,
    availability: raw.availability,
    photoUrl: raw.photoUrl,
    isRestricted: false,
    verification: {
      emailVerified: raw.emailVerified,
      mobileVerified: raw.mobileVerified,
      communityVouched: raw.communityVouched,
    },
    memberSince: raw.memberSince,
  };
}
