-- Fluent: Initial database schema
-- Tables: profiles, sessions, messages, pronunciation_errors, grammar_errors, progress

-- Users profile (extends Supabase Auth)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  current_level text check (current_level in ('A1','A2','B1','B2','C1')),
  ui_language text default 'en' check (ui_language in ('en','es','fr','de')),
  llm_provider text default 'deepseek' check (llm_provider in ('deepseek','claude','openai','gemini')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Conversation sessions
create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  mode text not null check (mode in ('chat','correction','teaching')),
  level text not null check (level in ('A1','A2','B1','B2','C1')),
  module_id text,
  topic_id text,
  started_at timestamptz default now(),
  ended_at timestamptz,
  fluency_score numeric,
  grammar_score numeric,
  pronunciation_score numeric,
  summary jsonb
);

-- Individual messages in a session
create table messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade not null,
  role text not null check (role in ('user','assistant')),
  content text not null,
  audio_url text,
  timestamp_ms integer,
  created_at timestamptz default now()
);

-- Pronunciation errors (clickable words)
create table pronunciation_errors (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references messages(id) on delete cascade not null,
  word_position integer not null,
  spoken_text text not null,
  correct_text text not null,
  spoken_ipa text,
  correct_ipa text,
  correct_audio_url text,
  severity text check (severity in ('minor','moderate','severe')),
  explanation text
);

-- Grammar errors
create table grammar_errors (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references messages(id) on delete cascade not null,
  error_text text not null,
  correction text not null,
  rule_reference text,
  explanation text
);

-- User progress tracking
create table progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  level text not null,
  module_id text not null,
  topic_id text not null,
  sessions_completed integer default 0,
  avg_fluency numeric,
  avg_grammar numeric,
  avg_pronunciation numeric,
  last_practiced_at timestamptz,
  unique (user_id, level, module_id, topic_id)
);

-- Indexes for common queries
create index idx_sessions_user_id on sessions(user_id);
create index idx_sessions_started_at on sessions(started_at desc);
create index idx_messages_session_id on messages(session_id);
create index idx_messages_created_at on messages(created_at);
create index idx_pronunciation_errors_message_id on pronunciation_errors(message_id);
create index idx_grammar_errors_message_id on grammar_errors(message_id);
create index idx_progress_user_id on progress(user_id);

-- Enable Row Level Security on all tables
alter table profiles enable row level security;
alter table sessions enable row level security;
alter table messages enable row level security;
alter table pronunciation_errors enable row level security;
alter table grammar_errors enable row level security;
alter table progress enable row level security;

-- RLS Policies: users can only access their own data

-- Profiles
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Sessions
create policy "Users can view own sessions"
  on sessions for select using (auth.uid() = user_id);
create policy "Users can insert own sessions"
  on sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own sessions"
  on sessions for update using (auth.uid() = user_id);

-- Messages (access via session ownership)
create policy "Users can view own messages"
  on messages for select using (
    exists (select 1 from sessions where sessions.id = messages.session_id and sessions.user_id = auth.uid())
  );
create policy "Users can insert own messages"
  on messages for insert with check (
    exists (select 1 from sessions where sessions.id = messages.session_id and sessions.user_id = auth.uid())
  );

-- Pronunciation errors (access via message → session ownership)
create policy "Users can view own pronunciation errors"
  on pronunciation_errors for select using (
    exists (
      select 1 from messages
      join sessions on sessions.id = messages.session_id
      where messages.id = pronunciation_errors.message_id
      and sessions.user_id = auth.uid()
    )
  );
create policy "Users can insert own pronunciation errors"
  on pronunciation_errors for insert with check (
    exists (
      select 1 from messages
      join sessions on sessions.id = messages.session_id
      where messages.id = pronunciation_errors.message_id
      and sessions.user_id = auth.uid()
    )
  );

-- Grammar errors (access via message → session ownership)
create policy "Users can view own grammar errors"
  on grammar_errors for select using (
    exists (
      select 1 from messages
      join sessions on sessions.id = messages.session_id
      where messages.id = grammar_errors.message_id
      and sessions.user_id = auth.uid()
    )
  );
create policy "Users can insert own grammar errors"
  on grammar_errors for insert with check (
    exists (
      select 1 from messages
      join sessions on sessions.id = messages.session_id
      where messages.id = grammar_errors.message_id
      and sessions.user_id = auth.uid()
    )
  );

-- Progress
create policy "Users can view own progress"
  on progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress"
  on progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress"
  on progress for update using (auth.uid() = user_id);

-- Auto-create profile on signup (trigger)
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, current_level)
  values (new.id, new.raw_user_meta_data->>'display_name', 'A1');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
