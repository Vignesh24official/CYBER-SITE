# Linking CyberShield to Supabase (Project: ndoyiyfevnpqdvcsommy)

Your Supabase project URL:
**`https://ndoyiyfevnpqdvcsommy.supabase.co`**

CyberShield connects directly with Supabase for:
1. **Managed PostgreSQL Database**: Incidents, Citizen profiles, Investigator notes, and Audit logs.
2. **Supabase Client SDK (`@supabase/supabase-js`)**: Real-time incident updates and direct PostgreSQL data operations.
3. **Google Sign-Up & OAuth**: Automated citizen user provisioning with profiles saved directly in the Supabase database.
4. **Supabase Cloud Storage**: Forensic evidence file uploads in the `incident-evidence` bucket.

---

## Step 1: Run Complete Database Schema in Supabase (1-Click)

To create all tables, indexes, roles, and initial seed users in your Supabase PostgreSQL database:

1. Open your **[Supabase SQL Editor](https://supabase.com/dashboard/project/ndoyiyfevnpqdvcsommy/sql/new)**.
2. Open the file [`supabase_complete_schema.sql`](file:///c:/Users/black/OneDrive/Desktop/CYBER/supabase_complete_schema.sql) in this project root.
3. Copy and paste the entire SQL content into the Supabase SQL editor.
4. Click **Run**.
5. ✅ All tables (`users`, `roles`, `complaints`, `evidence_files`, `investigations`, `safety_articles`, `audit_logs`) and access policies are now created in your Supabase database!

---

## Step 2: Configure Supabase Database Password

1. Retrieve your database password (set when you created the project):
   👉 [**Supabase Database Settings**](https://supabase.com/dashboard/project/ndoyiyfevnpqdvcsommy/settings/database)
   *(If you don't remember it, click **Reset database password** on that page).*
2. Open [`.env`](file:///c:/Users/black/OneDrive/Desktop/CYBER/.env) in the project root:
   ```env
   SUPABASE_DB_URL=jdbc:postgresql://db.ndoyiyfevnpqdvcsommy.supabase.co:5432/postgres?sslmode=require
   SUPABASE_DB_USER=postgres
   SUPABASE_DB_PASSWORD=YOUR_ACTUAL_DATABASE_PASSWORD
   SPRING_PROFILES_ACTIVE=supabase
   ```
3. Start the system:
   - Double-click [`run-supabase.bat`](file:///c:/Users/black/OneDrive/Desktop/CYBER/run-supabase.bat)
   - Or run:
     ```bash
     .\run-supabase.bat
     ```
   *Spring Boot will connect directly to your live Supabase PostgreSQL database.*

---

## Step 3: Google Sign-Up & Profile Auto-Saving

CyberShield provides a smooth, multi-channel Google Sign-Up flow:

### Flow A: 1-Click Instant Google Citizen Sign-Up (Works Out-Of-The-Box)
1. Go to the **Register Page** (`http://localhost:5174/register`).
2. Click **"Sign Up with Google (Instant Citizen Account)"**.
3. Choose either:
   - **⚡ 1-Click Citizen Demo Sign-Up**: Instantly provisions `John Citizen` (`user@cybershield.org`).
   - **Your Google Name & Gmail Address**: Enter your name and Gmail.
4. Click **"Save Citizen Profile & Sign In"**.
5. The system immediately:
   - Inserts your citizen user profile into the Supabase PostgreSQL `users` table.
   - Generates encrypted session tokens.
   - Saves your credentials in the database.
   - Automatically redirects you to your **Citizen Dashboard** (`/dashboard`).

### Flow B: Live Google OAuth via Supabase Redirect
If you want users to see the official **Google Accounts Consent Screen** (`accounts.google.com`):
1. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Authorized redirect URI: `https://ndoyiyfevnpqdvcsommy.supabase.co/auth/v1/callback`
2. In Supabase Dashboard, go to **[Authentication -> Providers -> Google](https://supabase.com/dashboard/project/ndoyiyfevnpqdvcsommy/auth/providers)**.
3. Toggle Google **ON**, paste your Google Client ID and Google Client Secret, and click **Save**.
4. In CyberShield, click **"Sign Up with Google (Supabase Live OAuth)"**.
5. Google will authenticate the user and redirect back to CyberShield via [`/auth/callback`](file:///c:/Users/black/OneDrive/Desktop/CYBER/frontend/src/pages/auth/AuthCallbackPage.jsx).
6. CyberShield automatically extracts the user details, creates the profile in the Supabase database, and navigates to the dashboard!

---

## Step 4: Storage Bucket for Evidence Uploads

1. Go to **[Supabase Storage Buckets](https://supabase.com/dashboard/project/ndoyiyfevnpqdvcsommy/storage/buckets)**.
2. Click **New bucket** and name it: `incident-evidence`.
3. Toggle **Public bucket** to **ON**.
4. Click **Save**. Evidence uploads from incident reports are now stored securely in your Supabase cloud bucket!

---

## Testing & Verification

1. Start the app: Run `.\run.bat` or `.\run-supabase.bat`.
2. Open `http://localhost:5174/register`.
3. Click **"Sign Up with Google (Instant Citizen Account)"**.
4. Notice the **Supabase Database Linked** status indicator.
5. Click **"Save Citizen Profile & Sign In"** or **"Register as John Citizen"**.
6. Check your Supabase Table Editor:
   👉 [**Supabase Table Editor (users)**](https://supabase.com/dashboard/project/ndoyiyfevnpqdvcsommy/editor)
   *You will see the new citizen row with role, email, and public_id recorded!*
