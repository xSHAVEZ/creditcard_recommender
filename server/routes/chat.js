const express = require('express');
const { v4: uuidv4 } = require('uuid');
const AIService = require('../services/aiService');
const db = require('../utils/database');

const router = express.Router();
const aiService = new AIService();

// Start a new chat session
router.post('/start', async (req, res) => {
  try {
    const sessionId = uuidv4();
    
    await db.run(
      'INSERT INTO user_sessions (id, user_data) VALUES (?, ?)',
      [sessionId, JSON.stringify({})]
    );

    res.json({ 
      sessionId,
      message: "Hi! I'm your credit card recommendation assistant. Let me help you find the perfect credit card. To get started, could you tell me about your monthly income?"
    });
  } catch (error) {
    console.error('Chat start error:', error);
    res.status(500).json({ error: 'Failed to start chat session' });
  }
});

// Send a message to the AI assistant
router.post('/message', async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Session ID and message are required' });
    }

    // Get existing user data
    const session = await db.get('SELECT user_data FROM user_sessions WHERE id = ?', [sessionId]);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const userData = JSON.parse(session.user_data || '{}');

    // Process message with AI
    const aiResponse = await aiService.chat(sessionId, message, userData);

    // Update user data in database
    await db.run(
      'UPDATE user_sessions SET user_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [JSON.stringify(aiResponse.userData), sessionId]
    );

    res.json({
      message: aiResponse.message,
      userData: aiResponse.userData,
      isComplete: aiResponse.isComplete
    });

  } catch (error) {
    console.error('Chat message error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get chat history for a session
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await db.get('SELECT user_data FROM user_sessions WHERE id = ?', [sessionId]);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      userData: JSON.parse(session.user_data || '{}')
    });

  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ error: 'Failed to get chat history' });
  }
});

module.exports = router; 