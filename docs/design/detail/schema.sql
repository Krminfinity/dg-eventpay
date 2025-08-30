-- DG EventPay DDL (PostgreSQL) - draft v0
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- common
CREATE TABLE app_user (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE organizer_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES app_user(id),
  type TEXT NOT NULL CHECK (type IN ('individual','corporate')),
  kyc_status TEXT NOT NULL DEFAULT 'pending',
  org_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE bank_account (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_profile_id UUID NOT NULL REFERENCES organizer_profile(id),
  bank_code TEXT NOT NULL,
  branch_code TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('ordinary','checking')),
  account_number_hash TEXT NOT NULL,
  holder_name TEXT NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE event (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_profile_id UUID NOT NULL REFERENCES organizer_profile(id),
  title TEXT NOT NULL,
  description TEXT,
  fee_amount INTEGER NOT NULL CHECK (fee_amount >= 0),
  fee_currency TEXT NOT NULL DEFAULT 'JPY',
  capacity INTEGER,
  deadline_at TIMESTAMPTZ,
  cancel_policy TEXT,
  visibility TEXT NOT NULL CHECK (visibility IN ('public','link_only','private')),
  status TEXT NOT NULL DEFAULT 'draft',
  confirmed_at TIMESTAMPTZ,
  share_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  min_participants INTEGER,
  min_total_amount INTEGER,
  confirmation_deadline_at TIMESTAMPTZ
);

CREATE TABLE date_option (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES event(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  note TEXT,
  votes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE rsvp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES event(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  participant_email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('invited','going','declined','waitlist','canceled')),
  token TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX rsvp_event_email_uniq ON rsvp(event_id, participant_email);

CREATE TABLE payment_intent (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES event(id) ON DELETE CASCADE,
  rsvp_id UUID NOT NULL REFERENCES rsvp(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'JPY',
  method TEXT NOT NULL CHECK (method IN ('card','qr','convenience')),
  status TEXT NOT NULL CHECK (status IN ('requires_payment','processing','succeeded','canceled','expired','failed')),
  vt4g_transaction_id TEXT,
  expires_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX payment_intent_active_unique ON payment_intent(rsvp_id) WHERE status IN ('requires_payment','processing');

CREATE TABLE payment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_intent_id UUID NOT NULL REFERENCES payment_intent(id) ON DELETE CASCADE,
  amount_captured INTEGER NOT NULL CHECK (amount_captured >= 0),
  currency TEXT NOT NULL DEFAULT 'JPY',
  method TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('authorized','captured','failed','chargeback')),
  authorized_at TIMESTAMPTZ,
  captured_at TIMESTAMPTZ,
  vt4g_ids JSONB,
  receipt_url TEXT
);

CREATE TABLE refund (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payment(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount > 0),
  reason TEXT,
  status TEXT NOT NULL CHECK (status IN ('requested','processing','succeeded','failed')),
  vt4g_refund_id TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payout_batch (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cycle TEXT NOT NULL,
  scheduled_for DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled','processing','paid','failed')),
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payout (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payout_batch_id UUID NOT NULL REFERENCES payout_batch(id) ON DELETE CASCADE,
  organizer_profile_id UUID NOT NULL REFERENCES organizer_profile(id),
  amount_gross INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL DEFAULT 0,
  pg_fee INTEGER NOT NULL DEFAULT 0,
  amount_net INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','processing','paid','failed')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE pricing_plan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  scope TEXT NOT NULL,
  terms TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE fee (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES pricing_plan(id) ON DELETE CASCADE,
  percentage NUMERIC(5,2) NOT NULL,
  fixed_amount INTEGER NOT NULL DEFAULT 0,
  tax_rule TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE webhook_event (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL,
  type TEXT NOT NULL,
  signature TEXT,
  payload JSONB NOT NULL,
  delivered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  retries INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- provider 例: 'komoju' | 'veritrans' など

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_user_id UUID REFERENCES app_user(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  metadata JSONB,
  ip INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notification (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES event(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  template TEXT NOT NULL,
  recipient TEXT NOT NULL,
  status TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- constraints
ALTER TABLE refund ADD CONSTRAINT refund_amount_total CHECK (
  amount > 0
);

ALTER TABLE event
  ADD CONSTRAINT event_min_participants_chk CHECK (min_participants IS NULL OR min_participants >= 1),
  ADD CONSTRAINT event_min_total_amount_chk CHECK (min_total_amount IS NULL OR min_total_amount >= 0);
