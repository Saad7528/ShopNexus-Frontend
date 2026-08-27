'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Star,
  ArrowRight,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Zap,
  Tag,
  Check,
} from 'lucide-react';

export const ChatbotWidget: React.FC = () => {
  const pathname = usePathname();
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';

  const {
    isOpen,
    isFullScreen,
    messages,
    isLoading,
    maxBudget,
    selectedCategory,
    openChat,
    closeChat,
    toggleFullScreen,
    setMaxBudget,
    setSelectedCategory,
    addMessage,
    setLoading,
    clearHistory,
  } = useChatbotStore();

  const { addItem, openDrawer } = useCartStore();
  const isCartOpen = useCartStore((state) => state.isOpen);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [addedItemName, setAddedItemName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'bn-BD'; // Bengali (also recognizes English/Banglish effectively)

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');

          setInputText(transcript);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Your browser does not support Web Speech Recognition. Please use Chrome/Edge or type your message.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
      }
    }
  };

  // Text-to-Speech (Voice Readout)
  const handleSpeak = (text: string, msgId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[*_#`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const quickPrompts = [
    { label: '🎧 Under ৳১৫,০০০ Audio', budget: 15000, category: 'Audio' },
    { label: '⌨️ সেরা মেকানিক্যাল কিবোর্ড', budget: 25000, category: 'Keyboards' },
    { label: '🔥 Top Selling Deals', budget: 40000, category: 'All' },
  ];

  const handleSendMessage = async (customText?: string, customBudget?: number, customCategory?: string) => {
    const textToSend = customText || inputText.trim();
    if (!textToSend || isLoading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

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
      // 🚀 Fast Local Serverless Route Handler
      const res = await fetch('/api/ai/chat', {
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
      // Intelligent Grounded Fallback
      addMessage({
        sender: 'assistant',
        text: `আপনার চাহিদামতো শপনেক্সাসের সেরা অফিসিয়াল গ্যাজেটগুলো নিচে দেওয়া হলো (${effectiveBudget ? `বাজেট ৳${effectiveBudget.toLocaleString()}` : 'সব রেটিং'}):`,
        suggestedProducts: [
          {
            _id: 'prod_sony_xm5',
            title: 'Sony WH-1000XM5 Wireless Headphones',
            price: 38000,
            discountPrice: 32500,
            category: 'Audio',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
          },
          {
            _id: 'prod_keychron_q1',
            title: 'Keychron Q1 Pro Wireless Custom Keyboard',
            price: 25000,
            discountPrice: 21500,
            category: 'Keyboards',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
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
      image: product.image,
      quantity: 1,
      stock: 15,
      vendorName: 'ShopNexus Official Store',
    });
    setAddedItemName(product.title);
    setTimeout(() => setAddedItemName(null), 2500);
    openDrawer();
  };

  if (isAuthPage) return null;

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={openChat}
          className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#ff4400] via-[#ff6600] to-[#ff8800] text-white font-bold text-xs shadow-2xl shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group ${
            isCartOpen ? 'opacity-0 pointer-events-none translate-y-10 scale-75' : 'opacity-100'
          }`}
          title="Open Nexus AI Shopping Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
          </div>
          <span className="hidden sm:inline">Ask Nexus AI</span>
        </button>
      )}

      {/* Chatbot Window Container (Supports Floating & Full-Screen Modes) */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isFullScreen
              ? 'inset-2 sm:inset-6 md:inset-10 w-auto h-auto rounded-3xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] h-[600px] max-h-[88vh] rounded-3xl'
          } flex flex-col bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden backdrop-blur-2xl`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-white via-slate-50 to-orange-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#ff4400] to-[#ff7700] text-white flex items-center justify-center shadow-md shadow-orange-500/25">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Nexus AI Assistant</h3>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">
                    Gemini Live
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Budget, Sound & Hardware Guide (বাংলা / Eng)</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Full Screen Toggle */}
              <button
                type="button"
                onClick={toggleFullScreen}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={isFullScreen ? 'Minimize View' : 'Expand Full Screen'}
              >
                {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Clear History */}
              <button
                type="button"
                onClick={clearHistory}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Reset Conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Close Window */}
              <button
                type="button"
                onClick={closeChat}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(`Show me top ${qp.category} gear under ৳${qp.budget.toLocaleString()}`, qp.budget, qp.category)}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-orange-500/10 dark:hover:bg-orange-500/20 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 whitespace-nowrap shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-orange-600 dark:text-orange-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[85%] space-y-2 ${isUser ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`inline-block p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-gradient-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md rounded-tr-xs'
                          : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {/* Text to Speech Readout Button for AI messages */}
                      {!isUser && (
                        <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                          <span className="font-mono">{msg.timestamp}</span>
                          <button
                            type="button"
                            onClick={() => handleSpeak(msg.text, msg.id)}
                            className="inline-flex items-center gap-1 hover:text-orange-500 transition-colors cursor-pointer"
                            title="Listen to response"
                          >
                            {speakingMsgId === msg.id ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5 text-orange-500" />
                                <span className="text-orange-500">Stop Speaking</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>Voice Readout</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Suggested Product Cards Grid */}
                    {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {msg.suggestedProducts.map((prod) => (
                          <div
                            key={prod._id}
                            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 shadow-xs flex items-center gap-2.5 transition-all group"
                          >
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                              <Image src={prod.image} alt={prod.title} fill className="object-cover" unoptimized />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-[11px] text-slate-900 dark:text-white truncate">
                                {prod.title}
                              </h4>
                              <div className="flex items-center gap-1 text-[10px] text-amber-500">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                <span className="font-bold">{prod.rating || 4.8}</span>
                              </div>
                              <span className="font-mono font-black text-xs text-orange-600 dark:text-orange-400 block">
                                ৳{(prod.discountPrice || prod.price).toLocaleString()}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddSuggestedToCart(prod)}
                              className="p-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-xs active:scale-90 cursor-pointer shrink-0"
                              title="1-Click Add to Cart"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Wave Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 text-xs">
                <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                </div>
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] font-semibold ml-1">Analyzing ShopNexus catalog...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Listening Bar Indicator */}
          {isListening && (
            <div className="px-4 py-2 bg-gradient-to-r from-orange-500/15 via-rose-500/15 to-orange-500/15 border-t border-orange-500/30 flex items-center justify-between text-xs text-orange-600 dark:text-orange-400 font-bold animate-pulse">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-orange-500 animate-bounce" />
                <span>Listening... আপনি বলুন (Speak now)</span>
              </div>
              <button
                type="button"
                onClick={toggleVoiceInput}
                className="text-[10px] underline hover:text-orange-700 cursor-pointer"
              >
                Stop
              </button>
            </div>
          )}

          {/* Input Bar with Voice Microphone and Send */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-[#0b0f19] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
          >
            {/* Voice Input Microphone Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/30 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-orange-500 hover:border-orange-500'
              }`}
              title={isListening ? 'Stop Recording' : 'Speak using Microphone'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Text Input Box */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? 'Listening to your voice...' : 'Ask in বাংলা, Banglish or English...'}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-orange-500 font-sans shadow-inner"
            />

            {/* Send Message Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] disabled:opacity-40 text-white shadow-md shadow-orange-500/25 transition-all cursor-pointer"
              title="Send Prompt"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
