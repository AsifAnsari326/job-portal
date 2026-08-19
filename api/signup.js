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

  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  const { data: newUser, error } = await supabase
    .from('users')
    .insert({ fullName, email, password: hashedPassword })
    .select('id, fullName, email')
    .single();

  if (error) {
    return res.status(500).json({ message: 'Failed to create user' });
  }

  const accessToken = jwt.sign({ sub: newUser.id, email }, SECRET, { expiresIn: '7d' });
  res.status(201).json({ accessToken, user: newUser });
};
