const { supabase } = require('../_lib/supabase');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const id = Number(req.query.id);

    if (!id) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch job', details: error.message });
    }

    if (!data) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};
