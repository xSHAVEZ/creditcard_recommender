const OpenAI = require('openai');

// Initialize OpenAI only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

class AIService {
  constructor() {
    this.systemPrompt = `You are a helpful credit card recommendation assistant for the Indian market. Your role is to:

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

Be friendly, professional, and ask one question at a time. Keep responses concise and engaging.`;

    this.conversationHistory = new Map();
    this.conversationFlow = [
      {
        trigger: 'income',
        response: "Great! Now, could you tell me about your spending habits? Which categories do you spend the most on? (e.g., fuel, travel, groceries, dining, online shopping)"
      },
      {
        trigger: 'spending',
        response: "Perfect! What type of benefits are you most interested in? (e.g., cashback, travel points, lounge access, insurance, dining privileges)"
      },
      {
        trigger: 'benefits',
        response: "Excellent! Do you have any existing credit cards? And what's your approximate credit score? (You can say 'unknown' if you're not sure)"
      },
      {
        trigger: 'credit',
        response: "Thank you for sharing that information! Based on your profile, I'll now provide you with personalized credit card recommendations. Let me analyze the best options for you..."
      }
    ];
  }

  async chat(sessionId, userMessage, userData = {}) {
    try {
      // Get or create conversation history
      let history = this.conversationHistory.get(sessionId) || [];
      
      // Add system message if this is the first message
      if (history.length === 0) {
        history.push({
          role: 'system',
          content: this.systemPrompt
        });
      }

      // Add user message to history
      history.push({
        role: 'user',
        content: userMessage
      });

      let assistantMessage;

      // Try OpenAI first if available
      if (openai) {
        try {
          const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: history,
            max_tokens: 500,
            temperature: 0.7,
          });
          assistantMessage = completion.choices[0].message.content;
        } catch (error) {
          console.log('OpenAI API not available, using fallback responses');
          assistantMessage = this.getFallbackResponse(userMessage, userData);
        }
      } else {
        // Use fallback response system
        assistantMessage = this.getFallbackResponse(userMessage, userData);
      }

      // Add assistant response to history
      history.push({
        role: 'assistant',
        content: assistantMessage
      });

      // Keep only last 10 messages to manage context
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

    } catch (error) {
      console.error('AI Service Error:', error);
      // Return a fallback response instead of throwing error
      return {
        message: this.getFallbackResponse(userMessage, userData),
        userData: this.extractUserData(userMessage, userData),
        isComplete: false
      };
    }
  }

  getFallbackResponse(userMessage, userData) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check what information we have and what we need next
    const hasIncome = userData.monthlyIncome;
    const hasSpendingHabits = userData.spendingHabits && Object.keys(userData.spendingHabits).length > 0;
    const hasBenefits = userData.preferredBenefits && userData.preferredBenefits.length > 0;
    const hasCreditInfo = userData.creditScore || userData.existingCards;
    
    // Check if this is an income response (first question)
    if (!hasIncome && this.extractUserData(userMessage, userData).monthlyIncome) {
      return "Great! Now, could you tell me about your spending habits? Which categories do you spend the most on? (e.g., fuel, travel, groceries, dining, online shopping)";
    }
    
    // Check if this is about spending habits (second question)
    if (hasIncome && !hasSpendingHabits && 
        (lowerMessage.includes('fuel') || lowerMessage.includes('travel') || lowerMessage.includes('groceries') || 
         lowerMessage.includes('dining') || lowerMessage.includes('shopping') || lowerMessage.includes('online'))) {
      return "Perfect! What type of benefits are you most interested in? (e.g., cashback, travel points, lounge access, insurance, dining privileges)";
    }
    
    // Check if this is about benefits (third question)
    if (hasIncome && hasSpendingHabits && !hasBenefits &&
        (lowerMessage.includes('cashback') || lowerMessage.includes('points') || lowerMessage.includes('miles') || 
         lowerMessage.includes('lounge') || lowerMessage.includes('insurance') || lowerMessage.includes('privileges'))) {
      return "Excellent! Do you have any existing credit cards? And what's your approximate credit score? (You can say 'unknown' if you're not sure)";
    }
    
    // Check if this is about credit score or existing cards (fourth question)
    if (hasIncome && hasSpendingHabits && hasBenefits && !hasCreditInfo &&
        (lowerMessage.includes('credit') || lowerMessage.includes('score') || lowerMessage.includes('card') || 
         lowerMessage.includes('unknown') || /\d{3}/.test(userMessage))) {
      return "Thank you for sharing that information! Based on your profile, I'll now provide you with personalized credit card recommendations. Let me analyze the best options for you...";
    }
    
    // If we have all information, provide recommendations
    if (hasIncome && hasSpendingHabits && hasBenefits && hasCreditInfo) {
      return "Perfect! I have all the information I need. Let me provide you with personalized credit card recommendations based on your profile. You can view the recommendations on the Recommendations page!";
    }
    
    // If we have income but not spending habits, ask about spending
    if (hasIncome && !hasSpendingHabits) {
      return "Great! Now, could you tell me about your spending habits? Which categories do you spend the most on? (e.g., fuel, travel, groceries, dining, online shopping)";
    }
    
    // If we have income and spending but not benefits, ask about benefits
    if (hasIncome && hasSpendingHabits && !hasBenefits) {
      return "Perfect! What type of benefits are you most interested in? (e.g., cashback, travel points, lounge access, insurance, dining privileges)";
    }
    
    // If we have income, spending, and benefits but not credit info, ask about credit
    if (hasIncome && hasSpendingHabits && hasBenefits && !hasCreditInfo) {
      return "Excellent! Do you have any existing credit cards? And what's your approximate credit score? (You can say 'unknown' if you're not sure)";
    }
    
    // Default response for first question
    return "I understand! Could you please tell me about your monthly income so I can provide better recommendations?";
  }

  extractUserData(message, existingData = {}) {
    const data = { ...existingData };
    const lowerMessage = message.toLowerCase();

    // Extract income information
    const incomeMatch = lowerMessage.match(/(?:income|salary|earn).*?(\d+(?:\.\d+)?)\s*(?:lakh|lac|l|k|thousand)/i);
    if (incomeMatch) {
      const value = parseFloat(incomeMatch[1]);
      if (lowerMessage.includes('lakh') || lowerMessage.includes('lac') || lowerMessage.includes('l')) {
        data.monthlyIncome = value * 100000 / 12;
      } else if (lowerMessage.includes('k') || lowerMessage.includes('thousand')) {
        data.monthlyIncome = value * 1000;
      }
    } else {
      // Try to extract just a number as income
      const simpleIncomeMatch = lowerMessage.match(/(\d{4,5})/);
      if (simpleIncomeMatch && !data.monthlyIncome) {
        data.monthlyIncome = parseInt(simpleIncomeMatch[1]);
      }
    }

    // Extract spending categories
    const spendingCategories = ['fuel', 'travel', 'groceries', 'dining', 'online', 'shopping'];
    spendingCategories.forEach(category => {
      if (lowerMessage.includes(category)) {
        data.spendingHabits = data.spendingHabits || {};
        data.spendingHabits[category] = true;
      }
    });

    // Extract preferred benefits
    const benefits = ['cashback', 'points', 'miles', 'lounge', 'travel', 'rewards', 'insurance', 'privileges'];
    benefits.forEach(benefit => {
      if (lowerMessage.includes(benefit)) {
        data.preferredBenefits = data.preferredBenefits || [];
        if (!data.preferredBenefits.includes(benefit)) {
          data.preferredBenefits.push(benefit);
        }
      }
    });

    // Extract credit score
    const creditScoreMatch = lowerMessage.match(/(?:credit score|score).*?(\d{3})/i);
    if (creditScoreMatch) {
      data.creditScore = parseInt(creditScoreMatch[1]);
    } else {
      // Try to extract just a 3-digit number as credit score
      const simpleScoreMatch = lowerMessage.match(/(\d{3})/);
      if (simpleScoreMatch && !data.creditScore && !data.monthlyIncome) {
        data.creditScore = parseInt(simpleScoreMatch[1]);
      }
    }

    // Extract existing cards information
    if (lowerMessage.includes('card') || lowerMessage.includes('existing') || lowerMessage.includes('have')) {
      data.existingCards = true;
    }

    // Extract "unknown" for credit score
    if (lowerMessage.includes('unknown') || lowerMessage.includes('not sure')) {
      data.creditScore = 'unknown';
    }

    return data;
  }

  isConversationComplete(history) {
    const lastMessage = history[history.length - 1]?.content?.toLowerCase() || '';
    
    // Check if the AI has provided recommendations or concluded the conversation
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

  generateRecommendationPrompt(userData) {
    return `Based on the following user profile, recommend the best 3-5 credit cards:

User Profile:
- Monthly Income: ${userData.monthlyIncome ? `₹${userData.monthlyIncome.toLocaleString()}` : 'Not specified'}
- Spending Habits: ${userData.spendingHabits ? Object.keys(userData.spendingHabits).join(', ') : 'Not specified'}
- Preferred Benefits: ${userData.preferredBenefits ? userData.preferredBenefits.join(', ') : 'Not specified'}
- Credit Score: ${userData.creditScore || 'Not specified'}

Please provide specific recommendations with reasons why each card would be suitable for this user.`;
  }
}

module.exports = AIService; 