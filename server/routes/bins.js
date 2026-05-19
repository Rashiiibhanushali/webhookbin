const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/bins — create a new bin (generate a unique webhook URL)
router.post('/', async (req, res) => {
  try {
    const result = await pool.query(
      'INSERT INTO bins DEFAULT VALUES RETURNING *'
    );
    const bin = result.rows[0];
    res.status(201).json({
      bin_id: bin.id,
      webhook_url: `${process.env.BASE_URL}/hook/${bin.id}`,
      created_at: bin.created_at
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to create bin' });
  }
});

// GET /api/bins/:id — fetch a bin + all its requests
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check bin exists
    const binResult = await pool.query('SELECT * FROM bins WHERE id = $1', [id]);
    if (binResult.rows.length === 0) {
      return res.status(404).json({ error: 'Bin not found' });
    }

    // Get all requests for this bin, newest first
    const requestsResult = await pool.query(
      'SELECT * FROM requests WHERE bin_id = $1 ORDER BY received_at DESC',
      [id]
    );

    res.json({
      bin: binResult.rows[0],
      requests: requestsResult.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch bin' });
  }
});

module.exports = router;