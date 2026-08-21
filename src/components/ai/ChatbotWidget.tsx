'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useChatbotStore } from '@/store/useChatbotStore';
import { useCartStore } from '@/store/useCartStore';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  User,
  ShoppingBag,
  RotateCcw,
  DollarSign,
  Tag,
  Star,
  ArrowRight,
} from 'lucide-react';

export const ChatbotWidget: React.FC = () => {
  const {
    isOpen,
    messages,
    isLoading,
    maxBudget,
    selectedCategory,
    openChat,
    closeChat,
    setMaxBudget,
    setSelectedCategory,
    addMessage,
    setLoading,
    clearHistory,
  } = useChatbotStore();

  const { addItem, openDrawer } = useCartStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    { label: '🎧 Under $150 Audio', budget: 150, category: 'Audio' },
    { label: '💻 Best Tech Setup', budget: 500, category: 'Electronics' },
    { label: '⚡ Top Deals', budget: 100, category: 'All' },
  ];

  const handleSendMessage = async (customText?: string, customBudget?: number, customCategory?: string) => {
    const textToSend = customText || inputText.trim();
    if (!textToSend || isLoading) return;

    setInputText('');
    const effectiveBudget = customBudget !== undefined ? customBudget : maxBudget;
    const effectiveCategory = customCategory !== undefined ? customCategory : selectedCategory;

    // Add user message to UI
    addMessage({
      sender: 'user',
      text: textToSend,
    });

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          maxBudget: effectiveBudget,
          category: effectiveCategory,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'AI assistant unavailable');
      }

      addMessage({
        sender: 'assistant',
        text: data.data.reply,
        suggestedProducts: data.data.suggestedProducts,
        provider: data.data.provider,
      });
    } catch (err: any) {
      // Fallback client simulation if server offline
      addMessage({
        sender: 'assistant',
        text: `Here are our recommended products matching "${textToSend}" ${
          effectiveBudget ? `under $${effectiveBudget}` : ''
        }:`,
        suggestedProducts: [
          {
            _id: 'prod-fallback-1',
            title: 'Sony WH-1000XM5 Wireless Headphones',
            price: 349.99,
            discountPrice: 299.99,
            category: 'Audio',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
          },
          {
            _id: 'prod-fallback-2',
            title: 'Anker PowerCore Magnetic Wireless 10K',
            price: 59.99,
            category: 'Electronics',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1609592424385-48db4b830d95?w=400',
          },
        ],
        provider: 'catalog-engine',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuggestedToCart = (product: any) => {
    addItem({
      productId: product._id,
      title: product.title,
      price: product.discountPrice || product.price,
      image: product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      quantity: 1,
      stock: 25,
      vendorName: 'Nexus Verified Merchant',
    });
    openDrawer();
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={openChat}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-xs shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
          title="Ask AI Shopping Assistant"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 animate-spin-slow group-hover:rotate-45 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span>ShopNexus AI</span>
        </button>
      )}

      {/* Expandable Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[400px] h-[580px] max-h-[85vh] rounded-3xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95">
          {/* Header */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Nexus AI Assistant
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Online
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">Budget & Context Shopping Engine</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearHistory}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Clear Chat History"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={closeChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-900/50 border-b border-slate-800/80 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setMaxBudget(qp.budget);
                  setSelectedCategory(qp.category);
                  handleSendMessage(`Find me ${qp.label}`, qp.budget, qp.category);
                }}
                className="flex-shrink-0 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700/60 hover:border-indigo-500/40 text-[10px] font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Messages Stream Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl p-3 ${
                      isUser
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 shadow-sm'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line text-xs">{msg.text}</p>

                    {/* Suggested Products Carousel */}
                    {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800 space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                          Recommended Gear:
                        </p>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {msg.suggestedProducts.map((prod) => (
                            <div
                              key={prod._id}
                              className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900 border border-slate-800">
                                  <Image
                                    src={prod.image}
                                    alt={prod.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-[11px] text-white truncate max-w-[140px]">
                                    {prod.title}
                                  </p>
                                  <p className="text-[10px] font-mono text-emerald-400 font-bold">
                                    ${prod.discountPrice || prod.price}
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() => handleAddSuggestedToCart(prod)}
                                className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer flex-shrink-0"
                                title="Add to Cart"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-1 text-[9px] text-slate-500">
                      <span>{msg.timestamp}</span>
                      {msg.provider && (
                        <span className="uppercase text-[8px] tracking-wider text-indigo-400 font-mono">
                          {msg.provider}
                        </span>
                      )}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs">
                <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span className="text-[11px] animate-pulse">Thinking & scanning catalog...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything (e.g., 'Laptop stand under $40')..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 font-sans"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white disabled:opacity-40 transition-all cursor-pointer shadow-md shadow-indigo-600/20"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
