const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const { setupWebSocket } = require('./ws');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST']
}));

app.use(express.json());

// Routes
const binRoutes = require('./routes/bins');
const webhookRoutes = require('./routes/webhook');

app.use('/api/bins', binRoutes);
app.use('/hook', webhookRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'WebhookBin server is running' });
});

const server = http.createServer(app);
setupWebSocket(server);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});