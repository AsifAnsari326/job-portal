const { supabase } = require('./lib/supabase');

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
    const { q, type, companyId, _page, _limit } = req.query;

    let query = supabase.from('jobs').select('*', { count: 'exact' });

    if (q) {
      const search = `%${q}%`;
      query = query.or(`title.ilike.${search},company.ilike.${search}`);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (companyId) {
      query = query.eq('companyid', Number(companyId));
    }

    const page = Number(_page) || 1;
    const limit = Number(_limit) || 6;
    const start = (page - 1) * limit;

    query = query.range(start, start + limit - 1).order('posteddate', { ascending: false });

    const { data, count, error } = await query;

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch jobs', details: error.message });
    }

    res.setHeader('X-Total-Count', count || 0);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};
