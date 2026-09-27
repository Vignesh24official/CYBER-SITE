# Linking CyberShield to Supabase (Project: ndoyiyfevnpqdvcsommy)

Your Supabase project URL is linked:
**`https://ndoyiyfevnpqdvcsommy.supabase.co`**

CyberShield connects directly with Supabase for:
1. **Managed PostgreSQL Database** (all Flyway tables, incident data, and user roles run in your Supabase project)
2. **Supabase Client SDK** (`@supabase/supabase-js` in the frontend for live queries and Realtime updates)
3. **Supabase Storage** (for secure incident evidence file uploads)
4. **Supabase Auth / Google OAuth**

---

## Step 1: Frontend Connection (Just 1 Click for Anon Key)

1. Open your project API settings:
   👉 [**Supabase API Settings for ndoyiyfevnpqdvcsommy**](https://supabase.com/dashboard/project/ndoyiyfevnpqdvcsommy/settings/api)
2. Copy the **`anon` `public`** key (it starts with `eyJ...`).
3. Open [`frontend/.env`](file:///c:/Users/black/OneDrive/Desktop/CYBER/frontend/.env) and paste it into:
   ```env
   VITE_SUPABASE_URL=https://ndoyiyfevnpqdvcsommy.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key-here...
   ```
4. The frontend Supabase client is now active and ready!

---

## Step 2: Connect Spring Boot Backend to Supabase PostgreSQL

1. Open your project Database settings:
   👉 [**Supabase Database Settings for ndoyiyfevnpqdvcsommy**](https://supabase.com/dashboard/project/ndoyiyfevnpqdvcsommy/settings/database)
2. Open [`.env`](file:///c:/Users/black/OneDrive/Desktop/CYBER/.env) in the project root:
   ```env
   SPRING_PROFILES_ACTIVE=supabase
   SUPABASE_DB_URL=jdbc:postgresql://db.ndoyiyfevnpqdvcsommy.supabase.co:5432/postgres?sslmode=require
   SUPABASE_DB_USER=postgres
   SUPABASE_DB_PASSWORD=[YOUR-DATABASE-PASSWORD]
   ```
3. Start the backend:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=supabase
   ```
   *Flyway automatically runs all database migrations against your Supabase database on startup.*

---

## Step 3: Setup Storage Bucket for Incident Evidence

1. Go to [**Supabase Storage for ndoyiyfevnpqdvcsommy**](https://supabase.com/dashboard/project/ndoyiyfevnpqdvcsommy/storage/buckets).
2. Click **New bucket** and name it: `incident-evidence`.
3. Toggle **Public bucket** to ON.
4. Save. Evidence uploads from the report wizard are now stored securely in your Supabase cloud bucket!
