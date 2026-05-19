const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const binRoutes = require('./routes/bins');
app.use('/api/bins', binRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'WebhookBin server is running' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});