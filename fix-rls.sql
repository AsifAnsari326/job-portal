-- RUN THIS IN SUPABASE SQL EDITOR
-- This will disable RLS on all tables

ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE savedJobs DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public read access" ON companies;
DROP POLICY IF EXISTS "Public read access" ON jobs;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can insert" ON users;
DROP POLICY IF EXISTS "Users can read own applications" ON applications;
DROP POLICY IF EXISTS "Users can insert applications" ON applications;
DROP POLICY IF EXISTS "Users can read own saved jobs" ON savedJobs;
DROP POLICY IF EXISTS "Users can insert saved jobs" ON savedJobs;
DROP POLICY IF EXISTS "Users can delete saved jobs" ON savedJobs;
