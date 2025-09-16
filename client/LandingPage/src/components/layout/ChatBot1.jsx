import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const ChatBot = ({ userType = 'citizen' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('hi');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const API_BASE_URL = 'http://localhost:4000/api/chat';

  const content = {
    hi: {
      welcome: "नमस्ते! मैं i-MITRA सहायक हूं। मैं आपकी शिकायतों और सवालों में आपकी मदद कर सकता हूं।",
      online: "ऑनलाइन",
      assistant: "i-MITRA सहायक",
      helpTooltip: "i-MITRA सहायता",
      placeholder: "अपना संदेश लिखें...",
      quickOptions: "त्वरित विकल्प:",
      quickActions: [
        "नई शिकायत कैसे दर्ज करें?",
        "शिकायत की स्थिति कैसे जांचें?",
        "कौन से विभाग उपलब्ध हैं?",
        "संपर्क नंबर चाहिए"
      ],
      errorMessage: "क्षमा करें, तकनीकी समस्या के कारण मैं अभी उत्तर नहीं दे सकता। कृपया बाद में फिर कोशिश करें।"
    },
    en: {
      welcome: "Hello! I'm the i-MITRA assistant. I can help you with your complaints and queries.",
      online: "Online",
      assistant: "i-MITRA Assistant",
      helpTooltip: "i-MITRA Help",
      placeholder: "Type your message...",
      quickOptions: "Quick Options:",
      quickActions: [
        "How to file new complaint?",
        "How to track complaint status?",
        "Which departments are available?",
        "Need contact information"
      ],
      errorMessage: "Sorry, I cannot respond right now due to technical issues. Please try again later."
    }
  };

  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: content[language].welcome,
        isBot: true,
        timestamp: new Date()
      }
    ]);
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = async (userMessage) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/gemini`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: userMessage,
          language: language,
          userType: userType,
          context: `i-MITRA government complaint platform for Indore citizens. User type: ${userType}. Respond in ${language === 'hi' ? 'Hindi' : 'English'} language only.`
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.success) {
        return data.response;
      } else {
        throw new Error(data.message || 'API error');
      }
    } catch (error) {
      console.error('Chatbot API Error:', error);
      return content[language].errorMessage;
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const botResponseText = await getBotResponse(message);

      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: botResponseText,
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        const errorResponse = {
          id: Date.now() + 1,
          text: content[language].errorMessage,
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorResponse]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div
        className={`fixed bottom-6 left-6 z-50 transition-all duration-300 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group relative"
        >
          <MessageCircle size={24} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>

          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {content[language].helpTooltip}
          </div>
        </button>
      </div>

      {/* Chat Window */}
      <div
        className={`fixed bottom-10 left-6 w-96 h-[580px] bg-white border border-gray-200 rounded-lg shadow-xl z-50 transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">{content[language].assistant}</h3>
              <p className="text-xs opacity-90 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                {content[language].online}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex bg-white/20 rounded-full p-1">
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded-full text-xs transition-colors ${
                  language === 'hi' ? 'bg-white text-blue-600' : 'text-white/80 hover:text-white'
                }`}
              >
                हिं
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-full text-xs transition-colors ${
                  language === 'en' ? 'bg-white text-blue-600' : 'text-white/80 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-3 flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`flex items-start space-x-2 max-w-xs ${
                  message.isBot ? '' : 'flex-row-reverse space-x-reverse'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isBot ? 'bg-blue-600' : 'bg-green-600'
                  }`}
                >
                  {message.isBot ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`px-3 py-2 rounded-lg text-sm leading-relaxed ${
                    message.isBot
                      ? 'bg-white text-gray-800 border shadow-sm'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="mb-3 flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-600">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="px-3 py-2 rounded-lg text-sm leading-relaxed bg-white text-gray-800 border shadow-sm">
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 bg-gray-100 border-t">
          <p className="text-xs font-semibold mb-2">{content[language].quickOptions}</p>
          <div className="flex flex-wrap gap-2">
            {content[language].quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action)}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full hover:bg-blue-200 transition"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-3 border-t flex items-center space-x-2">
          <input
            type="text"
            placeholder={content[language].placeholder}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
            className="flex-1 border rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSendMessage(inputMessage)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatBot;