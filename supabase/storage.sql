-- ==============================================================================
-- WanderSpot Storage Setup for Supabase Storage
-- ==============================================================================

-- 1. Create public bucket 'spot-photos'
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'spot-photos',
  'spot-photos',
  true,
  5242880, -- 5 MB in bytes
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Storage Object RLS Policies

-- Anyone (public or authenticated) can view spot photos
drop policy if exists "Public Access for Spot Photos" on storage.objects;
create policy "Public Access for Spot Photos"
  on storage.objects for select
  using (bucket_id = 'spot-photos');

-- Authenticated users can upload only into a folder named with their own auth.uid
drop policy if exists "Authenticated users can upload to own folder" on storage.objects;
create policy "Authenticated users can upload to own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'spot-photos' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update/delete their own uploaded files
drop policy if exists "Users can update their own uploads" on storage.objects;
create policy "Users can update their own uploads"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'spot-photos' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their own uploads" on storage.objects;
create policy "Users can delete their own uploads"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'spot-photos' and
    ((storage.foldername(name))[1] = auth.uid()::text or exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    ))
  );
