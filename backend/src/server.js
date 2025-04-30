// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// --- Middleware ---

// Allow CORS from any origin (for development).
// In production, you can lock this down to your extension's origin:
//  { origin: 'chrome-extension://<your-extension-id>' }
app.use(cors());

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

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});