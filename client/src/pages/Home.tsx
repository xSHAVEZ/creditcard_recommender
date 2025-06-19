import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  MessageCircle, 
  BarChart3, 
  Shield, 
  Zap, 
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'AI-Powered Chat',
      description: 'Conversational assistant that understands your needs and guides you through the selection process.'
    },
    {
      icon: BarChart3,
      title: 'Smart Recommendations',
      description: 'Personalized credit card suggestions based on your income, spending habits, and preferences.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial information is kept secure and private throughout the entire process.'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get your personalized recommendations in seconds with detailed analysis and comparisons.'
    }
  ];

  const benefits = [
    'Compare 10+ Indian credit cards',
    'AI-powered personalized recommendations',
    'Real-time reward calculations',
    'Mobile-responsive design',
    'No registration required',
    'Free to use'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <CreditCard className="w-10 h-10" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Find Your Perfect
                <span className="block text-secondary-300">Credit Card</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-2xl mx-auto">
                AI-powered recommendations to help you choose the best credit card for your lifestyle and spending habits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/chat"
                  className="btn-primary bg-white text-primary-700 hover:bg-gray-100 text-lg px-8 py-4 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Chat
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/recommendations"
                  className="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-primary-700 text-lg px-8 py-4"
                >
                  View All Cards
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose CardFinder?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform makes finding the perfect credit card simple, fast, and personalized.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Everything You Need
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive credit card comparison and recommendations at your fingertips.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl p-8 shadow-card"
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  What You Get
                </h3>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-secondary-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl p-8 text-white"
              >
                <h3 className="text-2xl font-semibold mb-6">
                  Ready to Get Started?
                </h3>
                <p className="text-primary-100 mb-6">
                  Join thousands of users who have found their perfect credit card match with our AI-powered platform.
                </p>
                <Link
                  to="/chat"
                  className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Start Your Journey
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Find Your Perfect Credit Card Today
            </h2>
            <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
              Don't settle for just any credit card. Get personalized recommendations that match your lifestyle and maximize your rewards.
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 bg-secondary-500 hover:bg-secondary-600 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors"
            >
              <Star className="w-5 h-5" />
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 