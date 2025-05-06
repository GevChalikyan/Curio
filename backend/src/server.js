// server.js
require('dotenv').config();
const initializeDatabase = require('./db/init-db');
const createDefaultUser = require('./utils/default-user');



const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // needed for OpenRouter call

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

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat-v3-0324:free',
        messages: [{ role: 'user', content: message }]
      })
    });

    const text = await response.text();
    console.log("OpenRouter raw response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      return res.status(500).json({ error: 'Invalid JSON from OpenRouter', raw: text });
    }

    const reply = data.choices?.[0]?.message?.content || 'No reply received';
    res.json({ reply });

  } catch (error) {
    console.error('OpenRouter error:', error);
    res.status(500).json({ error: 'OpenRouter API request failed' });
  }
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