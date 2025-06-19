import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

const Compare: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Compare Credit Cards</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select up to 4 credit cards to compare their features, rewards, and benefits side by side.
          </p>
        </motion.div>
      </div>
      
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Compare Feature Coming Soon</h3>
        <p className="text-gray-600 mb-4">This feature will allow you to compare multiple credit cards side by side.</p>
      </div>
    </div>
  );
};

export default Compare; 