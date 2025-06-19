const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Sample credit card data for Indian market
const creditCards = [
  {
    name: "HDFC Regalia Credit Card",
    issuer: "HDFC Bank",
    joining_fee: 2500,
    annual_fee: 2500,
    reward_type: "Points",
    reward_rate: "4X points on dining, 2X on travel, 1X on all other spends",
    eligibility_criteria: "Income: ₹12L+ annually, Credit Score: 750+",
    special_perks: "Airport lounge access, concierge services, travel insurance",
    apply_link: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia",
    image_url: "https://via.placeholder.com/300x200/1e40af/ffffff?text=HDFC+Regalia"
  },
  {
    name: "SBI SimplyCLICK Credit Card",
    issuer: "State Bank of India",
    joining_fee: 999,
    annual_fee: 999,
    reward_type: "Cashback",
    reward_rate: "10% cashback on online shopping, 5% on dining, 1% on all spends",
    eligibility_criteria: "Income: ₹6L+ annually, Credit Score: 700+",
    special_perks: "Welcome voucher worth ₹2000, movie ticket discounts",
    apply_link: "https://www.sbicard.com/en/personal/credit-cards/rewards/simplyclick.page",
    image_url: "https://via.placeholder.com/300x200/059669/ffffff?text=SBI+SimplyCLICK"
  },
  {
    name: "ICICI Amazon Pay Credit Card",
    issuer: "ICICI Bank",
    joining_fee: 0,
    annual_fee: 0,
    reward_type: "Cashback",
    reward_rate: "5% cashback on Amazon, 2% on all spends",
    eligibility_criteria: "Amazon Prime member, Credit Score: 650+",
    special_perks: "No annual fee, instant cashback, Amazon vouchers",
    apply_link: "https://www.icicibank.com/Personal-Banking/cards/credit-card/amazon-pay-credit-card/index.page",
    image_url: "https://via.placeholder.com/300x200/ff9900/ffffff?text=ICICI+Amazon+Pay"
  },
  {
    name: "Axis Flipkart Axis Bank Credit Card",
    issuer: "Axis Bank",
    joining_fee: 500,
    annual_fee: 500,
    reward_type: "Cashback",
    reward_rate: "5% unlimited cashback on Flipkart, 4% on preferred merchants",
    eligibility_criteria: "Income: ₹4L+ annually, Credit Score: 700+",
    special_perks: "Welcome voucher, movie ticket discounts, fuel surcharge waiver",
    apply_link: "https://www.axisbank.com/retail/cards/credit-card/flipkart-axis-bank-credit-card",
    image_url: "https://via.placeholder.com/300x200/2874f0/ffffff?text=Axis+Flipkart"
  },
  {
    name: "Citi PremierMiles Credit Card",
    issuer: "Citibank",
    joining_fee: 3000,
    annual_fee: 3000,
    reward_type: "Miles",
    reward_rate: "2.5X miles on dining, 2X on travel, 1X on all spends",
    eligibility_criteria: "Income: ₹15L+ annually, Credit Score: 750+",
    special_perks: "Airport lounge access, travel insurance, concierge services",
    apply_link: "https://www.citibank.co.in/credit-card/premiermiles-credit-card",
    image_url: "https://via.placeholder.com/300x200/004d99/ffffff?text=Citi+PremierMiles"
  },
  {
    name: "Kotak Urbane Credit Card",
    issuer: "Kotak Mahindra Bank",
    joining_fee: 1500,
    annual_fee: 1500,
    reward_type: "Points",
    reward_rate: "4X points on dining, 2X on travel, 1X on all spends",
    eligibility_criteria: "Income: ₹8L+ annually, Credit Score: 700+",
    special_perks: "Movie ticket discounts, dining privileges, fuel surcharge waiver",
    apply_link: "https://www.kotak.com/en/personal-banking/cards/credit-cards/urbane-credit-card.html",
    image_url: "https://via.placeholder.com/300x200/7c3aed/ffffff?text=Kotak+Urbane"
  },
  {
    name: "Yes Bank First Exclusive Credit Card",
    issuer: "Yes Bank",
    joining_fee: 2000,
    annual_fee: 2000,
    reward_type: "Points",
    reward_rate: "5X points on dining, 3X on travel, 1X on all spends",
    eligibility_criteria: "Income: ₹10L+ annually, Credit Score: 750+",
    special_perks: "Airport lounge access, golf privileges, concierge services",
    apply_link: "https://www.yesbank.in/credit-cards/first-exclusive-credit-card",
    image_url: "https://via.placeholder.com/300x200/059669/ffffff?text=Yes+First+Exclusive"
  },
  {
    name: "RBL Bank ShopRite Credit Card",
    issuer: "RBL Bank",
    joining_fee: 500,
    annual_fee: 500,
    reward_type: "Cashback",
    reward_rate: "5% cashback on grocery, 2% on fuel, 1% on all spends",
    eligibility_criteria: "Income: ₹3L+ annually, Credit Score: 650+",
    special_perks: "Fuel surcharge waiver, movie ticket discounts",
    apply_link: "https://www.rblbank.com/credit-cards/shoprite-credit-card",
    image_url: "https://via.placeholder.com/300x200/dc2626/ffffff?text=RBL+ShopRite"
  },
  {
    name: "IndusInd Bank Nexxt Credit Card",
    issuer: "IndusInd Bank",
    joining_fee: 1000,
    annual_fee: 1000,
    reward_type: "Points",
    reward_rate: "3X points on dining, 2X on travel, 1X on all spends",
    eligibility_criteria: "Income: ₹6L+ annually, Credit Score: 700+",
    special_perks: "Movie ticket discounts, dining privileges, fuel surcharge waiver",
    apply_link: "https://www.indusind.com/in/en/personal/cards/credit-cards/nexxt-credit-card.html",
    image_url: "https://via.placeholder.com/300x200/0891b2/ffffff?text=IndusInd+Nexxt"
  },
  {
    name: "Standard Chartered Rewards Credit Card",
    issuer: "Standard Chartered",
    joining_fee: 1500,
    annual_fee: 1500,
    reward_type: "Points",
    reward_rate: "4X points on dining, 2X on travel, 1X on all spends",
    eligibility_criteria: "Income: ₹8L+ annually, Credit Score: 700+",
    special_perks: "Airport lounge access, travel insurance, concierge services",
    apply_link: "https://www.sc.com/in/credit-cards/rewards-credit-card/",
    image_url: "https://via.placeholder.com/300x200/1e40af/ffffff?text=SC+Rewards"
  }
];

// Create tables
db.serialize(() => {
  // Create credit_cards table
  db.run(`CREATE TABLE IF NOT EXISTS credit_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    joining_fee INTEGER NOT NULL,
    annual_fee INTEGER NOT NULL,
    reward_type TEXT NOT NULL,
    reward_rate TEXT NOT NULL,
    eligibility_criteria TEXT NOT NULL,
    special_perks TEXT NOT NULL,
    apply_link TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create user_sessions table
  db.run(`CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT PRIMARY KEY,
    user_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert sample credit cards
  const insertCard = db.prepare(`INSERT OR IGNORE INTO credit_cards 
    (name, issuer, joining_fee, annual_fee, reward_type, reward_rate, eligibility_criteria, special_perks, apply_link, image_url) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  creditCards.forEach(card => {
    insertCard.run([
      card.name,
      card.issuer,
      card.joining_fee,
      card.annual_fee,
      card.reward_type,
      card.reward_rate,
      card.eligibility_criteria,
      card.special_perks,
      card.apply_link,
      card.image_url
    ]);
  });

  insertCard.finalize();

  console.log('Database initialized successfully!');
  console.log(`Inserted ${creditCards.length} credit cards`);
});

db.close(); 