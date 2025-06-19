import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Star, 
  TrendingUp, 
  Shield, 
  Gift, 
  ExternalLink,
  Filter,
  Search,
  ArrowRight,
  RefreshCw,
  MessageCircle
} from 'lucide-react';
import axios from 'axios';

interface CreditCard {
  id: number;
  name: string;
  issuer: string;
  joining_fee: number;
  annual_fee: number;
  reward_type: string;
  reward_rate: string;
  eligibility_criteria: string;
  special_perks: string;
  apply_link: string;
  image_url: string;
  score?: number;
  reasons?: string[];
  estimatedRewards?: number;
}

const API_BASE_URL = 'https://creditcard-recommender-server.onrender.com'; // <-- Set your backend URL here

const Recommendations: React.FC = () => {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIssuer, setSelectedIssuer] = useState('');
  const [selectedRewardType, setSelectedRewardType] = useState('');
  const [sortBy, setSortBy] = useState('score');

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    filterAndSortCards();
  }, [cards, searchTerm, selectedIssuer, selectedRewardType, sortBy]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/cards`);
      const cardsData = response.data;
      
      // Add mock scores and reasons for demonstration
      const cardsWithScores = cardsData.map((card: CreditCard, index: number) => ({
        ...card,
        score: 85 - (index * 5), // Mock score based on position
        reasons: [
          'Great rewards on dining',
          'Low annual fee',
          'Excellent customer service'
        ],
        estimatedRewards: Math.floor(Math.random() * 8000) + 2000 // Mock estimated rewards
      }));
      
      setCards(cardsWithScores);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCards = () => {
    let filtered = cards.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.issuer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIssuer = !selectedIssuer || card.issuer === selectedIssuer;
      const matchesRewardType = !selectedRewardType || card.reward_type.toLowerCase().includes(selectedRewardType.toLowerCase());
      
      return matchesSearch && matchesIssuer && matchesRewardType;
    });

    // Sort cards
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return (b.score || 0) - (a.score || 0);
        case 'annual_fee':
          return a.annual_fee - b.annual_fee;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredCards(filtered);
  };

  const getIssuers = () => {
    return Array.from(new Set(cards.map(card => card.issuer)));
  };

  const getRewardTypes = () => {
    return Array.from(new Set(cards.map(card => card.reward_type)));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Credit Card Recommendations</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the best credit cards tailored to your needs. Compare features, rewards, and benefits to find your perfect match.
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-card p-6 mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Issuer Filter */}
          <select
            value={selectedIssuer}
            onChange={(e) => setSelectedIssuer(e.target.value)}
            className="input-field"
          >
            <option value="">All Issuers</option>
            {getIssuers().map(issuer => (
              <option key={issuer} value={issuer}>{issuer}</option>
            ))}
          </select>

          {/* Reward Type Filter */}
          <select
            value={selectedRewardType}
            onChange={(e) => setSelectedRewardType(e.target.value)}
            className="input-field"
          >
            <option value="">All Reward Types</option>
            {getRewardTypes().map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="score">Sort by Score</option>
            <option value="annual_fee">Sort by Annual Fee</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card group hover:shadow-card-hover"
            >
              {/* Card Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl overflow-hidden">
                <img
                  src={card.image_url}
                  alt={card.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBgColor(card.score || 0)} ${getScoreColor(card.score || 0)}`}>
                    Score: {card.score}
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{card.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{card.score}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{card.issuer}</p>

                {/* Key Features */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">{card.reward_type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">Annual Fee: ₹{card.annual_fee.toLocaleString()}</span>
                  </div>
                  {card.estimatedRewards && (
                    <div className="flex items-center gap-2 text-sm">
                      <Gift className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-700">Est. Rewards: ₹{card.estimatedRewards.toLocaleString()}/year</span>
                    </div>
                  )}
                </div>

                {/* Reasons */}
                {card.reasons && card.reasons.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Why this card?</h4>
                    <ul className="space-y-1">
                      {card.reasons.slice(0, 2).map((reason, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                          <div className="w-1 h-1 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <a
                    href={card.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Apply Now
                  </a>
                  <button className="btn-secondary text-sm px-3">
                    Compare
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Results */}
      {filteredCards.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cards found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedIssuer('');
              setSelectedRewardType('');
            }}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </motion.div>
      )}

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 text-white text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
        <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
          Chat with our AI assistant to get personalized recommendations based on your specific needs and preferences.
        </p>
        <a
          href="/chat"
          className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Start Chat
          <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>
    </div>
  );
};

export default Recommendations; 