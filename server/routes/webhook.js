const express = require('express');
const router = express.Router();
const pool = require('../db');
const { broadcastTobin } = require('../ws');   // ← new

// POST /hook/:bin_id
router.post('/:bin_id', async (req, res) => {
  try {
    const { bin_id } = req.params;

    const binResult = await pool.query('SELECT * FROM bins WHERE id = $1', [bin_id]);
    if (binResult.rows.length === 0) {
      return res.status(404).json({ error: 'Bin not found' });
    }

    const method = req.method;
    const headers = req.headers;
    const body = req.body;
    const query_params = req.query;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const result = await pool.query(
      `INSERT INTO requests (bin_id, method, headers, body, query_params, ip)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [bin_id, method, headers, body, query_params, ip]
    );

    const savedRequest = result.rows[0];

    // Push to all browser clients watching this bin
    broadcastTobin(bin_id, savedRequest);      // ← new

    res.status(200).json({ 
      message: 'Webhook received',
      request_id: savedRequest.id 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to capture webhook' });
  }
});

// GET /hook/:bin_id (keep this exactly as before)
router.get('/:bin_id', async (req, res) => {
  try {
    const { bin_id } = req.params;
    const binResult = await pool.query('SELECT * FROM bins WHERE id = $1', [bin_id]);
    if (binResult.rows.length === 0) {
      return res.status(404).json({ error: 'Bin not found' });
    }

    const method = req.method;
    const headers = req.headers;
    const body = {};
    const query_params = req.query;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    await pool.query(
      `INSERT INTO requests (bin_id, method, headers, body, query_params, ip)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [bin_id, method, headers, body, query_params, ip]
    );

    res.status(200).json({ message: 'Webhook received' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to capture webhook' });
  }
});

module.exports = router;