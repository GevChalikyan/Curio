// server.js
const initializeDatabase = require('./db/init-db');
const createDefaultUser = require('./utils/default-user');



const express = require('express');
const cors = require('cors');

const app = express();
const authRouter = require('./utils/auth');
const validateToken = require('./middleware/validate-token');

// --- Middleware ---

// Allow CORS from any origin (for development).
// In production, you can lock this down to your extension's origin:
//  { origin: 'chrome-extension://<your-extension-id>' }
app.use(cors());

// Parse incoming JSON bodies
app.use(express.json());


// --- Endpoints ---
app.use('/api/auth', authRouter)
app.get('/api/protected', validateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}!`})
});



// --- Test Endpoints ---

// Simple GET to confirm server is alive
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.get('/protected-ping', validateToken, (req, res) => {
  res.json({ message: 'pong' });
});

// Echo back whatever you POST, so your extension can verify payloads
app.post('/echo', (req, res) => {
  res.json({
    received: req.body,
    timestamp: Date.now()
  });
});



(async () => {
  try {
    await initializeDatabase();
    await createDefaultUser();

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup failed: ', err);
    process.exit(1);
  }
})();