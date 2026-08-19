const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

  const result = {};

  // Check URL format
  result.urlFormat = url ? (url.startsWith('https://') && url.endsWith('.supabase.co') ? 'VALID' : 'INVALID - must be like https://xxx.supabase.co') : 'MISSING';
  result.urlLength = url ? url.length : 0;

  // Check Key format
  result.keyFormat = key ? (key.startsWith('eyJ') ? 'VALID - looks like JWT' : 'INVALID - must start with eyJ') : 'MISSING';
  result.keyLength = key ? key.length : 0;

  // Show partial values for verification
  result.urlPreview = url ? url.substring(0, 40) : 'N/A';
  result.keyPreview = key ? key.substring(0, 30) + '...' : 'N/A';

  if (!url || !key) {
    result.status = 'FAIL - Missing env variables';
    return res.status(500).json(result);
  }

  try {
    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from('users')
      .select('id, email')
      .limit(3);

    if (error) {
      result.status = 'FAIL';
      result.error = error.message;
      result.code = error.code;
      result.hint = error.hint;
      return res.status(500).json(result);
    }

    result.status = 'OK - Connection working!';
    result.sampleUsers = data;
    res.json(result);
  } catch (err) {
    result.status = 'FAIL - Exception';
    result.error = err.message;
    res.status(500).json(result);
  }
};
