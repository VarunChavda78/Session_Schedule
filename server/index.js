const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Data storage files
const SESSIONS_FILE = path.join(__dirname, 'data', 'sessions.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
  } catch (error) {
    console.log('Data directory already exists');
  }
}

// Initialize default data
async function initializeData() {
  try {
    // Initialize sessions file
    try {
      await fs.access(SESSIONS_FILE);
    } catch {
      await fs.writeFile(SESSIONS_FILE, JSON.stringify([], null, 2));
    }

    // Initialize users file with default owner
    try {
      await fs.access(USERS_FILE);
      const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf8'));
      if (users.length === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const defaultOwner = {
          id: uuidv4(),
          username: 'owner',
          password: hashedPassword,
          role: 'owner',
          createdAt: new Date().toISOString()
        };
        await fs.writeFile(USERS_FILE, JSON.stringify([defaultOwner], null, 2));
        console.log('Default owner created: username: owner, password: admin123');
      }
    } catch {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const defaultOwner = {
        id: uuidv4(),
        username: 'owner',
        password: hashedPassword,
        role: 'owner',
        createdAt: new Date().toISOString()
      };
      await fs.writeFile(USERS_FILE, JSON.stringify([defaultOwner], null, 2));
      console.log('Default owner created: username: owner, password: admin123');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Owner-only middleware
const requireOwner = (req, res, next) => {
  if (req.user.role !== 'owner') {
    return res.status(403).json({ message: 'Owner access required' });
  }
  next();
};

// Routes

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf8'));
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all sessions (public)
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = JSON.parse(await fs.readFile(SESSIONS_FILE, 'utf8'));
    res.json(sessions);
  } catch (error) {
    console.error('Error reading sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new session (owner only)
app.post('/api/sessions', authenticateToken, requireOwner, async (req, res) => {
  try {
    const { title, description, time, date, presenter } = req.body;
    
    if (!title || !time || !date) {
      return res.status(400).json({ message: 'Title, time, and date are required' });
    }

    const sessions = JSON.parse(await fs.readFile(SESSIONS_FILE, 'utf8'));
    
    const newSession = {
      id: uuidv4(),
      title,
      description: description || '',
      time,
      date,
      presenter: presenter || '',
      createdBy: req.user.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    sessions.push(newSession);
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));

    res.status(201).json(newSession);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update session (owner only)
app.put('/api/sessions/:id', authenticateToken, requireOwner, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, time, date, presenter } = req.body;

    const sessions = JSON.parse(await fs.readFile(SESSIONS_FILE, 'utf8'));
    const sessionIndex = sessions.findIndex(s => s.id === id);

    if (sessionIndex === -1) {
      return res.status(404).json({ message: 'Session not found' });
    }

    sessions[sessionIndex] = {
      ...sessions[sessionIndex],
      title: title || sessions[sessionIndex].title,
      description: description !== undefined ? description : sessions[sessionIndex].description,
      time: time || sessions[sessionIndex].time,
      date: date || sessions[sessionIndex].date,
      presenter: presenter !== undefined ? presenter : sessions[sessionIndex].presenter,
      updatedAt: new Date().toISOString()
    };

    await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
    res.json(sessions[sessionIndex]);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete session (owner only)
app.delete('/api/sessions/:id', authenticateToken, requireOwner, async (req, res) => {
  try {
    const { id } = req.params;

    const sessions = JSON.parse(await fs.readFile(SESSIONS_FILE, 'utf8'));
    const sessionIndex = sessions.findIndex(s => s.id === id);

    if (sessionIndex === -1) {
      return res.status(404).json({ message: 'Session not found' });
    }

    sessions.splice(sessionIndex, 1);
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2));

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    role: req.user.role
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Thursday Session API is running' });
});

// Start server
async function startServer() {
  await ensureDataDir();
  await initializeData();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
}

startServer(); 