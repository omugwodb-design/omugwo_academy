alter table public.courses
  add column if not exists source_platform text,
  add column if not exists systeme_io_course_id text,
  add column if not exists external_sync_metadata jsonb not null default '{}'::jsonb;

alter table public.modules
  add column if not exists source_platform text,
  add column if not exists systeme_io_module_id text,
  add column if not exists external_sync_metadata jsonb not null default '{}'::jsonb;

alter table public.lessons
  add column if not exists source_platform text,
  add column if not exists systeme_io_lesson_id text,
  add column if not exists external_sync_metadata jsonb not null default '{}'::jsonb;

create index if not exists courses_systeme_io_course_id_idx on public.courses(systeme_io_course_id);
create index if not exists modules_systeme_io_module_id_idx on public.modules(systeme_io_module_id);
create index if not exists lessons_systeme_io_lesson_id_idx on public.lessons(systeme_io_lesson_id);
