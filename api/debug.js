const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  const result = {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlPreview: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'MISSING',
    keyPreview: supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'MISSING',
  };

  if (!supabaseUrl || !supabaseKey) {
    result.status = 'FAIL - Missing env variables';
    return res.status(500).json(result);
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.from('users').select('id').limit(1);

    if (error) {
      result.status = 'FAIL - Supabase query error';
      result.error = error.message;
      result.code = error.code;
      return res.status(500).json(result);
    }

    result.status = 'OK';
    result.usersCount = data ? data.length : 0;
    res.json(result);
  } catch (err) {
    result.status = 'FAIL - Exception';
    result.error = err.message;
    res.status(500).json(result);
  }
};
