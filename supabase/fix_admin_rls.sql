-- Enable admin writing permissions for the coupons table
drop policy if exists "Admins can manage coupons" on public.coupons;
create policy "Admins can manage coupons"
  on public.coupons
  for all 
  using (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.role in ('admin', 'super_admin', 'marketing_admin')
    )
  );

-- Enable admin writing permissions for the community_spaces table
drop policy if exists "Admins can manage community spaces" on public.community_spaces;
create policy "Admins can manage community spaces"
  on public.community_spaces
  for all 
  using (
    exists (
      select 1 from profiles 
      where profiles.id = auth.uid() 
      and profiles.role in ('admin', 'super_admin', 'marketing_admin')
    )
  );
