-- VibeQuestGuardians: Schema.sql — consolidated design DDL; domain-specific operations require verified service commands.
-- Target SQL dialect: PostgreSQL 15+ with PostGIS. Environment/provider versions require approval.
-- No live database is claimed. Deployment, provider and final policy choices require separate approval.
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS profiles;
CREATE SCHEMA IF NOT EXISTS social_graph;
CREATE SCHEMA IF NOT EXISTS geo;
CREATE SCHEMA IF NOT EXISTS places;
CREATE SCHEMA IF NOT EXISTS trails;
CREATE SCHEMA IF NOT EXISTS guardians;
CREATE SCHEMA IF NOT EXISTS tours;
CREATE SCHEMA IF NOT EXISTS businesses;
CREATE SCHEMA IF NOT EXISTS activities;
CREATE SCHEMA IF NOT EXISTS events;
CREATE SCHEMA IF NOT EXISTS content;
CREATE SCHEMA IF NOT EXISTS media;
CREATE SCHEMA IF NOT EXISTS messaging;
CREATE SCHEMA IF NOT EXISTS rooms;
CREATE SCHEMA IF NOT EXISTS communities;
CREATE SCHEMA IF NOT EXISTS matching;
CREATE SCHEMA IF NOT EXISTS challenges;
CREATE SCHEMA IF NOT EXISTS recognition;
CREATE SCHEMA IF NOT EXISTS vq;
CREATE SCHEMA IF NOT EXISTS moderation;
CREATE SCHEMA IF NOT EXISTS handshakes;
CREATE SCHEMA IF NOT EXISTS notifications;
CREATE SCHEMA IF NOT EXISTS advertising;
CREATE SCHEMA IF NOT EXISTS subscriptions;
CREATE SCHEMA IF NOT EXISTS marketplace;
CREATE SCHEMA IF NOT EXISTS billing;
CREATE SCHEMA IF NOT EXISTS ticketing;
CREATE SCHEMA IF NOT EXISTS platform;
CREATE TABLE identity.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  disabled_at timestamptz
);
-- Account-facing category is Vibe (default), Pro (individual), or Business (organization operator).
-- Exactly three account categories. Category alone does not confer publishing or service privileges.
CREATE TABLE identity.account_categories (
  user_id uuid PRIMARY KEY REFERENCES identity.users(id),
  display_category text NOT NULL DEFAULT 'vibe' CHECK(display_category IN ('vibe','pro','business')),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE identity.login_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES identity.users(id),
  provider text NOT NULL,
  provider_subject text NOT NULL,
  verified_at timestamptz,
  UNIQUE(provider,provider_subject)
);
CREATE TABLE identity.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES identity.users(id),
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz
);
CREATE TABLE profiles.profiles (
  user_id uuid PRIMARY KEY REFERENCES identity.users(id),
  display_name text NOT NULL,
  bio text,
  avatar_asset_id uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE profiles.preferences (
  user_id uuid PRIMARY KEY REFERENCES identity.users(id),
  language text NOT NULL DEFAULT 'en' CHECK (language IN ('en','fr','ar')),
  privacy jsonb NOT NULL DEFAULT '{}'::jsonb,
  accessibility jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE TABLE social_graph.follows (
  follower_id uuid NOT NULL REFERENCES identity.users(id),
  followed_id uuid NOT NULL REFERENCES identity.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(follower_id,followed_id),
  CHECK(follower_id<>followed_id)
);
CREATE TABLE social_graph.blocks (
  blocker_id uuid NOT NULL REFERENCES identity.users(id),
  blocked_id uuid NOT NULL REFERENCES identity.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(blocker_id,blocked_id),
  CHECK(blocker_id<>blocked_id)
);
CREATE TABLE geo.consents (
  user_id uuid PRIMARY KEY REFERENCES identity.users(id),
  allowed boolean NOT NULL DEFAULT false,
  share_with_contacts boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (allowed OR NOT share_with_contacts)
);
CREATE TABLE geo.positions (
  user_id uuid PRIMARY KEY REFERENCES geo.consents(user_id),
  point geography(Point,4326) NOT NULL,
  accuracy_m numeric(9,2) NOT NULL CHECK(accuracy_m>=0),
  observed_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL,
  CHECK(expires_at>observed_at)
);
CREATE TABLE geo.geofences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES identity.users(id),
  target_user_id uuid NOT NULL REFERENCES identity.users(id),
  label text NOT NULL,
  center geography(Point,4326) NOT NULL,
  radius_m integer NOT NULL CHECK(radius_m BETWEEN 25 AND 50000),
  active boolean NOT NULL DEFAULT true
);
CREATE TABLE places.places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  point geography(Point,4326) NOT NULL,
  address text,
  status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE places.checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id uuid NOT NULL REFERENCES places.places(id),
  user_id uuid NOT NULL REFERENCES identity.users(id),
  evidence_id uuid,
  checked_at timestamptz NOT NULL DEFAULT now(),
  idempotency_key text NOT NULL UNIQUE
);
CREATE TABLE places.validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id uuid NOT NULL REFERENCES places.places(id),
  user_id uuid NOT NULL REFERENCES identity.users(id),
  verdict text NOT NULL CHECK(verdict IN ('yes','no')),
  evidence_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  idempotency_key text NOT NULL UNIQUE
);
CREATE TABLE trails.trails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES identity.users(id),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'draft',
  source_trail_id uuid REFERENCES trails.trails(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK(id IS DISTINCT FROM source_trail_id)
);
CREATE TABLE trails.versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trail_id uuid NOT NULL REFERENCES trails.trails(id),
  revision integer NOT NULL CHECK(revision>0),
  published_at timestamptz,
  UNIQUE(trail_id,revision)
);
CREATE TABLE trails.stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id uuid NOT NULL REFERENCES trails.versions(id),
  sequence_no integer NOT NULL CHECK(sequence_no>0),
  place_id uuid REFERENCES places.places(id),
  custom_name text,
  custom_point geography(Point,4326),
  duration_minutes integer CHECK(duration_minutes>0),
  time_of_day text,
  insider_note text,
  UNIQUE(version_id,sequence_no),
  CHECK((place_id IS NOT NULL) <> (custom_name IS NOT NULL AND custom_point IS NOT NULL))
);
CREATE TABLE guardians.guardians (
  user_id uuid PRIMARY KEY REFERENCES identity.users(id),
  kind text NOT NULL CHECK(kind IN ('legend','pro')),
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','active','suspended','revoked')),
  qualified_at timestamptz,
  selfie_asset_id uuid,
  selfie_captured_at timestamptz
);
CREATE TABLE guardians.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id uuid NOT NULL REFERENCES guardians.guardians(user_id),
  service_type text NOT NULL,
  price_minor bigint CHECK(price_minor>=0),
  currency char(3),
  active boolean NOT NULL DEFAULT true,
  CHECK((price_minor IS NULL AND currency IS NULL) OR (price_minor IS NOT NULL AND currency IS NOT NULL))
);
CREATE TABLE guardians.featured_trails (
  guardian_id uuid NOT NULL REFERENCES guardians.guardians(user_id),
  trail_id uuid NOT NULL REFERENCES trails.trails(id),
  position integer NOT NULL CHECK(position BETWEEN 1 AND 5),
  PRIMARY KEY(guardian_id,trail_id),
  UNIQUE(guardian_id,position)
);
CREATE TABLE tours.tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id uuid NOT NULL REFERENCES guardians.guardians(user_id),
  trail_version_id uuid REFERENCES trails.versions(id),
  title text NOT NULL,
  price_minor bigint NOT NULL CHECK(price_minor>=0),
  currency char(3) NOT NULL,
  status text NOT NULL DEFAULT 'draft'
);
CREATE TABLE tours.slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES tours.tours(id),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  capacity integer NOT NULL CHECK(capacity>0),
  CHECK(ends_at>starts_at)
);
CREATE TABLE tours.requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES identity.users(id),
  guardian_id uuid NOT NULL REFERENCES guardians.guardians(user_id),
  slot_id uuid REFERENCES tours.slots(id),
  source_trail_id uuid REFERENCES trails.trails(id),
  party_size integer NOT NULL DEFAULT 1 CHECK(party_size>0),
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','accepted','declined','cancelled','expired')),
  idempotency_key text NOT NULL UNIQUE,
  accepted_at timestamptz
);
CREATE TABLE businesses.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES identity.users(id),
  name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  UNIQUE(id,owner_id)
);
CREATE TABLE businesses.memberships (
  organization_id uuid NOT NULL REFERENCES businesses.organizations(id),
  user_id uuid NOT NULL REFERENCES identity.users(id),
  role text NOT NULL CHECK(role IN ('owner','manager','member')),
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','active','suspended','revoked')),
  PRIMARY KEY(organization_id,user_id)
);
-- Business claims are reviewable; Business display category never self-certifies a Place.
CREATE TABLE businesses.place_claims (
  organization_id uuid NOT NULL REFERENCES businesses.organizations(id),
  place_id uuid NOT NULL REFERENCES places.places(id),
  claimant_user_id uuid NOT NULL REFERENCES identity.users(id),
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected','revoked')),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES identity.users(id),
  PRIMARY KEY(organization_id,place_id)
);
CREATE UNIQUE INDEX businesses_place_one_active_operator_idx
  ON businesses.place_claims(place_id) WHERE status='approved';
CREATE TABLE activities.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid NOT NULL REFERENCES identity.users(id),
  place_id uuid REFERENCES places.places(id),
  title text NOT NULL,
  starts_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'draft'
);
CREATE TABLE activities.participation (
  activity_id uuid NOT NULL REFERENCES activities.activities(id),
  user_id uuid NOT NULL REFERENCES identity.users(id),
  status text NOT NULL,
  PRIMARY KEY(activity_id,user_id)
);
CREATE TABLE events.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_organizer_id uuid REFERENCES identity.users(id),
  publisher_user_id uuid NOT NULL REFERENCES identity.users(id),
  business_organizer_id uuid REFERENCES businesses.organizations(id),
  place_id uuid REFERENCES places.places(id),
  title text NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  status text NOT NULL DEFAULT 'draft',
  CHECK ((pro_organizer_id IS NOT NULL) <> (business_organizer_id IS NOT NULL)),
  CHECK(ends_at IS NULL OR ends_at>starts_at)
);
CREATE TABLE events.rsvps (
  event_id uuid NOT NULL REFERENCES events.events(id),
  user_id uuid NOT NULL REFERENCES identity.users(id),
  status text NOT NULL,
  PRIMARY KEY(event_id,user_id)
);
CREATE TABLE content.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES identity.users(id),
  kind text NOT NULL CHECK(kind IN ('gossip','vibe','secret')),
  body text,
  expires_at timestamptz,
  status text NOT NULL DEFAULT 'published'
);
CREATE TABLE content.reactions (
  post_id uuid NOT NULL REFERENCES content.posts(id),
  user_id uuid NOT NULL REFERENCES identity.users(id),
  reaction text NOT NULL,
  PRIMARY KEY(post_id,user_id,reaction)
);
CREATE TABLE media.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id uuid NOT NULL REFERENCES identity.users(id),
  kind text NOT NULL CHECK(kind IN ('image','video','audio','document')),
  bucket text NOT NULL,
  object_key text NOT NULL,
  mime_type text NOT NULL,
  bytes bigint NOT NULL CHECK(bytes>0),
  checksum_sha256 text,
  status text NOT NULL DEFAULT 'pending',
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(bucket,object_key)
);
CREATE TABLE media.attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES media.assets(id),
  owning_domain text NOT NULL,
  owning_record_id uuid NOT NULL,
  purpose text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(asset_id,owning_domain,owning_record_id,purpose)
);
CREATE TABLE messaging.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  context_domain text,
  context_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE messaging.members (
  conversation_id uuid NOT NULL REFERENCES messaging.conversations(id),
  user_id uuid NOT NULL REFERENCES identity.users(id),
  PRIMARY KEY(conversation_id,user_id)
);
CREATE TABLE messaging.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES messaging.conversations(id),
  sender_id uuid NOT NULL REFERENCES identity.users(id),
  body text,
  sent_at timestamptz NOT NULL DEFAULT now(),
  idempotency_key text NOT NULL UNIQUE
);
CREATE TABLE rooms.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz
);
CREATE TABLE communities.communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES identity.users(id),
  handle text NOT NULL UNIQUE,
  visibility text NOT NULL CHECK(visibility IN ('public','private'))
);
CREATE TABLE communities.members (
  community_id uuid NOT NULL REFERENCES communities.communities(id),
  user_id uuid NOT NULL REFERENCES identity.users(id),
  role text NOT NULL DEFAULT 'member',
  PRIMARY KEY(community_id,user_id)
);
CREATE TABLE matching.proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES identity.users(id),
  recipient_id uuid NOT NULL REFERENCES identity.users(id),
  kind text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK(sender_id<>recipient_id)
);
CREATE TABLE challenges.challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK(kind IN ('vibecheck','vibeflash')),
  creator_id uuid NOT NULL REFERENCES identity.users(id),
  starts_at timestamptz NOT NULL,
  deadline_at timestamptz NOT NULL,
  CHECK(deadline_at>starts_at)
);
CREATE TABLE challenges.responses (
  challenge_id uuid NOT NULL REFERENCES challenges.challenges(id),
  user_id uuid NOT NULL REFERENCES identity.users(id),
  asset_id uuid REFERENCES media.assets(id),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(challenge_id,user_id)
);
CREATE TABLE recognition.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES identity.users(id),
  badge_key text NOT NULL,
  source_domain text NOT NULL,
  source_id uuid NOT NULL,
  awarded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id,badge_key,source_domain,source_id)
);
CREATE TABLE recognition.guardian_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  handshake_id uuid NOT NULL UNIQUE,
  reviewer_id uuid NOT NULL REFERENCES identity.users(id),
  guardian_id uuid NOT NULL REFERENCES guardians.guardians(user_id),
  sentiment text NOT NULL CHECK(sentiment IN ('good','chill','cool')),
  body varchar(111) NOT NULL
);
CREATE TABLE vq.rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_key text NOT NULL,
  version integer NOT NULL CHECK(version>0),
  amount bigint NOT NULL,
  active boolean NOT NULL DEFAULT false,
  effective_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(source_key,version)
);
CREATE TABLE vq.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES identity.users(id),
  account_type text NOT NULL CHECK(account_type IN ('user','system')),
  CHECK((account_type='user')=(user_id IS NOT NULL))
);
CREATE TABLE vq.journals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_domain text NOT NULL,
  source_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(source_domain,source_key)
);
CREATE TABLE vq.entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_id uuid NOT NULL REFERENCES vq.journals(id),
  account_id uuid NOT NULL REFERENCES vq.accounts(id),
  amount bigint NOT NULL CHECK(amount<>0)
);
CREATE TABLE moderation.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES identity.users(id),
  target_domain text NOT NULL,
  target_id uuid NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'open'
);
CREATE TABLE handshakes.agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL UNIQUE REFERENCES tours.requests(id),
  requester_id uuid NOT NULL REFERENCES identity.users(id),
  guardian_id uuid NOT NULL REFERENCES guardians.guardians(user_id),
  accepted_at timestamptz NOT NULL
);
CREATE TABLE notifications.inbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL REFERENCES identity.users(id),
  event_id uuid NOT NULL,
  template_key text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(recipient_id,event_id,template_key)
);
CREATE TABLE advertising.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES businesses.organizations(id),
  title text NOT NULL,
  status text NOT NULL DEFAULT 'draft'
);
CREATE TABLE advertising.placements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES advertising.campaigns(id),
  surface text NOT NULL CHECK(surface IN ('home','explore','share')),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  CHECK(ends_at>starts_at)
);
CREATE TABLE subscriptions.entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES identity.users(id),
  entitlement_key text NOT NULL,
  starts_at timestamptz NOT NULL,
  expires_at timestamptz,
  source_payment_id uuid
);
CREATE TABLE marketplace.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES identity.users(id),
  listing_kind text NOT NULL CHECK(listing_kind IN ('buy','sell')),
  title text NOT NULL,
  price_minor bigint CHECK(price_minor>=0),
  currency text NOT NULL,
  status text NOT NULL DEFAULT 'active'
);
CREATE TABLE marketplace.deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES marketplace.listings(id),
  counterparty_id uuid NOT NULL REFERENCES identity.users(id),
  status text NOT NULL DEFAULT 'negotiating',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE billing.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payer_id uuid NOT NULL REFERENCES identity.users(id),
  provider text NOT NULL,
  provider_reference text NOT NULL,
  amount_minor bigint NOT NULL CHECK(amount_minor>=0),
  currency char(3) NOT NULL,
  status text NOT NULL,
  UNIQUE(provider,provider_reference)
);
CREATE TABLE ticketing.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issuer_pro_user_id uuid REFERENCES identity.users(id),
  issuer_user_id uuid NOT NULL REFERENCES identity.users(id),
  issuer_business_id uuid REFERENCES businesses.organizations(id),
  event_id uuid REFERENCES events.events(id),
  title text NOT NULL,
  inventory integer NOT NULL CHECK(inventory>=0),
  starts_at timestamptz,
  status text NOT NULL DEFAULT 'draft',
  CHECK ((issuer_pro_user_id IS NOT NULL) <> (issuer_business_id IS NOT NULL))
);
CREATE TABLE ticketing.tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES ticketing.products(id),
  holder_id uuid REFERENCES identity.users(id),
  token_hash text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'issued',
  issued_at timestamptz NOT NULL DEFAULT now(),
  redeemed_at timestamptz
);
CREATE TABLE platform.outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_domain text NOT NULL,
  event_type text NOT NULL,
  aggregate_id uuid NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  delivered_at timestamptz
);
CREATE TABLE platform.inbox (
  consumer_key text NOT NULL,
  event_id uuid NOT NULL REFERENCES platform.outbox(id),
  processed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(consumer_key,event_id)
);
ALTER TABLE profiles.profiles ADD CONSTRAINT profile_avatar_fk FOREIGN KEY (avatar_asset_id) REFERENCES media.assets(id);
ALTER TABLE guardians.guardians ADD CONSTRAINT guardian_selfie_fk FOREIGN KEY (selfie_asset_id) REFERENCES media.assets(id);
ALTER TABLE recognition.guardian_reviews ADD CONSTRAINT guardian_review_handshake_fk FOREIGN KEY (handshake_id) REFERENCES handshakes.agreements(id);
ALTER TABLE rooms.sessions ADD CONSTRAINT room_community_fk FOREIGN KEY (community_id) REFERENCES communities.communities(id);

-- Expanded, individually owned business record families; all reference canonical identity and media IDs.
CREATE TABLE identity.recovery_tokens (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES identity.users(id),
 token_hash text NOT NULL UNIQUE, purpose text NOT NULL CHECK(purpose IN ('verify_email','reset_password','link_account')),
 expires_at timestamptz NOT NULL, consumed_at timestamptz
);
CREATE TABLE identity.account_audit (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES identity.users(id),
 actor_user_id uuid REFERENCES identity.users(id), action text NOT NULL, occurred_at timestamptz NOT NULL DEFAULT now(), details jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE TABLE profiles.professional_service_profiles (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), pro_user_id uuid NOT NULL REFERENCES identity.users(id),
 title text NOT NULL, service_category text NOT NULL CHECK(length(btrim(service_category)) BETWEEN 2 AND 80),
 description text, status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','suspended','archived')),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE profiles.professional_service_media (
 service_id uuid NOT NULL REFERENCES profiles.professional_service_profiles(id), asset_id uuid NOT NULL REFERENCES media.assets(id),
 position integer NOT NULL CHECK(position>=0), PRIMARY KEY(service_id,asset_id), UNIQUE(service_id,position)
);
CREATE TABLE geo.presence_sessions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES identity.users(id),
 sharing_enabled boolean NOT NULL DEFAULT false, expires_at timestamptz NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), CHECK(expires_at <= created_at + interval '2 hours')
);
CREATE TABLE geo.geofence_alerts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), geofence_id uuid NOT NULL REFERENCES geo.geofences(id),
 recipient_id uuid NOT NULL REFERENCES identity.users(id), transition text NOT NULL CHECK(transition IN ('enter','exit')),
 observed_at timestamptz NOT NULL, source_evidence_id uuid, dedupe_key text NOT NULL UNIQUE
);
CREATE TABLE places.contributions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), place_id uuid NOT NULL REFERENCES places.places(id),
 author_id uuid NOT NULL REFERENCES identity.users(id), kind text NOT NULL CHECK(kind IN ('correction','photo','note','report')),
 proposed_data jsonb NOT NULL DEFAULT '{}'::jsonb, status text NOT NULL DEFAULT 'pending', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE places.bookmarks (
 place_id uuid NOT NULL REFERENCES places.places(id), user_id uuid NOT NULL REFERENCES identity.users(id),
 created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(place_id,user_id)
);
CREATE TABLE trails.remix_links (
 derived_trail_id uuid PRIMARY KEY REFERENCES trails.trails(id), source_trail_id uuid NOT NULL REFERENCES trails.trails(id),
 source_version_id uuid NOT NULL REFERENCES trails.versions(id), created_at timestamptz NOT NULL DEFAULT now(),
 CHECK(derived_trail_id <> source_trail_id)
);
CREATE TABLE trails.user_saves (
 trail_id uuid NOT NULL REFERENCES trails.trails(id), user_id uuid NOT NULL REFERENCES identity.users(id),
 saved_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(trail_id,user_id)
);
CREATE TABLE trails.completions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), trail_id uuid NOT NULL REFERENCES trails.trails(id),
 user_id uuid NOT NULL REFERENCES identity.users(id), completed_at timestamptz NOT NULL,
 eligibility_status text NOT NULL DEFAULT 'pending', source_key text NOT NULL UNIQUE
);
CREATE TABLE guardians.applications (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES identity.users(id),
 kind text NOT NULL CHECK(kind IN ('legend','pro')), status text NOT NULL DEFAULT 'submitted',
 submitted_at timestamptz NOT NULL DEFAULT now(), reviewed_at timestamptz, reviewer_id uuid REFERENCES identity.users(id)
);
CREATE TABLE guardians.service_media (
 offer_id uuid NOT NULL REFERENCES guardians.offers(id), asset_id uuid NOT NULL REFERENCES media.assets(id),
 position integer NOT NULL DEFAULT 0, PRIMARY KEY(offer_id,asset_id), UNIQUE(offer_id,position)
);
CREATE TABLE tours.booking_history (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), request_id uuid NOT NULL REFERENCES tours.requests(id),
 from_status text, to_status text NOT NULL, actor_user_id uuid REFERENCES identity.users(id),
 recorded_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE businesses.organization_media (
 organization_id uuid NOT NULL REFERENCES businesses.organizations(id), asset_id uuid NOT NULL REFERENCES media.assets(id),
 purpose text NOT NULL, PRIMARY KEY(organization_id,asset_id,purpose)
);
CREATE TABLE businesses.claim_history (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL,
 place_id uuid NOT NULL, actor_id uuid REFERENCES identity.users(id),
 previous_status text, next_status text NOT NULL, changed_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(organization_id,place_id) REFERENCES businesses.place_claims(organization_id,place_id)
);
CREATE TABLE activities.attendance (
 activity_id uuid NOT NULL REFERENCES activities.activities(id), user_id uuid NOT NULL REFERENCES identity.users(id),
 verified_at timestamptz, status text NOT NULL CHECK(status IN ('pending','attended','rejected')),
 PRIMARY KEY(activity_id,user_id)
);
CREATE TABLE events.event_media (
 event_id uuid NOT NULL REFERENCES events.events(id), asset_id uuid NOT NULL REFERENCES media.assets(id),
 position integer NOT NULL DEFAULT 0, PRIMARY KEY(event_id,asset_id), UNIQUE(event_id,position)
);
CREATE TABLE events.event_discussions (
 event_id uuid PRIMARY KEY REFERENCES events.events(id), conversation_id uuid NOT NULL UNIQUE REFERENCES messaging.conversations(id)
);
CREATE TABLE content.comments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), post_id uuid NOT NULL REFERENCES content.posts(id),
 author_id uuid NOT NULL REFERENCES identity.users(id), parent_id uuid REFERENCES content.comments(id),
 body text NOT NULL CHECK(length(btrim(body)) BETWEEN 1 AND 4000), created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE content.content_saves (
 post_id uuid NOT NULL REFERENCES content.posts(id), user_id uuid NOT NULL REFERENCES identity.users(id),
 created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(post_id,user_id)
);
CREATE TABLE media.derivatives (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), source_asset_id uuid NOT NULL REFERENCES media.assets(id),
 rendition text NOT NULL, object_key text NOT NULL UNIQUE, bytes bigint CHECK(bytes>0), created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(source_asset_id,rendition)
);
CREATE TABLE media.cleanup_jobs (
 asset_id uuid PRIMARY KEY REFERENCES media.assets(id), attempts integer NOT NULL DEFAULT 0 CHECK(attempts>=0),
 next_attempt_at timestamptz NOT NULL DEFAULT now(), last_error_code text
);
CREATE TABLE messaging.receipts (
 message_id uuid NOT NULL REFERENCES messaging.messages(id), recipient_id uuid NOT NULL REFERENCES identity.users(id),
 delivered_at timestamptz, read_at timestamptz, PRIMARY KEY(message_id,recipient_id),
 CHECK(read_at IS NULL OR delivered_at IS NOT NULL)
);
CREATE TABLE rooms.participants (
 room_id uuid NOT NULL REFERENCES rooms.sessions(id), user_id uuid NOT NULL REFERENCES identity.users(id),
 joined_at timestamptz NOT NULL DEFAULT now(), left_at timestamptz,
 PRIMARY KEY(room_id,user_id,joined_at)
);
CREATE TABLE communities.invitations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), community_id uuid NOT NULL REFERENCES communities.communities(id),
 invitee_id uuid NOT NULL REFERENCES identity.users(id), invited_by uuid NOT NULL REFERENCES identity.users(id),
 status text NOT NULL DEFAULT 'pending', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE matching.acceptances (
 proposal_id uuid NOT NULL REFERENCES matching.proposals(id), participant_id uuid NOT NULL REFERENCES identity.users(id),
 accepted_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(proposal_id,participant_id)
);
CREATE TABLE challenges.reactions (
 response_id uuid NOT NULL REFERENCES challenges.responses(id), user_id uuid NOT NULL REFERENCES identity.users(id),
 reaction text NOT NULL CHECK(reaction IN ('fire','electric','chill','respect')),
 created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(response_id,user_id)
);
CREATE TABLE recognition.passport_stamps (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES identity.users(id),
 place_id uuid REFERENCES places.places(id), trail_id uuid REFERENCES trails.trails(id),
 awarded_at timestamptz NOT NULL DEFAULT now(), source_key text NOT NULL UNIQUE,
 CHECK((place_id IS NOT NULL) <> (trail_id IS NOT NULL))
);
CREATE TABLE vq.grant_batches (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), created_by uuid NOT NULL REFERENCES identity.users(id),
 reason text NOT NULL, amount bigint NOT NULL CHECK(amount>0), status text NOT NULL DEFAULT 'draft',
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE vq.grant_recipients (
 batch_id uuid NOT NULL REFERENCES vq.grant_batches(id), recipient_id uuid NOT NULL REFERENCES identity.users(id),
 journal_id uuid REFERENCES vq.journals(id), status text NOT NULL DEFAULT 'pending', PRIMARY KEY(batch_id,recipient_id)
);
CREATE TABLE moderation.actions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), report_id uuid NOT NULL REFERENCES moderation.reports(id),
 actor_id uuid NOT NULL REFERENCES identity.users(id), action text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE handshakes.history (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), agreement_id uuid NOT NULL REFERENCES handshakes.agreements(id),
 actor_id uuid REFERENCES identity.users(id), action text NOT NULL, occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE notifications.delivery_attempts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), notification_id uuid NOT NULL REFERENCES notifications.inbox(id),
 channel text NOT NULL, attempt integer NOT NULL CHECK(attempt>=1), outcome text NOT NULL,
 attempted_at timestamptz NOT NULL DEFAULT now(), UNIQUE(notification_id,channel,attempt)
);
CREATE TABLE advertising.impressions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), placement_id uuid NOT NULL REFERENCES advertising.placements(id),
 viewer_id uuid REFERENCES identity.users(id), occurred_at timestamptz NOT NULL DEFAULT now(), dedupe_key text UNIQUE
);
CREATE TABLE subscriptions.subscription_periods (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), entitlement_id uuid NOT NULL REFERENCES subscriptions.entitlements(id),
 starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL, CHECK(ends_at>starts_at)
);
CREATE TABLE marketplace.deal_messages (
 deal_id uuid PRIMARY KEY REFERENCES marketplace.deals(id), conversation_id uuid NOT NULL UNIQUE REFERENCES messaging.conversations(id)
);
CREATE TABLE billing.refunds (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), payment_id uuid NOT NULL REFERENCES billing.payments(id),
 amount_minor bigint NOT NULL CHECK(amount_minor>0), status text NOT NULL, external_reference text UNIQUE,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE ticketing.redemptions (
 ticket_id uuid PRIMARY KEY REFERENCES ticketing.tickets(id), verified_by uuid NOT NULL REFERENCES identity.users(id),
 redeemed_at timestamptz NOT NULL DEFAULT now(), scan_key text NOT NULL UNIQUE
);
CREATE TABLE platform.audit_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), actor_id uuid REFERENCES identity.users(id), action text NOT NULL,
 entity_domain text NOT NULL, entity_id uuid, happened_at timestamptz NOT NULL DEFAULT now(), metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);


-- Bounded record families required by the approved user-facing behavior.
CREATE TABLE profiles.user_languages (
 user_id uuid NOT NULL REFERENCES identity.users(id), language_code text NOT NULL CHECK(language_code IN ('en','fr','ar')),
 proficiency text, PRIMARY KEY(user_id, language_code)
);
CREATE TABLE places.place_media (
 place_id uuid NOT NULL REFERENCES places.places(id), asset_id uuid NOT NULL REFERENCES media.assets(id),
 ordinal integer NOT NULL CHECK(ordinal>=0), PRIMARY KEY(place_id,asset_id), UNIQUE(place_id,ordinal)
);
CREATE TABLE businesses.operator_permissions (
 organization_id uuid NOT NULL, user_id uuid NOT NULL,
 capability text NOT NULL CHECK(capability IN ('manage_place','publish_event','manage_operators','manage_media','manage_tickets')),
 granted_by uuid NOT NULL REFERENCES identity.users(id), granted_at timestamptz NOT NULL DEFAULT now(), revoked_at timestamptz,
 PRIMARY KEY(organization_id,user_id,capability),
 FOREIGN KEY(organization_id,user_id) REFERENCES businesses.memberships(organization_id,user_id)
);
CREATE TABLE guardians.selfie_reviews (
 guardian_user_id uuid NOT NULL REFERENCES guardians.guardians(user_id), asset_id uuid NOT NULL REFERENCES media.assets(id),
 submitted_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL,
 review_status text NOT NULL CHECK(review_status IN ('pending','approved','rejected','expired')),
 PRIMARY KEY(guardian_user_id,asset_id), CHECK(expires_at>submitted_at)
);
CREATE TABLE events.organizer_decisions (
 event_id uuid NOT NULL REFERENCES events.events(id), evaluated_by uuid REFERENCES identity.users(id),
 decision text NOT NULL CHECK(decision IN ('approved','rejected','revoked')),
 reason text, decided_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(event_id,decided_at)
);
CREATE TABLE ticketing.issuance_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), product_id uuid NOT NULL REFERENCES ticketing.products(id),
 issuer_user_id uuid NOT NULL REFERENCES identity.users(id),
 requested_count integer NOT NULL CHECK(requested_count>0),
 idempotency_key text NOT NULL UNIQUE, status text NOT NULL CHECK(status IN ('pending','issued','rejected')),
 requested_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE vq.posting_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), actor_user_id uuid NOT NULL REFERENCES identity.users(id),
 source_domain text NOT NULL, source_event_id uuid NOT NULL, journal_id uuid UNIQUE REFERENCES vq.journals(id),
 status text NOT NULL CHECK(status IN ('pending','posted','rejected')),
 UNIQUE(source_domain,source_event_id)
);
CREATE TABLE media.access_grants (
 asset_id uuid NOT NULL REFERENCES media.assets(id), grantee_user_id uuid NOT NULL REFERENCES identity.users(id),
 granted_by uuid NOT NULL REFERENCES identity.users(id), expires_at timestamptz,
 revoked_at timestamptz, PRIMARY KEY(asset_id,grantee_user_id)
);
CREATE TABLE content.post_media (
 post_id uuid NOT NULL REFERENCES content.posts(id), asset_id uuid NOT NULL REFERENCES media.assets(id),
 ordinal integer NOT NULL CHECK(ordinal>=0), PRIMARY KEY(post_id,asset_id), UNIQUE(post_id,ordinal)
);
CREATE TABLE trails.version_media (
 version_id uuid NOT NULL REFERENCES trails.versions(id), asset_id uuid NOT NULL REFERENCES media.assets(id),
 purpose text NOT NULL CHECK(purpose IN ('cover','stop','gallery')),
 PRIMARY KEY(version_id,asset_id)
);
CREATE TABLE moderation.appeals (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), report_id uuid NOT NULL REFERENCES moderation.reports(id),
 appellant_id uuid NOT NULL REFERENCES identity.users(id), reason text NOT NULL,
 state text NOT NULL CHECK(state IN ('submitted','reviewing','accepted','declined')),
 created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX places_geo_idx ON places.places USING gist(point);
CREATE INDEX geo_position_expiry_idx ON geo.positions(expires_at);
CREATE INDEX geo_geofence_idx ON geo.geofences USING gist(center);
CREATE INDEX media_expiry_idx ON media.assets(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX messages_thread_idx ON messaging.messages(conversation_id,sent_at DESC);
CREATE INDEX ticket_products_event_idx ON ticketing.products(event_id);
CREATE INDEX tickets_product_idx ON ticketing.tickets(product_id);
CREATE INDEX outbox_unpublished_idx ON platform.outbox(created_at) WHERE delivered_at IS NULL;
-- VQ journal balancing requires atomic posting and a deferred database constraint (see below).
-- IMPORTANT: slot capacity must be checked under locking against accepted requests; DDL alone does not prevent overbooking.
-- IMPORTANT: tickets token_hash is a hashed credential, NOT plain QR payload; restrict reads with roles/RLS.
-- IMPORTANT: publisher_user_id / issuer_user_id identify the actor making each write;
-- Pro Events require an eligible individual Pro organizer and applicable domain entitlement.
-- Business events require active business operator membership and D09 verification;
-- place publication requires an approved D09 claim AND separate D05 publication command.
-- Cross-domain authorization is NOT enforced by the reference-only foreign keys below;
-- implement guarded SQL functions / restricted service roles and integration tests.
-- SECURITY CONTRACT: No client direct-table grants. Restrict mutations to domain-owned, authenticated server commands.
-- SECURITY CONTRACT: Verify current Pro account + professional eligibility/entitlement for Events.
-- SECURITY CONTRACT: Verify active Business operator + approved claim before D05 Place publication.
-- SECURITY CONTRACT: Pro Guardian service is D07 data, never a fourth D01 account category.
-- IMPORTANT: implement RLS/role grants and transactional command protections before any runtime rollout.
COMMIT;
