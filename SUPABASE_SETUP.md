# Linking CyberShield to Supabase (Complete Guide)

CyberShield is now fully equipped to link directly with **Supabase** for:
1. **Managed PostgreSQL Database** (all Flyway tables, incident data, and user roles run in your Supabase project)
2. **Supabase Client SDK** (`@supabase/supabase-js` in the frontend for live queries and Realtime updates)
3. **Supabase Storage** (for secure incident evidence file uploads)
4. **Supabase Auth / Google OAuth**

---

## Step 1: Connect Spring Boot Backend to Supabase PostgreSQL

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and create a new project (or select an existing one).
2. Go to **Project Settings** (gear icon) $\rightarrow$ **Database**.
3. Under **Connection string**, select **URI** or **JDBC**:
   - Direct connection (Port 5432):
     ```
     jdbc:postgresql://db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?sslmode=require
     ```
   - Or Transaction Pooler (Port 6543, recommended for serverless/cloud):
     ```
     jdbc:postgresql://aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
     ```
4. Set the environment variables in your environment (or `.env` file):
   ```env
   SPRING_PROFILES_ACTIVE=supabase
   SUPABASE_DB_URL=jdbc:postgresql://db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?sslmode=require
   SUPABASE_DB_USER=postgres
   SUPABASE_DB_PASSWORD=[YOUR-DATABASE-PASSWORD]
   ```
5. Run the backend:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=supabase
   ```
   *Flyway will automatically create all tables, indexes, and initial roles on your Supabase PostgreSQL database on startup!*

---

## Step 2: Connect Frontend to Supabase

1. In your Supabase Dashboard, go to **Project Settings** $\rightarrow$ **API**.
2. Copy the **Project URL** and the **`anon` `public` API key**.
3. In `frontend/`, create or update `.env`:
   ```env
   VITE_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
   VITE_SUPABASE_ANON_KEY=[YOUR-SUPABASE-ANON-KEY]
   ```
4. The frontend `@supabase/supabase-js` client (`frontend/src/services/supabaseClient.js`) is now automatically active!

---

## Step 3: Setup Storage Bucket for Incident Evidence (Optional)

1. In Supabase Dashboard, click **Storage** in the sidebar.
2. Click **New bucket** and name it: `incident-evidence`.
3. Set bucket access to **Public** (or configure Row Level Security if desired).
4. Evidence uploaded via the frontend will now be stored in your Supabase bucket.
