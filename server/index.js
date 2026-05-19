const express = require('express');
const cors = require('cors');
const http = require('http');           // ← new
require('dotenv').config();

const { setupWebSocket } = require('./ws');  // ← new

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const binRoutes = require('./routes/bins');
const webhookRoutes = require('./routes/webhook');

app.use('/api/bins', binRoutes);
app.use('/hook', webhookRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'WebhookBin server is running' });
});

// Create HTTP server and attach WebSocket to it
const server = http.createServer(app);    // ← new
setupWebSocket(server);                   // ← new

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {              // ← changed app.listen to server.listen
  console.log(`Server running on port ${PORT}`);
});