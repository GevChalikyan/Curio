// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---

// Allow CORS from any origin (for development).
// In production, you can lock this down to your extension's origin:
//  { origin: 'chrome-extension://<your-extension-id>' }
const allowed = ['chrome-extension://akcenmkkdbgobaaoplbgpmbijfpahapc'];
app.use(cors({
  origin: (origin, cb) => cb(null, allowed.includes(origin)),
  methods: ['GET','POST']
}));

// Parse incoming JSON bodies
app.use(express.json());

// --- Test Endpoints ---

// Simple GET to confirm server is alive
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Echo back whatever you POST, so your extension can verify payloads
app.post('/echo', (req, res) => {
  res.json({
    received: req.body,
    timestamp: Date.now()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
