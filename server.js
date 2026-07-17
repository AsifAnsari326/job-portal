const jsonServer = require('json-server');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const SECRET = 'dev-secret-key';

server.use(middlewares);
server.use(express.json());

server.post('/signup', (req, res) => {
  const db = router.db;
  const { fullName, email, password } = req.body;

  const existing = db.get('users').find({ email }).value();
  if (existing) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  const newUser = { id: Date.now(), fullName, email, password: hashedPassword };
  db.get('users').push(newUser).write();

  const accessToken = jwt.sign({ sub: newUser.id, email }, SECRET, { expiresIn: '7d' });
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ accessToken, user: userWithoutPassword });
});

server.post('/login', (req, res) => {
  const db = router.db;
  const { email, password } = req.body;

  const user = db.get('users').find({ email }).value();
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const accessToken = jwt.sign({ sub: user.id, email }, SECRET, { expiresIn: '7d' });
  const { password: _, ...userWithoutPassword } = user;
  res.json({ accessToken, user: userWithoutPassword });
});

server.use(router);

server.listen(3001, () => {
  console.log('API running on http://localhost:3001');
});