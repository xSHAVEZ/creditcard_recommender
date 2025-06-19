import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Bot, User, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatResponse {
  message: string;
  userData: any;
  isComplete: boolean;
}

const API_BASE_URL = 'https://creditcard-recommender-server.onrender.com'; // <-- Set your backend URL here

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>({});
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    startNewChat();
  }, []);

  const startNewChat = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/chat/start`);
      const { sessionId: newSessionId, message } = response.data;
      
      setSessionId(newSessionId);
      setMessages([
        {
          id: '1',
          text: message,
          sender: 'assistant',
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error starting chat:', error);
      setMessages([
        {
          id: '1',
          text: 'Sorry, I encountered an error. Please try again.',
          sender: 'assistant',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post<ChatResponse>(`${API_BASE_URL}/api/chat/message`, {
        sessionId,
        message: inputMessage
      });

      const { message: assistantMessage, userData: newUserData, isComplete: chatComplete } = response.data;

      const assistantMessageObj: Message = {
        id: (Date.now() + 1).toString(),
        text: assistantMessage,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessageObj]);
      setUserData(newUserData);
      setIsComplete(chatComplete);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const restartChat = () => {
    setMessages([]);
    setUserData({});
    setIsComplete(false);
    startNewChat();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Credit Card Assistant</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            I'll help you find the perfect credit card by asking a few questions about your preferences and spending habits.
          </p>
        </motion.div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-xl shadow-card border border-gray-200 overflow-hidden">
        {/* Messages */}
        <div className="h-96 md:h-[500px] overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-primary-600' 
                      : 'bg-gray-100'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div className={`px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'chat-bubble-user'
                      : 'chat-bubble-assistant'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="chat-bubble-assistant">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="input-field flex-1"
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-6"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={restartChat}
          className="btn-secondary"
        >
          Start New Chat
        </button>
        {isComplete && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="btn-primary"
            onClick={() => window.location.href = '/recommendations'}
          >
            View Recommendations
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
      {/* User Data Summary */}
      {Object.keys(userData).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gray-50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile Summary</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {userData.monthlyIncome && (
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Income:</span>
                <span className="font-medium">₹{userData.monthlyIncome.toLocaleString()}</span>
              </div>
            )}
            {userData.creditScore && (
              <div className="flex justify-between">
                <span className="text-gray-600">Credit Score:</span>
                <span className="font-medium">{userData.creditScore}</span>
              </div>
            )}
            {userData.spendingHabits && Object.keys(userData.spendingHabits).length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Spending Categories:</span>
                <span className="font-medium">{Object.keys(userData.spendingHabits).join(', ')}</span>
              </div>
            )}
            {userData.preferredBenefits && userData.preferredBenefits.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Preferred Benefits:</span>
                <span className="font-medium">{userData.preferredBenefits.join(', ')}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Chat;