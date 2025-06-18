# creditcard_recommender
# 🏦 AI-Powered Credit Card Recommendation System

A modern web application that uses AI to provide personalized credit card recommendations for the Indian market. Features a conversational AI assistant, comprehensive card database, and intelligent recommendation engine.

## 🌟 Features

- **🤖 AI Chat Assistant** - Conversational interface to understand user preferences
- **📊 Smart Recommendations** - Personalized card suggestions based on user profile
- **💳 20+ Indian Credit Cards** - Comprehensive database with real card data
- **📈 Compare Cards** - Side-by-side comparison of different cards
- **🎨 Modern UI** - Responsive design with smooth animations
- **🔍 Advanced Filtering** - Search and filter cards by issuer, reward type, etc.

## 🏗️ Architecture

```
shavez/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   └── App.tsx        # Main application component
│   └── package.json
├── server/                 # Node.js Backend
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic (AI, recommendations)
│   ├── utils/             # Database utilities
│   └── index.js           # Server entry point
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shavez
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Start the backend server**
   ```bash
   cd ../server
   node index.js
   ```
   The backend will run on `http://localhost:5000`

5. **Start the frontend application**
   ```bash
   cd ../client
   npm start
   ```
   The frontend will run on `http://localhost:3001`

6. **Open your browser**
   Navigate to `http://localhost:3001` to use the application

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# OpenAI Configuration (Optional)
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=sqlite:./database.sqlite

# Security
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here
```

### Database Setup

The application uses SQLite by default. The database is automatically initialized with 20+ Indian credit cards when the server starts.

## 🤖 AI Agent Flow & Prompt Design

### Conversation Flow

The AI assistant follows a structured conversation flow to gather user information:

1. **Income Assessment**
   - Question: "What's your monthly income?"
   - Purpose: Determine eligibility and spending capacity
   - Data Extracted: Monthly income amount

2. **Spending Habits Analysis**
   - Question: "Which categories do you spend the most on?"
   - Options: fuel, travel, groceries, dining, online shopping
   - Purpose: Match cards with spending patterns

3. **Benefits Preference**
   - Question: "What type of benefits interest you?"
   - Options: cashback, travel points, lounge access, insurance, dining privileges
   - Purpose: Align with user's preferred rewards

4. **Credit Profile**
   - Question: "Do you have existing cards? What's your credit score?"
   - Purpose: Assess creditworthiness and existing relationships

### Prompt Design

#### System Prompt
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

#### Fallback Response System
The system includes intelligent fallback responses when OpenAI API is unavailable:

- **Income Response**: "Great! Now, could you tell me about your spending habits?"
- **Spending Response**: "Perfect! What type of benefits are you most interested in?"
- **Benefits Response**: "Excellent! Do you have any existing credit cards?"
- **Credit Response**: "Thank you! I'll now provide personalized recommendations."

### Data Extraction Logic

The AI service extracts structured data from user messages:

```javascript
// Income extraction
const incomeMatch = message.match(/(\d{4,5})/);

// Spending categories
const categories = ['fuel', 'travel', 'groceries', 'dining', 'online', 'shopping'];

// Benefits preferences
const benefits = ['cashback', 'points', 'miles', 'lounge', 'travel', 'rewards'];

// Credit score
const creditScoreMatch = message.match(/(\d{3})/);
```

## 📊 Recommendation Engine

### Scoring Algorithm

The recommendation engine calculates card scores based on:

1. **Income Eligibility (30 points)**
   - Meets income criteria: +30 points
   - Close to criteria: +20 points
   - Below criteria: -10 points

2. **Credit Score Match (20 points)**
   - Meets credit requirement: +20 points
   - Close to requirement: +10 points
   - Below requirement: -15 points

3. **Spending Pattern Match (15 points)**
   - Card rewards match spending habits: +15 points per match

4. **Benefits Preference (10 points)**
   - Card offers preferred benefits: +10 points per match

5. **Fee Consideration (10 points)**
   - Lower annual fees get higher scores

### Estimated Rewards Calculation

```javascript
const monthlySpending = monthlyIncome * 0.3; // 30% of income
let estimatedRewards = 0;

if (card.reward_type.includes('cashback')) {
  estimatedRewards = monthlySpending * 0.02 * 12; // 2% cashback
} else if (card.reward_type.includes('points')) {
  estimatedRewards = monthlySpending * 2 * 0.5 * 12; // 2X points, 1 point = ₹0.5
}

estimatedRewards -= card.annual_fee; // Subtract annual fee
```

## 🛠️ API Endpoints

### Chat Endpoints
- `POST /api/chat/start` - Start a new chat session
- `POST /api/chat/message` - Send a message to the AI assistant
- `GET /api/chat/history/:sessionId` - Get chat history

### Cards Endpoints
- `GET /api/cards` - Get all credit cards
- `GET /api/cards/:id` - Get specific card details
- `GET /api/cards/search/:query` - Search cards
- `GET /api/cards/type/:rewardType` - Filter by reward type
- `GET /api/cards/issuer/:issuer` - Filter by issuer

### Recommendations Endpoints
- `POST /api/recommendations` - Get personalized recommendations
- `GET /api/recommendations/session/:sessionId` - Get session recommendations
- `POST /api/recommendations/compare` - Compare specific cards

## 🎨 Frontend Architecture

### Technology Stack
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons

### Component Structure
```
src/
├── components/
│   ├── Header.tsx          # Navigation header
│   └── ...
├── pages/
│   ├── Home.tsx           # Landing page
│   ├── Chat.tsx           # AI chat interface
│   ├── Recommendations.tsx # Card recommendations
│   └── Compare.tsx        # Card comparison
└── App.tsx                # Main app component
```

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy from client directory**
   ```bash
   cd client
   vercel
   ```

3. **Configure environment variables**
   - Set `REACT_APP_API_URL` to your backend URL

### Backend Deployment (Railway/Heroku)

1. **Prepare for deployment**
   ```bash
   cd server
   npm install
   ```

2. **Set environment variables**
   - `PORT` - Server port
   - `OPENAI_API_KEY` - OpenAI API key (optional)
   - `NODE_ENV` - Environment (production)

3. **Deploy to Railway**
   ```bash
   railway login
   railway init
   railway up
   ```

## 📱 Usage Guide

### For Users

1. **Start a Chat**
   - Click "Chat" in the navigation
   - Answer the AI assistant's questions about your financial profile

2. **Browse Recommendations**
   - View personalized card suggestions
   - Filter by issuer, reward type, or annual fee
   - Sort by score, fee, or name

3. **Compare Cards**
   - Select multiple cards to compare
   - View side-by-side feature comparison
   - See value and feature scores

### For Developers

1. **Adding New Cards**
   - Insert data into the `credit_cards` table
   - Include all required fields (name, issuer, fees, rewards, etc.)

2. **Modifying AI Logic**
   - Edit `server/services/aiService.js`
   - Update conversation flow in `getFallbackResponse()`
   - Modify data extraction in `extractUserData()`

3. **Customizing Recommendations**
   - Edit `server/services/recommendationEngine.js`
   - Adjust scoring algorithm in `calculateCardScore()`
   - Modify reward calculations in `calculateEstimatedRewards()`

## 🔒 Security Considerations

- Input validation on all API endpoints
- SQL injection prevention through parameterized queries
- CORS configuration for frontend-backend communication
- Rate limiting on API endpoints
- Environment variable protection for sensitive data

## 🧪 Testing

### Manual Testing
1. Test chat flow with different user inputs
2. Verify recommendation accuracy
3. Test card comparison functionality
4. Validate responsive design on different screen sizes

### API Testing
```bash
# Test chat start
curl -X POST http://localhost:5000/api/chat/start

# Test cards endpoint
curl http://localhost:5000/api/cards

# Test recommendations
curl -X POST http://localhost:5000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{"monthlyIncome": 50000, "spendingHabits": {"fuel": true}}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

---

**Built with ❤️ for the Indian credit card market**
