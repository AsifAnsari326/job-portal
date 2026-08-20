-- RUN THIS IN SUPABASE SQL EDITOR
-- Check all column names for all tables

SELECT table_name, column_name 
FROM information_schema.columns 
WHERE table_name IN ('users', 'jobs', 'companies', 'applications', 'savedJobs')
ORDER BY table_name, ordinal_position;
