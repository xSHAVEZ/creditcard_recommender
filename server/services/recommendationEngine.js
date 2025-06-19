const db = require('../utils/database');

class RecommendationEngine {
  constructor() {
    // No need to create a new database instance, use the singleton
  }

  async getRecommendations(userData) {
    try {
      // Get all credit cards
      const allCards = await db.all('SELECT * FROM credit_cards ORDER BY annual_fee ASC');
      
      // Filter and score cards based on user preferences
      const scoredCards = allCards.map(card => ({
        ...card,
        score: this.calculateCardScore(card, userData),
        reasons: this.generateReasons(card, userData),
        estimatedRewards: this.calculateEstimatedRewards(card, userData)
      }));

      // Sort by score and return top 5
      const topCards = scoredCards
        .filter(card => card.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      return topCards;

    } catch (error) {
      console.error('Recommendation Engine Error:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  calculateCardScore(card, userData) {
    let score = 0;

    // Income eligibility check
    if (userData.monthlyIncome) {
      const annualIncome = userData.monthlyIncome * 12;
      const incomeRequirement = this.extractIncomeRequirement(card.eligibility_criteria);
      
      if (incomeRequirement && annualIncome >= incomeRequirement) {
        score += 30; // High score for meeting income criteria
      } else if (incomeRequirement && annualIncome >= incomeRequirement * 0.8) {
        score += 20; // Medium score for close to meeting criteria
      } else if (incomeRequirement) {
        score -= 10; // Penalty for not meeting criteria
      }
    }

    // Credit score check
    if (userData.creditScore) {
      const creditRequirement = this.extractCreditRequirement(card.eligibility_criteria);
      
      if (creditRequirement && userData.creditScore >= creditRequirement) {
        score += 20;
      } else if (creditRequirement && userData.creditScore >= creditRequirement - 50) {
        score += 10;
      } else if (creditRequirement) {
        score -= 15;
      }
    }

    // Spending habits matching
    if (userData.spendingHabits) {
      const spendingScore = this.calculateSpendingMatch(card, userData.spendingHabits);
      score += spendingScore;
    }

    // Preferred benefits matching
    if (userData.preferredBenefits) {
      const benefitsScore = this.calculateBenefitsMatch(card, userData.preferredBenefits);
      score += benefitsScore;
    }

    // Fee consideration (lower fees get higher scores)
    const maxFee = 3000; // Assuming 3000 is the highest annual fee
    const feeScore = Math.max(0, 10 - (card.annual_fee / maxFee) * 10);
    score += feeScore;

    return Math.max(0, score); // Ensure score is not negative
  }

  extractIncomeRequirement(criteria) {
    const match = criteria.match(/(?:Income|Salary):\s*₹?(\d+(?:\.\d+)?)\s*(?:L|Lakh|Lac)/i);
    if (match) {
      return parseFloat(match[1]) * 100000;
    }
    return null;
  }

  extractCreditRequirement(criteria) {
    const match = criteria.match(/(?:Credit Score|Score):\s*(\d{3})/i);
    if (match) {
      return parseInt(match[1]);
    }
    return null;
  }

  calculateSpendingMatch(card, spendingHabits) {
    let score = 0;
    const cardText = card.reward_rate.toLowerCase() + ' ' + card.special_perks.toLowerCase();

    Object.keys(spendingHabits).forEach(habit => {
      if (cardText.includes(habit.toLowerCase())) {
        score += 15;
      }
    });

    return score;
  }

  calculateBenefitsMatch(card, preferredBenefits) {
    let score = 0;
    const cardText = card.reward_type.toLowerCase() + ' ' + card.special_perks.toLowerCase();

    preferredBenefits.forEach(benefit => {
      if (cardText.includes(benefit.toLowerCase())) {
        score += 10;
      }
    });

    return score;
  }

  generateReasons(card, userData) {
    const reasons = [];

    // Income-based reason
    if (userData.monthlyIncome) {
      const annualIncome = userData.monthlyIncome * 12;
      const incomeRequirement = this.extractIncomeRequirement(card.eligibility_criteria);
      
      if (incomeRequirement && annualIncome >= incomeRequirement) {
        reasons.push(`Perfect match for your income level`);
      }
    }

    // Spending habits reasons
    if (userData.spendingHabits) {
      Object.keys(userData.spendingHabits).forEach(habit => {
        const cardText = card.reward_rate.toLowerCase() + ' ' + card.special_perks.toLowerCase();
        if (cardText.includes(habit.toLowerCase())) {
          reasons.push(`Great rewards on ${habit} spending`);
        }
      });
    }

    // Benefits reasons
    if (userData.preferredBenefits) {
      userData.preferredBenefits.forEach(benefit => {
        const cardText = card.reward_type.toLowerCase() + ' ' + card.special_perks.toLowerCase();
        if (cardText.includes(benefit.toLowerCase())) {
          reasons.push(`Offers ${benefit} benefits`);
        }
      });
    }

    // Fee reasons
    if (card.annual_fee === 0) {
      reasons.push(`No annual fee - great value`);
    } else if (card.annual_fee <= 1000) {
      reasons.push(`Low annual fee of ₹${card.annual_fee}`);
    }

    return reasons.length > 0 ? reasons : ['Good overall value proposition'];
  }

  calculateEstimatedRewards(card, userData) {
    if (!userData.monthlyIncome) return null;

    const monthlySpending = userData.monthlyIncome * 0.3; // Assume 30% of income goes to card spending
    let estimatedRewards = 0;

    // Calculate based on reward type
    if (card.reward_type.toLowerCase().includes('cashback')) {
      // Assume average 2% cashback
      estimatedRewards = monthlySpending * 0.02 * 12;
    } else if (card.reward_type.toLowerCase().includes('points')) {
      // Assume 1 point = ₹0.5 value and average 2X points
      estimatedRewards = monthlySpending * 2 * 0.5 * 12;
    } else if (card.reward_type.toLowerCase().includes('miles')) {
      // Assume 1 mile = ₹1 value and average 1.5X miles
      estimatedRewards = monthlySpending * 1.5 * 1 * 12;
    }

    // Subtract annual fee
    estimatedRewards -= card.annual_fee;

    return Math.max(0, estimatedRewards);
  }
}

module.exports = RecommendationEngine; 