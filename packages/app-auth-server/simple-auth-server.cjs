const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'reki_admin' && password === 'Secure2025!@#') {
    res.json({
      access_token: 'jwt-token-reki-2025-secure',
      user: {
        id: '1',
        username: 'reki_admin',
        email: 'admin@reki.com',
        roles: ['ADMIN'],
        permissions: ['READ_ALL', 'WRITE_ALL']
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/validate', (req, res) => {
  const { token } = req.body;
  if (token === 'jwt-token-reki-2025-secure') {
    res.json({
      valid: true,
      user: {
        id: '1',
        username: 'reki_admin',
        email: 'admin@reki.com',
        roles: ['ADMIN'],
        permissions: ['READ_ALL', 'WRITE_ALL']
      }
    });
  } else {
    res.json({ valid: false, user: null });
  }
});

app.get('/api/auth/profile', (req, res) => {
  res.json({
    id: '1',
    username: 'reki_admin',
    email: 'admin@reki.com',
    roles: ['ADMIN'],
    permissions: ['READ_ALL', 'WRITE_ALL']
  });
});

app.listen(3001, () => {
  console.log('🚀 Auth server running on http://localhost:3001');
});
