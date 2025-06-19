const express = require('express');
const db = require('../utils/database');

const router = express.Router();

// Get all credit cards
router.get('/', async (req, res) => {
  try {
    const cards = await db.all('SELECT * FROM credit_cards ORDER BY annual_fee ASC');
    res.json(cards);
  } catch (error) {
    console.error('Get cards error:', error);
    res.status(500).json({ error: 'Failed to fetch credit cards' });
  }
});

// Get a specific credit card by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const card = await db.get('SELECT * FROM credit_cards WHERE id = ?', [id]);

    if (!card) {
      return res.status(404).json({ error: 'Credit card not found' });
    }

    res.json(card);
  } catch (error) {
    console.error('Get card error:', error);
    res.status(500).json({ error: 'Failed to fetch credit card' });
  }
});

// Search credit cards by criteria
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const searchTerm = `%${query}%`;

    const cards = await db.all(
      `SELECT * FROM credit_cards 
       WHERE name LIKE ? OR issuer LIKE ? OR reward_type LIKE ? OR special_perks LIKE ?
       ORDER BY annual_fee ASC`,
      [searchTerm, searchTerm, searchTerm, searchTerm]
    );

    res.json(cards);
  } catch (error) {
    console.error('Search cards error:', error);
    res.status(500).json({ error: 'Failed to search credit cards' });
  }
});

// Get cards by reward type
router.get('/type/:rewardType', async (req, res) => {
  try {
    const { rewardType } = req.params;

    const cards = await db.all(
      'SELECT * FROM credit_cards WHERE reward_type LIKE ? ORDER BY annual_fee ASC',
      [`%${rewardType}%`]
    );

    res.json(cards);
  } catch (error) {
    console.error('Get cards by type error:', error);
    res.status(500).json({ error: 'Failed to fetch credit cards by type' });
  }
});

// Get cards by issuer
router.get('/issuer/:issuer', async (req, res) => {
  try {
    const { issuer } = req.params;

    const cards = await db.all(
      'SELECT * FROM credit_cards WHERE issuer LIKE ? ORDER BY annual_fee ASC',
      [`%${issuer}%`]
    );

    res.json(cards);
  } catch (error) {
    console.error('Get cards by issuer error:', error);
    res.status(500).json({ error: 'Failed to fetch credit cards by issuer' });
  }
});

module.exports = router; 