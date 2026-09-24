# Admin setup

1. In Supabase Dashboard, open **Authentication > Users**.
2. Create or confirm the admin account with `admintomsupply@gmail.com`.
3. Copy that user's UUID.
4. Run `schema.sql`, then `admin_workflow.sql` in the SQL Editor.
5. Run this SQL with the copied UUID:

```sql
insert into public.admin_users (user_id)
values ('407fd8fb-7248-48b3-8a96-45082dc9f2ff')
on conflict (user_id) do nothing;
```

Do not use the service-role key in the browser. The admin UUID is protected by the `is_admin()` database function and RLS policies.

Open `admin.html` after signing in with this approved account. No URL secret is required.
