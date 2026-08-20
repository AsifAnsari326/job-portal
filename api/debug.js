const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

  try {
    const supabase = createClient(url, key);
    const results = {};

    // Test users table
    const { data: users, error: e1 } = await supabase.from('users').select('id, email').limit(3);
    results.users = { ok: !e1, count: users?.length, error: e1?.message };

    // Test jobs table
    const { data: jobs, error: e2 } = await supabase.from('jobs').select('id, title').limit(3);
    results.jobs = { ok: !e2, count: jobs?.length, error: e2?.message };

    // Test companies table
    const { data: companies, error: e3 } = await supabase.from('companies').select('id, name').limit(3);
    results.companies = { ok: !e3, count: companies?.length, error: e3?.message };

    // Test signup (insert user with lowercase fullname)
    const testEmail = 'debug-test-' + Date.now() + '@test.com';
    const { data: newUser, error: e5 } = await supabase
      .from('users')
      .insert({ fullname: 'Debug User', email: testEmail, password: 'test123' })
      .select('id')
      .single();
    results.signupTest = { ok: !e5, error: e5?.message, errorCode: e5?.code };

    // Delete test user
    if (newUser) {
      await supabase.from('users').delete().eq('id', newUser.id);
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
