# 🤖 AI Agent Flow & Prompt Design Documentation

## Overview

The AI-powered credit card recommendation system uses a conversational agent to gather user information and provide personalized recommendations. The system works with or without OpenAI API, using intelligent fallback responses when the API is unavailable.

## 🎯 Conversation Flow Design

### 1. Initial Greeting & Income Assessment
**Trigger**: User starts a new chat session
**Question**: "Hi! I'm your credit card recommendation assistant. Let me help you find the perfect credit card. To get started, could you tell me about your monthly income?"

**Purpose**: 
- Establish baseline for card eligibility
- Determine spending capacity
- Filter cards based on income requirements

**Expected Response**: 
- Numeric value (e.g., "50000", "75000")
- Income with units (e.g., "50k", "5 lakhs")

**Data Extraction**:
```javascript
const incomeMatch = message.match(/(\d{4,5})/);
// or
const incomeMatch = message.match(/(?:income|salary|earn).*?(\d+(?:\.\d+)?)\s*(?:lakh|lac|l|k|thousand)/i);
```

### 2. Spending Habits Analysis
**Trigger**: User provides income information
**Question**: "Great! Now, could you tell me about your spending habits? Which categories do you spend the most on? (e.g., fuel, travel, groceries, dining, online shopping)"

**Purpose**:
- Identify spending patterns
- Match cards with reward categories
- Calculate potential rewards

**Expected Response**:
- Spending categories (e.g., "fuel, travel", "groceries and dining")
- Natural language descriptions

**Data Extraction**:
```javascript
const spendingCategories = ['fuel', 'travel', 'groceries', 'dining', 'online', 'shopping'];
spendingCategories.forEach(category => {
  if (lowerMessage.includes(category)) {
    data.spendingHabits[category] = true;
  }
});
```

### 3. Benefits Preference Assessment
**Trigger**: User provides spending habits
**Question**: "Perfect! What type of benefits are you most interested in? (e.g., cashback, travel points, lounge access, insurance, dining privileges)"

**Purpose**:
- Understand user's reward preferences
- Align recommendations with desired benefits
- Prioritize cards with preferred features

**Expected Response**:
- Benefit types (e.g., "cashback", "lounge access")
- Multiple preferences

**Data Extraction**:
```javascript
const benefits = ['cashback', 'points', 'miles', 'lounge', 'travel', 'rewards', 'insurance', 'privileges'];
benefits.forEach(benefit => {
  if (lowerMessage.includes(benefit)) {
    data.preferredBenefits.push(benefit);
  }
});
```

### 4. Credit Profile Assessment
**Trigger**: User provides benefit preferences
**Question**: "Excellent! Do you have any existing credit cards? And what's your approximate credit score? (You can say 'unknown' if you're not sure)"

**Purpose**:
- Assess creditworthiness
- Understand existing relationships
- Filter cards based on credit requirements

**Expected Response**:
- Credit score (e.g., "750", "800")
- Existing cards (e.g., "yes, I have 2 cards", "no cards")
- Unknown status

**Data Extraction**:
```javascript
const creditScoreMatch = message.match(/(\d{3})/);
if (lowerMessage.includes('unknown') || lowerMessage.includes('not sure')) {
  data.creditScore = 'unknown';
}
if (lowerMessage.includes('card') || lowerMessage.includes('existing')) {
  data.existingCards = true;
}
```

### 5. Recommendation Generation
**Trigger**: User provides credit information
**Response**: "Thank you for sharing that information! Based on your profile, I'll now provide you with personalized credit card recommendations. Let me analyze the best options for you..."

**Purpose**:
- Signal completion of data collection
- Prepare user for recommendations
- Transition to recommendation engine

## 🧠 Prompt Design Architecture

### System Prompt
```
You are a helpful credit card recommendation assistant for the Indian market. Your role is to:

1. Ask relevant questions to understand the user's financial profile and preferences
2. Guide them through a conversational flow to gather necessary information
3. Provide personalized credit card recommendations based on their needs

Key information to collect:
- Monthly income
- Spending habits (fuel, travel, groceries, dining, online shopping)
- Preferred benefits (cashback, travel points, lounge access, etc.)
- Existing credit cards (if any)
- Approximate credit score (or allow "unknown")
- Annual spending patterns

Be friendly, professional, and ask one question at a time. Keep responses concise and engaging.
```

### Fallback Response System

When OpenAI API is unavailable, the system uses intelligent fallback responses:

#### Response Logic
```javascript
function getFallbackResponse(userMessage, userData) {
  const hasIncome = userData.monthlyIncome;
  const hasSpendingHabits = userData.spendingHabits && Object.keys(userData.spendingHabits).length > 0;
  const hasBenefits = userData.preferredBenefits && userData.preferredBenefits.length > 0;
  const hasCreditInfo = userData.creditScore || userData.existingCards;
  
  // Progressive questioning based on collected data
  if (!hasIncome && extractIncome(userMessage)) {
    return "Great! Now, could you tell me about your spending habits?";
  }
  
  if (hasIncome && !hasSpendingHabits && mentionsSpending(userMessage)) {
    return "Perfect! What type of benefits are you most interested in?";
  }
  
  // ... continue through all stages
}
```

#### Response Templates
1. **Income Response**: "Great! Now, could you tell me about your spending habits? Which categories do you spend the most on? (e.g., fuel, travel, groceries, dining, online shopping)"

2. **Spending Response**: "Perfect! What type of benefits are you most interested in? (e.g., cashback, travel points, lounge access, insurance, dining privileges)"

3. **Benefits Response**: "Excellent! Do you have any existing credit cards? And what's your approximate credit score? (You can say 'unknown' if you're not sure)"

4. **Credit Response**: "Thank you for sharing that information! Based on your profile, I'll now provide you with personalized credit card recommendations. Let me analyze the best options for you..."

5. **Completion Response**: "Perfect! I have all the information I need. Let me provide you with personalized credit card recommendations based on your profile. You can view the recommendations on the Recommendations page!"

## 🔄 Conversation State Management

### Session Management
```javascript
class AIService {
  constructor() {
    this.conversationHistory = new Map(); // sessionId -> message history
  }
  
  async chat(sessionId, userMessage, userData = {}) {
    let history = this.conversationHistory.get(sessionId) || [];
    
    // Add system message if first message
    if (history.length === 0) {
      history.push({ role: 'system', content: this.systemPrompt });
    }
    
    // Add user message
    history.push({ role: 'user', content: userMessage });
    
    // Generate response
    const assistantMessage = await this.generateResponse(history, userData);
    
    // Add assistant response
    history.push({ role: 'assistant', content: assistantMessage });
    
    // Keep only last 10 messages
    if (history.length > 10) {
      history = history.slice(-10);
    }
    
    // Update conversation history
    this.conversationHistory.set(sessionId, history);
    
    return {
      message: assistantMessage,
      userData: this.extractUserData(userMessage, userData),
      isComplete: this.isConversationComplete(history)
    };
  }
}
```

### Data Persistence
- User data is stored in SQLite database
- Session information persists across conversations
- Data is updated with each user response

## 📊 Data Extraction Logic

### Income Extraction
```javascript
function extractIncome(message) {
  // Pattern 1: Simple numbers (4-5 digits)
  const simpleMatch = message.match(/(\d{4,5})/);
  if (simpleMatch) return parseInt(simpleMatch[1]);
  
  // Pattern 2: Income with units
  const incomeMatch = message.match(/(?:income|salary|earn).*?(\d+(?:\.\d+)?)\s*(?:lakh|lac|l|k|thousand)/i);
  if (incomeMatch) {
    const value = parseFloat(incomeMatch[1]);
    if (message.includes('lakh') || message.includes('lac') || message.includes('l')) {
      return value * 100000 / 12; // Convert to monthly
    } else if (message.includes('k') || message.includes('thousand')) {
      return value * 1000;
    }
  }
  
  return null;
}
```

### Spending Categories Extraction
```javascript
function extractSpendingHabits(message) {
  const categories = ['fuel', 'travel', 'groceries', 'dining', 'online', 'shopping'];
  const habits = {};
  
  categories.forEach(category => {
    if (message.toLowerCase().includes(category)) {
      habits[category] = true;
    }
  });
  
  return habits;
}
```

### Benefits Extraction
```javascript
function extractBenefits(message) {
  const benefits = ['cashback', 'points', 'miles', 'lounge', 'travel', 'rewards', 'insurance', 'privileges'];
  const preferences = [];
  
  benefits.forEach(benefit => {
    if (message.toLowerCase().includes(benefit)) {
      preferences.push(benefit);
    }
  });
  
  return preferences;
}
```

### Credit Information Extraction
```javascript
function extractCreditInfo(message) {
  const data = {};
  
  // Extract credit score
  const scoreMatch = message.match(/(\d{3})/);
  if (scoreMatch) {
    data.creditScore = parseInt(scoreMatch[1]);
  }
  
  // Check for "unknown" or "not sure"
  if (message.toLowerCase().includes('unknown') || message.toLowerCase().includes('not sure')) {
    data.creditScore = 'unknown';
  }
  
  // Check for existing cards
  if (message.toLowerCase().includes('card') || message.toLowerCase().includes('existing') || message.toLowerCase().includes('have')) {
    data.existingCards = true;
  }
  
  return data;
}
```

## 🎯 Conversation Completion Detection

### Completion Indicators
```javascript
function isConversationComplete(history) {
  const lastMessage = history[history.length - 1]?.content?.toLowerCase() || '';
  
  const completionIndicators = [
    'recommendation',
    'suggest',
    'best card',
    'here are',
    'based on',
    'consider',
    'perfect for you'
  ];

  return completionIndicators.some(indicator => lastMessage.includes(indicator));
}
```

## 🔧 Error Handling & Fallbacks

### OpenAI API Fallback
```javascript
async chat(sessionId, userMessage, userData = {}) {
  try {
    if (openai) {
      // Try OpenAI first
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: history,
        max_tokens: 500,
        temperature: 0.7,
      });
      return completion.choices[0].message.content;
    }
  } catch (error) {
    console.log('OpenAI API not available, using fallback responses');
  }
  
  // Use fallback response system
  return this.getFallbackResponse(userMessage, userData);
}
```

### Graceful Error Handling
```javascript
catch (error) {
  console.error('AI Service Error:', error);
  // Return fallback response instead of throwing error
  return {
    message: this.getFallbackResponse(userMessage, userData),
    userData: this.extractUserData(userMessage, userData),
    isComplete: false
  };
}
```

## 📈 Performance Optimization

### Conversation History Management
- Keep only last 10 messages to manage context
- Clear old sessions periodically
- Use Map for O(1) session lookup

### Response Caching
- Cache common responses for faster replies
- Implement response templates for consistency
- Use intelligent fallbacks to reduce API calls

## 🔒 Security Considerations

### Input Sanitization
- Validate all user inputs
- Sanitize messages before processing
- Prevent injection attacks

### Rate Limiting
- Implement rate limiting on chat endpoints
- Prevent abuse of AI service
- Monitor API usage

### Data Privacy
- Store only necessary user data
- Implement data retention policies
- Secure session management

## 🧪 Testing Strategy

### Unit Tests
- Test data extraction functions
- Validate conversation flow logic
- Test fallback response system

### Integration Tests
- Test complete conversation flows
- Validate API responses
- Test error handling scenarios

### User Acceptance Tests
- Test with real user scenarios
- Validate recommendation accuracy
- Test edge cases and error conditions

---

This documentation provides a comprehensive guide to the AI agent's conversation flow, prompt design, and implementation details. The system is designed to be robust, user-friendly, and capable of providing meaningful credit card recommendations even without external AI services. 