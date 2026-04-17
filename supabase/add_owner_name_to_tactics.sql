-- tactics tablosuna owner_name yoksa ekler (Supabase SQL Editor'da bir kez çalıştırın).
-- Ardından Dashboard → Settings → API → "Reload schema" veya birkaç dakika bekleyin.

alter table public.tactics
  add column if not exists owner_name text not null default 'KadroKur kullanıcısı';
