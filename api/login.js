const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('./_lib/supabase');

const SECRET = process.env.JWT_SECRET || 'dev-secret-key';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const accessToken = jwt.sign({ sub: user.id, email }, SECRET, { expiresIn: '7d' });
  const { password: _, ...userWithoutPassword } = user;
  res.json({ accessToken, user: userWithoutPassword });
};
