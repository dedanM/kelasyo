-- Seed de démonstration Kelasyo
-- À exécuter après schema.sql

INSERT INTO users (id, email, full_name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'toi@acme.com', 'Toi'),
  ('22222222-2222-2222-2222-222222222222', 'sara@acme.com', 'Sara Martin'),
  ('33333333-3333-3333-3333-333333333333', 'alex@acme.com', 'Alex Dupont'),
  ('44444444-4444-4444-4444-444444444444', 'lea@acme.com', 'Léa Bernard')
ON CONFLICT (email) DO NOTHING;

INSERT INTO workspaces (id, name, slug, plan) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Acme Corp', 'acme-corp', 'pro'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Startup X', 'startup-x', 'starter')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO workspace_members (workspace_id, user_id, role, status) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'owner', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'admin', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'member', 'active'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'member', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO channels (workspace_id, name, description) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'général', 'Channel principal'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'sprint-24', 'Sprint en cours'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bugs', 'Suivi des bugs')
ON CONFLICT DO NOTHING;

INSERT INTO invitations (workspace_id, email, role, invited_by) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'paul@startup.io', 'member', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'emma@design.co', 'viewer', '11111111-1111-1111-1111-111111111111');

INSERT INTO meetings (workspace_id, title, starts_at, ends_at, status, created_by, meeting_url) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sprint Review',
   NOW() + INTERVAL '2 hours', NOW() + INTERVAL '2 hours 45 minutes',
   'scheduled', '11111111-1111-1111-1111-111111111111', 'https://meet.kelasyo.app/sprint-review'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Daily Standup',
   (CURRENT_DATE + INTERVAL '1 day') + TIME '09:30',
   (CURRENT_DATE + INTERVAL '1 day') + TIME '09:45',
   'scheduled', '11111111-1111-1111-1111-111111111111', 'https://meet.kelasyo.app/daily');
