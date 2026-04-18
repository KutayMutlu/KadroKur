-- Eşleşen içerik: supabase/schema.sql sonundaki handle_new_user bloğu.
-- Supabase CLI ile migrate eden projeler için.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  fn text := '';
  ln text := '';
  bd date;
  av text := '';
  full_raw text;
begin
  fn := coalesce(nullif(trim(meta->>'first_name'), ''), nullif(trim(meta->>'given_name'), ''));
  ln := coalesce(nullif(trim(meta->>'last_name'), ''), nullif(trim(meta->>'family_name'), ''));

  if fn = '' and ln = '' then
    full_raw := coalesce(
      nullif(trim(meta->>'full_name'), ''),
      nullif(trim(meta->>'name'), ''),
      nullif(trim(meta->>'user_name'), '')
    );
    if full_raw <> '' then
      fn := split_part(full_raw, ' ', 1);
      ln := nullif(trim(substring(full_raw from length(split_part(full_raw, ' ', 1)) + 2)), '');
    end if;
  end if;

  begin
    bd := (nullif(trim(meta->>'birth_date'), ''))::date;
  exception when others then
    bd := null;
  end;

  av := coalesce(nullif(trim(meta->>'avatar_url'), ''), nullif(trim(meta->>'picture'), ''), '');

  insert into public.user_profiles (user_id, first_name, last_name, birth_date, avatar_url, updated_at)
  values (new.id, fn, ln, bd, av, now())
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
