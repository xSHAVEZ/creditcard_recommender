const express = require('express');
const RecommendationEngine = require('../services/recommendationEngine');
const db = require('../utils/database');

const router = express.Router();
const recommendationEngine = new RecommendationEngine();

// Get personalized recommendations based on user data
router.post('/', async (req, res) => {
  try {
    const userData = req.body;

    if (!userData) {
      return res.status(400).json({ error: 'User data is required' });
    }

    const recommendations = await recommendationEngine.getRecommendations(userData);

    res.json({
      recommendations,
      userData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Get recommendations for a specific session
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await db.get('SELECT user_data FROM user_sessions WHERE id = ?', [sessionId]);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const userData = JSON.parse(session.user_data || '{}');
    const recommendations = await recommendationEngine.getRecommendations(userData);

    res.json({
      recommendations,
      userData,
      sessionId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get session recommendations error:', error);
    res.status(500).json({ error: 'Failed to get session recommendations' });
  }
});

// Compare specific credit cards
router.post('/compare', async (req, res) => {
  try {
    const { cardIds } = req.body;

    if (!cardIds || !Array.isArray(cardIds) || cardIds.length < 2) {
      return res.status(400).json({ error: 'At least 2 card IDs are required for comparison' });
    }

    const placeholders = cardIds.map(() => '?').join(',');
    const cards = await db.all(
      `SELECT * FROM credit_cards WHERE id IN (${placeholders}) ORDER BY annual_fee ASC`,
      cardIds
    );

    if (cards.length !== cardIds.length) {
      return res.status(404).json({ error: 'One or more credit cards not found' });
    }

    // Add comparison metrics
    const comparison = cards.map(card => ({
      ...card,
      valueScore: calculateValueScore(card),
      featureScore: calculateFeatureScore(card)
    }));

    res.json({
      comparison,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Compare cards error:', error);
    res.status(500).json({ error: 'Failed to compare credit cards' });
  }
});

// Helper functions for comparison
function calculateValueScore(card) {
  let score = 0;
  
  // Reward type scoring
  if (card.reward_type.toLowerCase().includes('cashback')) score += 30;
  else if (card.reward_type.toLowerCase().includes('points')) score += 25;
  else if (card.reward_type.toLowerCase().includes('miles')) score += 20;
  
  // Fee scoring (lower is better)
  if (card.annual_fee === 0) score += 25;
  else if (card.annual_fee <= 1000) score += 20;
  else if (card.annual_fee <= 2000) score += 15;
  else score += 10;
  
  // Perks scoring
  const perks = card.special_perks.toLowerCase();
  if (perks.includes('lounge')) score += 15;
  if (perks.includes('insurance')) score += 10;
  if (perks.includes('concierge')) score += 10;
  if (perks.includes('voucher')) score += 8;
  
  return Math.min(100, score);
}

function calculateFeatureScore(card) {
  let score = 0;
  
  // Count features
  const features = [
    'lounge', 'insurance', 'concierge', 'voucher', 'discount', 
    'waiver', 'privilege', 'access', 'service'
  ];
  
  features.forEach(feature => {
    if (card.special_perks.toLowerCase().includes(feature)) {
      score += 10;
    }
  });
  
  return Math.min(100, score);
}

module.exports = router; 