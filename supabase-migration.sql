-- ============================================
-- JOB PORTAL DATABASE SETUP FOR SUPABASE
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create Companies Table
CREATE TABLE IF NOT EXISTS companies (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  jobCount INT DEFAULT 0
);

-- 2. Create Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  companyId BIGINT REFERENCES companies(id),
  location TEXT,
  type TEXT,
  experience TEXT,
  salary TEXT,
  tags TEXT[],
  description TEXT,
  postedDate TEXT
);

-- 3. Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY,
  fullName TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- 4. Create Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id BIGINT PRIMARY KEY,
  jobId BIGINT REFERENCES jobs(id),
  userId BIGINT REFERENCES users(id),
  resumeLink TEXT,
  coverNote TEXT,
  appliedDate TEXT
);

-- 5. Create Saved Jobs Table
CREATE TABLE IF NOT EXISTS savedJobs (
  id BIGINT PRIMARY KEY,
  jobId BIGINT REFERENCES jobs(id),
  userId BIGINT REFERENCES users(id)
);

-- ============================================
-- INSERT DATA (from db.json)
-- ============================================

-- Insert Companies
INSERT INTO companies (id, name, description, location, jobCount) VALUES
(1, 'Nimbus Retail', 'Leading e-commerce platform revolutionizing retail with cutting-edge technology.', 'Bengaluru', 3),
(2, 'Skyline Fintech', 'Innovative fintech solutions for financial institutions and individual investors.', 'Remote', 2),
(3, 'Pixel Labs', 'Creative digital agency building beautiful and functional web experiences.', 'Pune', 2),
(4, 'Voyage Systems', 'Travel technology company disrupting the booking experience globally.', 'Mumbai', 1),
(5, 'Cobalt Media', 'Digital media platform delivering premium entertainment content.', 'Remote', 1),
(6, 'Ledger Works', 'Accounting and financial software for modern businesses.', 'Hyderabad', 1),
(7, 'Northgate Health', 'Healthcare technology improving patient outcomes through digital innovation.', 'Delhi', 1),
(8, 'Quantum Retail', 'Large-scale e-commerce platform with millions of users worldwide.', 'Bengaluru', 1),
(9, 'Bright Path Edu', 'Educational technology platform empowering learners globally.', 'Remote', 1),
(10, 'Ironclad Logistics', 'Supply chain and logistics optimization solutions.', 'Chennai', 1),
(11, 'Solaris Energy', 'Renewable energy technology and solar solutions provider.', 'Pune', 1),
(12, 'Cedar Consulting', 'Management consulting firm with expertise in digital transformation.', 'Remote', 1),
(13, 'Harbor Insurance', 'Insurance technology serving customers and agents globally.', 'Mumbai', 1),
(14, 'Vertex Gaming', 'Gaming and interactive entertainment platform.', 'Remote', 1),
(15, 'Maple Bank', 'Banking and financial services for individuals and businesses.', 'Delhi', 1),
(16, 'Aurora Cloud', 'Cloud infrastructure and platform services.', 'Bengaluru', 1),
(17, 'Prism Analytics', 'Data analytics and business intelligence platform.', 'Remote', 1),
(18, 'StartUp Hub', 'Startup incubator and technology hub fostering innovation.', 'Pune', 1),
(19, 'TechCore Solutions', 'Enterprise software solutions for large-scale organizations.', 'Hyderabad', 1),
(20, 'Global Tech Inc', 'International technology company with global operations.', 'Remote', 1)
ON CONFLICT (id) DO NOTHING;

-- Insert Jobs
INSERT INTO jobs (id, title, company, companyId, location, type, experience, salary, tags, description, postedDate) VALUES
(1, 'Frontend Developer', 'Nimbus Retail', 1, 'Bengaluru', 'Full-time', '1-3', '6-10 LPA', ARRAY['Angular', 'RxJS', 'TypeScript'], 'We''re looking for a frontend developer skilled in Angular to build our customer-facing retail platform.', '2026-07-10'),
(2, 'Angular Developer', 'Skyline Fintech', 2, 'Remote', 'Remote', '1-3', '8-12 LPA', ARRAY['Angular', 'NgRx'], 'Join our fintech team building secure, scalable financial dashboards using Angular and NgRx.', '2026-07-09'),
(3, 'Frontend Engineer Intern', 'Pixel Labs', 3, 'Pune', 'Internship', '0-1', '15-20k/month', ARRAY['TypeScript', 'CSS'], 'Great opportunity for students to learn frontend development in a fast-paced startup environment.', '2026-07-08'),
(4, 'UI Engineer', 'Voyage Systems', 4, 'Mumbai', 'Full-time', '3-5', '10-14 LPA', ARRAY['Angular', 'RxJS'], 'Build pixel-perfect, accessible UI components for our travel booking platform.', '2026-07-07'),
(5, 'React Developer', 'Cobalt Media', 5, 'Remote', 'Remote', '1-3', '7-11 LPA', ARRAY['React', 'Redux'], 'Looking for a React developer to work on our media streaming dashboard.', '2026-07-06'),
(6, 'Full Stack Developer', 'Ledger Works', 6, 'Hyderabad', 'Full-time', '3-5', '12-18 LPA', ARRAY['.NET', 'Angular'], 'Full stack role working across Angular frontend and .NET backend for our accounting platform.', '2026-07-05'),
(7, 'Frontend Developer Intern', 'Northgate Health', 7, 'Delhi', 'Internship', '0-1', '10-15k/month', ARRAY['JavaScript', 'HTML'], 'Support our healthcare platform team in building patient-facing web pages.', '2026-07-04'),
(8, 'Senior Angular Developer', 'Quantum Retail', 8, 'Bengaluru', 'Full-time', '5+', '18-25 LPA', ARRAY['Angular', 'RxJS', 'NgRx'], 'Lead frontend architecture decisions for our e-commerce platform serving millions of users.', '2026-07-03'),
(9, 'UI/UX Developer', 'Bright Path Edu', 9, 'Remote', 'Remote', '1-3', '6-9 LPA', ARRAY['Angular', 'SCSS'], 'Build engaging learning interfaces for our ed-tech platform used by students across India.', '2026-07-02'),
(10, 'Software Engineer', 'Ironclad Logistics', 10, 'Chennai', 'Full-time', '3-5', '9-13 LPA', ARRAY['Angular', 'TypeScript'], 'Develop and maintain internal logistics tracking tools for our supply chain team.', '2026-07-01'),
(11, 'Frontend Developer', 'Solaris Energy', 11, 'Pune', 'Full-time', '1-3', '7-10 LPA', ARRAY['Angular', 'RxJS'], 'Work on dashboards visualizing real-time solar energy production data.', '2026-06-30'),
(12, 'Web Developer Intern', 'Cedar Consulting', 12, 'Remote', 'Internship', '0-1', '12-18k/month', ARRAY['TypeScript', 'Angular'], 'Support our consulting team''s internal tools built with Angular.', '2026-06-29'),
(13, 'Angular Developer', 'Harbor Insurance', 13, 'Mumbai', 'Full-time', '3-5', '14-19 LPA', ARRAY['Angular', 'RxJS', 'NgRx'], 'Build claims processing interfaces used by thousands of agents daily.', '2026-06-28'),
(14, 'Frontend Developer', 'Vertex Gaming', 14, 'Remote', 'Remote', '1-3', '8-12 LPA', ARRAY['Angular', 'TypeScript'], 'Build interactive dashboards for our gaming analytics platform.', '2026-06-27'),
(15, 'Associate Frontend Engineer', 'Maple Bank', 15, 'Delhi', 'Full-time', '0-1', '6-9 LPA', ARRAY['Angular', 'SCSS', 'RxJS'], 'Great entry-level role to build banking UI components with mentorship from senior engineers.', '2026-06-26'),
(16, 'Senior Frontend Architect', 'Aurora Cloud', 16, 'Bengaluru', 'Full-time', '5+', '25-35 LPA', ARRAY['Angular', 'Architecture', 'Team Leadership'], 'Lead our frontend architecture and mentor team members. Build scalable web applications.', '2026-06-25'),
(17, 'TypeScript Developer', 'Prism Analytics', 17, 'Remote', 'Remote', '1-3', '7-10 LPA', ARRAY['TypeScript', 'Angular', 'RxJS'], 'Join our team building data analytics platforms with TypeScript and Angular.', '2026-06-24'),
(18, 'Junior Web Developer', 'StartUp Hub', 18, 'Pune', 'Full-time', '0-1', '5-7 LPA', ARRAY['JavaScript', 'Angular', 'HTML/CSS'], 'Perfect role for graduates looking to start their web development career. Hands-on training included.', '2026-06-23'),
(19, 'Mid-Level Angular Specialist', 'TechCore Solutions', 19, 'Hyderabad', 'Full-time', '3-5', '13-17 LPA', ARRAY['Angular', 'State Management', 'Performance Optimization'], 'Work on performance-critical Angular applications with focus on optimization and best practices.', '2026-06-22'),
(20, 'Frontend Engineer (Senior)', 'Global Tech Inc', 20, 'Remote', 'Remote', '5+', '20-28 LPA', ARRAY['Angular', 'RxJS', 'System Design'], 'Design and implement complex frontend systems for our international platform.', '2026-06-21')
ON CONFLICT (id) DO NOTHING;

-- Insert Test Users (passwords are bcrypt hashed)
INSERT INTO users (id, fullName, email, password) VALUES
(1784253432984, 'Asif1', 'test@test1.com', '$2b$08$SxS0i8MdRWbEnZijbdMU.ehtdVRQIUMIPeX.EXL4M1ggV5Ya7iO2q'),
(1784253636788, 'Asif2', 'test@test2.com', '$2b$08$i0M/Z3WhjkKZBVYRfFHXre7/ZnmhzVqx5wNYRrme5l2CvT6y0bto6'),
(1784253950774, 'Asif3', 'test@test3.com', '$2b$08$xRsvB8jWzH2Eo7lsnKIegu/o6/3wzQ7QvyfYZsgRF/jGZp4cqf7XC'),
(1785201543794, 'Asif Ansari', 'test4@test.com', '$2b$08$cpj0nk3.EXe7FKDTyePZqeYstpILxExKTp20eFZhNMBevWcxAWbaC')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ENABLE ROW LEVEL SECURITY (Optional)
-- ============================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE savedJobs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to companies and jobs
CREATE POLICY "Public read access" ON companies FOR SELECT USING (true);
CREATE POLICY "Public read access" ON jobs FOR SELECT USING (true);

-- Allow authenticated users to read/write their own data
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own applications" ON applications FOR SELECT USING (true);
CREATE POLICY "Users can insert applications" ON applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own saved jobs" ON savedJobs FOR SELECT USING (true);
CREATE POLICY "Users can insert saved jobs" ON savedJobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete saved jobs" ON savedJobs FOR DELETE USING (true);
