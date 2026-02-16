# Connect Your App to Supabase

If the app shows old or wrong data, it's usually using a **different Supabase project** than the one you're editing. Follow these steps to connect them.

---

## 1. Get your Supabase credentials

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Open your project (e.g. **E_invite**)
3. Click **Settings** (gear icon) → **API**
4. Copy:
   - **Project URL** (e.g. `https://pixvfdqxrgslkrfswopn.supabase.co`)
   - **anon public** key
   - **service_role** key (click "Reveal" if needed)

---

## 2. Local development – create `.env.local`

1. In the project root, copy `.env.example` to `.env.local`
2. Paste your values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://pixvfdqxrgslkrfswopn.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```
3. Restart the dev server: `npm run dev`

---

## 3. Production (Vercel) – set environment variables

1. Go to [vercel.com](https://vercel.com) → your project
2. **Settings** → **Environment Variables**
3. Add or edit:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role key
4. Make sure they apply to **Production** (and Preview if needed)
5. **Save**
6. **Deployments** → **Redeploy** the latest deployment

---

## 4. Verify the connection

1. Log into **Master** on your site
2. At the bottom, you’ll see: **Connected to: https://xxxxx.supabase.co**
3. Check it matches the Project URL from step 1
4. If it doesn’t match, the app is using a different project. Fix the env vars and redeploy.

---

## Checklist

- [ ] `.env.local` has correct values for local dev
- [ ] Vercel env vars match the same Supabase project
- [ ] Redeployed after changing Vercel env vars
- [ ] Master page “Connected to” URL matches your Supabase project
