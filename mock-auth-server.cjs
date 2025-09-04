const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock users database
const users = {
  'admin': {
    id: '1',
    username: 'admin',
    password: 'password',
    role: 'ADMIN',
    permissions: ['READ', 'WRITE', 'DELETE', 'MANAGE_USERS']
  },
  'user': {
    id: '2', 
    username: 'user',
    password: 'password',
    role: 'USER',
    permissions: ['READ']
  },
  'manager': {
    id: '3',
    username: 'manager', 
    password: 'password',
    role: 'MANAGER',
    permissions: ['READ', 'WRITE']
  }
};

// Generate mock JWT token
const generateToken = (user) => {
  const payload = {
    sub: user.id,
    username: user.username,
    role: user.role,
    permissions: user.permissions,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  // Mock JWT (just base64 encoded payload for testing)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadEncoded = btoa(JSON.stringify(payload));
  const signature = 'mock-signature';
  
  return `${header}.${payloadEncoded}.${signature}`;
};

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  console.log('🔐 Login attempt:', req.body);
  
  const { username, password } = req.body;
  
  // Validate required fields
  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required',
      success: false
    });
  }
  
  // Find user
  const user = users[username.toLowerCase()];
  
  if (!user || user.password !== password) {
    console.log('❌ Invalid credentials for:', username);
    return res.status(401).json({
      message: 'Invalid credentials',
      success: false
    });
  }
  
  // Generate token
  const token = generateToken(user);
  
  console.log('✅ Login successful for:', username, 'Role:', user.role);
  
  res.json({
    access_token: token,
    user: {
      id: user.id,
      username: user.username,
      email: `${user.username}@example.com`,
      roles: [user.role],
      permissions: user.permissions
    }
  });
});

// Token validation endpoint
app.get('/api/auth/validate', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'No token provided',
      success: false
    });
  }
  
  const token = authHeader.substring(7);
  
  try {
    // Simple token validation (decode base64 payload)
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({
        message: 'Token expired',
        success: false
      });
    }
    
    console.log('✅ Token validated for:', payload.username);
    
    res.json({
      id: payload.sub,
      username: payload.username,
      email: `${payload.username}@example.com`,
      roles: [payload.role],
      permissions: payload.permissions
    });
    
  } catch (error) {
    console.log('❌ Token validation failed:', error.message);
    res.status(401).json({
      message: 'Invalid token',
      success: false
    });
  }
});

// User profile endpoint
app.get('/api/auth/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'No token provided',
      success: false
    });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    
    res.json({
      id: payload.sub,
      username: payload.username,
      email: `${payload.username}@example.com`,
      roles: [payload.role],
      permissions: payload.permissions
    });
    
  } catch (error) {
    res.status(401).json({
      message: 'Invalid token',
      success: false
    });
  }
});

// Health check
app.get('/api/auth/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'mock-auth-server',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: 'Internal server error',
    success: false
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock Auth Server running on http://localhost:${PORT}`);
  console.log('📝 Available users:');
  Object.values(users).forEach(user => {
    console.log(`   - ${user.username} / ${user.password} (${user.role})`);
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down mock auth server...');
  process.exit(0);
});
