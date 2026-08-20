const { supabase } = require('./lib/supabase');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const { userId } = req.query;

    let query = supabase.from('applications').select('*');

    if (userId) {
      query = query.eq('userid', Number(userId));
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ message: 'Failed to fetch applications', details: error.message });
    }

    return res.json(data || []);
  }

  if (req.method === 'POST') {
    const { data, error } = await supabase
      .from('applications')
      .insert({
        jobid: req.body.jobId,
        userid: req.body.userId,
        resumelink: req.body.resumeLink,
        covernote: req.body.coverNote,
        applieddate: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Failed to create application', details: error.message });
    }

    return res.status(201).json(data);
  }

  res.status(405).json({ message: 'Method not allowed' });
};
