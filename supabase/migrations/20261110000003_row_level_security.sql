-- ==============================================================================
-- Migration: 20261110000003_row_level_security.sql
-- Description: Enable Row Level Security (RLS) on all tables with strict default-deny policies.
-- Spec reference: Section 4, 20 of docs/SPEC.md
-- ==============================================================================

-- 1. HELPER FUNCTIONS FOR SECURITY CHECKS
CREATE OR REPLACE FUNCTION has_user_role(p_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = p_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION has_admin_permission(p_admin_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_permissions
    WHERE user_id = auth.uid()
      AND (admin_role = p_admin_role OR admin_role = 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. ENABLE RLS ON ALL TABLES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE traveller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE localities ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_member_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE host_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_booking_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_exchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE host_compliance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_export_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE deletion_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;

-- 3. POLICIES: USERS AND ROLES
-- Users can read their own account record; Admins can read all users
CREATE POLICY users_select_own ON users
  FOR SELECT USING (auth.uid() = id OR has_admin_permission('moderator'));

CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND is_suspended IS NOT DISTINCT FROM is_suspended);

-- User roles: readable by user, manageable only by super_admin
CREATE POLICY user_roles_select_own ON user_roles
  FOR SELECT USING (auth.uid() = user_id OR has_admin_permission('moderator'));

CREATE POLICY user_roles_admin_manage ON user_roles
  FOR ALL USING (has_admin_permission('super_admin'));

-- Admin permissions: read/manage strictly by super_admin
CREATE POLICY admin_permissions_super_admin ON admin_permissions
  FOR ALL USING (has_admin_permission('super_admin'));

-- Admin audit logs: viewable by super_admin and moderators, inserted by system/admins
CREATE POLICY audit_logs_select ON admin_audit_logs
  FOR SELECT USING (has_admin_permission('moderator'));

CREATE POLICY audit_logs_insert ON admin_audit_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 4. POLICIES: GEOGRAPHY AND TAXONOMY (PUBLIC READ-ONLY)
CREATE POLICY countries_public_read ON countries FOR SELECT USING (TRUE);
CREATE POLICY states_public_read ON states FOR SELECT USING (TRUE);
CREATE POLICY districts_public_read ON districts FOR SELECT USING (TRUE);
CREATE POLICY cities_public_read ON cities FOR SELECT USING (TRUE);
CREATE POLICY localities_public_read ON localities FOR SELECT USING (TRUE);
CREATE POLICY interests_public_read ON interests FOR SELECT USING (TRUE);
CREATE POLICY languages_public_read ON languages FOR SELECT USING (TRUE);

-- 5. POLICIES: PROFILES
CREATE POLICY traveller_profiles_own ON traveller_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY traveller_profiles_read_connected ON traveller_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM connections
      WHERE traveller_id = user_id AND local_member_id = auth.uid()
    ) OR has_admin_permission('moderator')
  );

CREATE POLICY local_member_profiles_select ON local_member_profiles
  FOR SELECT USING (
    visibility = 'public'
    OR (visibility = 'members_only' AND auth.uid() IS NOT NULL)
    OR auth.uid() = user_id
    OR has_admin_permission('moderator')
  );

CREATE POLICY local_member_profiles_own ON local_member_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY host_profiles_own ON host_profiles
  FOR ALL USING (auth.uid() = user_id OR has_admin_permission('moderator'));

CREATE POLICY experience_providers_read ON experience_providers
  FOR SELECT USING (TRUE);

CREATE POLICY experience_providers_own ON experience_providers
  FOR ALL USING (auth.uid() = user_id);

-- User interests and languages
CREATE POLICY user_interests_own ON user_interests
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY user_interests_read ON user_interests
  FOR SELECT USING (TRUE);

CREATE POLICY user_languages_own ON user_languages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY user_languages_read ON user_languages
  FOR SELECT USING (TRUE);

-- 6. POLICIES: EXPERIENCES (PRODUCT B)
CREATE POLICY experiences_select ON experiences
  FOR SELECT USING (
    status = 'published'
    OR auth.uid() = provider_id
    OR has_admin_permission('moderator')
  );

CREATE POLICY experiences_provider_manage ON experiences
  FOR ALL USING (auth.uid() = provider_id);

CREATE POLICY experience_images_select ON experience_images FOR SELECT USING (TRUE);
CREATE POLICY experience_images_manage ON experience_images
  FOR ALL USING (
    EXISTS (SELECT 1 FROM experiences WHERE id = experience_id AND provider_id = auth.uid())
  );

CREATE POLICY experience_schedules_select ON experience_schedules FOR SELECT USING (TRUE);
CREATE POLICY experience_schedules_manage ON experience_schedules
  FOR ALL USING (
    EXISTS (SELECT 1 FROM experiences WHERE id = experience_id AND provider_id = auth.uid())
  );

CREATE POLICY experience_bookings_select ON experience_bookings
  FOR SELECT USING (
    auth.uid() = traveller_id
    OR EXISTS (SELECT 1 FROM experiences WHERE id = experience_id AND provider_id = auth.uid())
    OR has_admin_permission('moderator')
  );

-- 7. POLICIES: ACCOMMODATION (PRODUCT C)
CREATE POLICY accommodation_select ON accommodation_listings
  FOR SELECT USING (
    status = 'approved'
    OR auth.uid() = host_id
    OR has_admin_permission('moderator')
  );

CREATE POLICY accommodation_host_manage ON accommodation_listings
  FOR ALL USING (auth.uid() = host_id);

CREATE POLICY accommodation_availability_select ON accommodation_availability FOR SELECT USING (TRUE);

-- 8. POLICIES: CONNECTIONS (PRODUCT A)
CREATE POLICY connections_select ON connections
  FOR SELECT USING (
    auth.uid() = traveller_id
    OR auth.uid() = local_member_id
    OR has_admin_permission('moderator')
  );

CREATE POLICY connections_insert ON connections
  FOR INSERT WITH CHECK (auth.uid() = traveller_id);

CREATE POLICY connections_update ON connections
  FOR UPDATE USING (
    auth.uid() = traveller_id OR auth.uid() = local_member_id
  );

-- 9. POLICIES: CONVERSATIONS AND MESSAGES
CREATE POLICY conversations_select ON conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = conversations.id AND user_id = auth.uid()
    ) OR has_admin_permission('moderator')
  );

CREATE POLICY conversation_participants_select ON conversation_participants
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = conversation_participants.conversation_id AND cp.user_id = auth.uid()
    ) OR has_admin_permission('moderator')
  );

CREATE POLICY messages_select ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
    ) OR has_admin_permission('moderator')
  );

CREATE POLICY messages_insert ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
    )
  );

-- 10. POLICIES: CONTACT EXCHANGES
CREATE POLICY contact_exchanges_select ON contact_exchanges
  FOR SELECT USING (
    auth.uid() = user_id
    OR (
      connection_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM connections
        WHERE id = connection_id AND (traveller_id = auth.uid() OR local_member_id = auth.uid())
      )
    )
  );

CREATE POLICY contact_exchanges_manage ON contact_exchanges
  FOR ALL USING (auth.uid() = user_id);

-- 11. POLICIES: REVIEWS
CREATE POLICY reviews_select ON reviews
  FOR SELECT USING (
    is_published = TRUE
    OR auth.uid() = reviewer_id
    OR has_admin_permission('moderator')
  );

CREATE POLICY reviews_insert ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- 12. POLICIES: SAFETY, REPORTS, AND BLOCKS
CREATE POLICY reports_insert ON reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY reports_select ON reports
  FOR SELECT USING (
    auth.uid() = reporter_id OR has_admin_permission('moderator')
  );

CREATE POLICY reports_admin_manage ON reports
  FOR ALL USING (has_admin_permission('moderator'));

CREATE POLICY blocked_users_own ON blocked_users
  FOR ALL USING (auth.uid() = blocker_id);

CREATE POLICY notifications_own ON notifications
  FOR ALL USING (auth.uid() = user_id);

-- 13. POLICIES: VERIFICATION RECORDS
-- Only the user can view status; only verification_reviewer and super_admin can read documents/approve
CREATE POLICY verification_records_user_select ON verification_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY verification_records_admin ON verification_records
  FOR ALL USING (has_admin_permission('verification_reviewer'));

-- 14. POLICIES: FINANCIAL AND AUDITING
CREATE POLICY payments_select ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM experience_bookings
      WHERE id = payments.booking_id AND traveller_id = auth.uid()
    ) OR has_admin_permission('finance')
  );

CREATE POLICY ledger_entries_admin ON ledger_entries
  FOR SELECT USING (has_admin_permission('finance'));

CREATE POLICY guest_records_host ON guest_records
  FOR ALL USING (auth.uid() = host_id OR has_admin_permission('moderator'));

CREATE POLICY trip_shares_traveller ON trip_shares
  FOR ALL USING (auth.uid() = traveller_id);

CREATE POLICY check_ins_own ON check_ins
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY consent_records_insert ON consent_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY consent_records_select_own ON consent_records
  FOR SELECT USING (auth.uid() = user_id OR has_admin_permission('moderator'));

CREATE POLICY saved_items_own ON saved_items
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY platform_settings_select ON platform_settings
  FOR SELECT USING (TRUE);

CREATE POLICY platform_settings_super_admin ON platform_settings
  FOR ALL USING (has_admin_permission('super_admin'));
