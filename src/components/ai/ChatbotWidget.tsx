'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useChatbotStore } from '@/store/useChatbotStore';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { formatCurrency, toBengaliNumber } from '@/lib/translations';
import { getLocalizedProduct } from '@/lib/localizedProducts';
import { showAlertDialog } from '@/store/useDialogStore';
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

interface SpeechRecognitionEvent {
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
  error?: string;
}

interface ISpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface WindowWithSpeech {
  SpeechRecognition?: new () => ISpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => ISpeechRecognitionInstance;
}

interface SuggestedProductItem {
  _id: string;
  title: string;
  price: number;
  discountPrice?: number;
  category?: string;
  rating?: number;
  image: string;
}

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
  const { t, language } = useLanguageStore();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [addedItemName, setAddedItemName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<ISpeechRecognitionInstance | null>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeChat]);

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as unknown as WindowWithSpeech;
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === 'bn' ? 'bn-BD' : 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from({ length: event.results.length }, (_, idx) => event.results[idx])
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join('');

          setInputText(transcript);
        };

        recognition.onerror = (event: SpeechRecognitionEvent) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language]);

  const toggleVoiceInput = async () => {
    if (!recognitionRef.current) {
      await showAlertDialog({
        title: language === 'bn' ? 'ভয়েস ইনপুট সমর্থিত নয়' : 'Voice Input Unsupported',
        message:
          language === 'bn'
            ? 'আপনার ব্রাউজারে ওয়েব স্পিচ রিকগনিশন উপলব্ধ নেই। অনুগ্রহ করে Chrome/Edge ব্যবহার করুন অথবা টাইপ করে লিখুন।'
            : 'Your browser does not support Web Speech Recognition. Please use Chrome/Edge or type your message.',
        type: 'info',
        confirmText: language === 'bn' ? 'ঠিক আছে' : 'OK',
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Recognition start error:', e);
      }
    }
  };

  const handleSpeak = async (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) {
      await showAlertDialog({
        title: language === 'bn' ? 'ভয়েস আউটপুট সমর্থিত নয়' : 'Speech Unsupported',
        message:
          language === 'bn'
            ? 'আপনার ব্রাউজারে টেক্সট-টু-স্পিচ উপলব্ধ নেই।'
            : 'Text-to-speech is not supported on this browser.',
        type: 'info',
        confirmText: language === 'bn' ? 'ঠিক আছে' : 'OK',
      });
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = language === 'bn' ? 'bn-BD' : 'en-US';

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const quickPrompts = language === 'bn' ? [
    { label: '🎧 ১৫,০০০ টাকার মধ্যে অডিও', budget: 15000, category: 'Audio', query: 'আমাকে ১৫,০০০ টাকার মধ্যে সেরা অডিও ও হেডফোন দেখাও' },
    { label: '⌨️ সেরা মেকানিক্যাল কিবোর্ড', budget: 25000, category: 'Keyboards', query: 'আমাকে সেরা মেকানিক্যাল কিবোর্ডগুলো দেখাও' },
    { label: '🔥 ট্রেন্ডিং গ্যাজেট ডিল', budget: 40000, category: 'All', query: 'আজকের সেরা ট্রেন্ডিং গ্যাজেট ডিলগুলো দেখাও' },
    { label: '⌚ স্মার্টওয়াচ কালেকশন', budget: 80000, category: 'Wearables', query: 'আমাকে সেরা স্মার্টওয়াচ কালেকশন দেখাও' },
  ] : [
    { label: '🎧 Audio Under ৳15,000', budget: 15000, category: 'Audio', query: 'Show me top audio gear and headphones under ৳15,000' },
    { label: '⌨️ Best Mechanical Keyboards', budget: 25000, category: 'Keyboards', query: 'Recommend the best custom mechanical keyboards' },
    { label: '🔥 Top Trending Tech Deals', budget: 40000, category: 'All', query: 'Show me top trending hardware and gadget deals' },
    { label: '⌚ Smartwatch Collection', budget: 80000, category: 'Wearables', query: 'Show me the best official smartwatches available' },
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

    addMessage({ sender: 'user', text: textToSend });
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          maxBudget: effectiveBudget,
          category: effectiveCategory,
          language: language,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error();

      addMessage({
        sender: 'assistant',
        text: data.data.reply,
        suggestedProducts: data.data.suggestedProducts,
        provider: data.data.provider,
      });
    } catch {
      const fallbackText = language === 'en'
        ? `Here are the top official hardware gadgets matching your request at ShopNexus (${effectiveBudget ? `Budget ৳${effectiveBudget.toLocaleString()} BDT` : 'Top Rated'}):`
        : `আপনার চাহিদামতো শপনেক্সাসের সেরা অফিসিয়াল গ্যাজেটগুলো নিচে দেওয়া হলো (${effectiveBudget ? `বাজেট ৳${effectiveBudget.toLocaleString()}` : 'সব রেটিং'}):`;

      addMessage({
        sender: 'assistant',
        text: fallbackText,
        suggestedProducts: [
          { _id: 'prod_sony_xm5', title: 'Sony WH-1000XM5 Wireless Headphones', price: 38000, discountPrice: 32500, category: 'Audio', rating: 4.9, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
          { _id: 'prod_keychron_q1', title: 'Keychron Q1 Pro Wireless Custom Keyboard', price: 25000, discountPrice: 21500, category: 'Keyboards', rating: 4.9, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400' },
        ],
        provider: 'catalog-engine',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuggestedToCart = (product: SuggestedProductItem) => {
    addItem({ productId: product._id, title: product.title, price: product.discountPrice || product.price, image: product.image, quantity: 1, stock: 15, vendorName: 'ShopNexus Official Store' });
  };

  const getMessageDisplay = (msg: { id?: string; text?: string }) => {
    if (msg.id === 'welcome-msg') {
      return language === 'bn'
        ? '👋 স্বাগতম! আমি শপনেক্সাস এআই শপিং সহকারী। সাউন্ড গিয়ার, মেকানিক্যাল কিবোর্ড, স্মার্টওয়াচ বা আপনার বাজেটের সেরা গ্যাজেট সম্পর্কে যেকোনো প্রশ্ন করতে পারেন।'
        : '👋 Welcome! I am Nexus AI, your ShopNexus assistant. Ask me anything about audio gear, mechanical keyboards, smartwatches, or gadgets within your budget.';
    }
    if (msg.id === 'welcome-msg-reset') {
      return language === 'bn'
        ? '👋 কথোপকথন রিসেট করা হয়েছে। আজ আপনি কী খুঁজছেন?'
        : '👋 Chat history refreshed. What gadget or gear are you looking for today?';
    }
    return msg.text || '';
  };

  if (isAuthPage || pathname.startsWith('/admin')) return null;

  return (
    <>
      {/* Outside Backdrop Overlay - Closes Chatbot on Mobile and Desktop outside click/tap */}
      {isOpen && (
        <div
          onClick={closeChat}
          onTouchStart={closeChat}
          className="fixed inset-0 z-40 bg-slate-950/40 dark:bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {!isOpen && (
        <button
          type="button"
          onClick={openChat}
          className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#ff5500] hover:to-[#ff8800] text-white font-bold text-xs shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-300 ${isCartOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-in fade-in-0 zoom-in-90 duration-200'}`}
          title={language === 'bn' ? 'নেক্সাস এআই সহকারী চালু করুন' : 'Ask Nexus AI Assistant'}
          aria-label="Ask Nexus AI"
        >
          <Bot className="w-5 h-5 animate-pulse" />
          <span className="hidden sm:inline">{language === 'bn' ? 'নেক্সাস এআই সহকারী' : 'Ask Nexus AI'}</span>
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-out ${
            isFullScreen
              ? 'inset-2 sm:inset-6 md:inset-10 w-auto h-auto rounded-2xl sm:rounded-3xl'
              : 'bottom-3 right-3 left-3 sm:left-auto sm:bottom-6 sm:right-6 w-auto sm:w-96 sm:max-w-[420px] h-[60vh] sm:h-[530px] max-h-[75vh] rounded-2xl sm:rounded-3xl'
          } flex flex-col bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-950/25 dark:shadow-black/70 overflow-hidden backdrop-blur-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-3 duration-250`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 bg-linear-to-r from-white via-slate-50 to-orange-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-[#ff4400] to-[#ff7700] text-white flex items-center justify-center shadow-xs shadow-orange-500/25 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {language === 'bn' ? 'নেক্সাস এআই সহকারী' : 'Nexus AI Assistant'}
                  </h3>
                  <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[8px] sm:text-[9px] font-bold tracking-tight shrink-0">
                    {language === 'bn' ? 'জেমিনি লাইভ' : 'Gemini Live'}
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {language === 'bn' ? 'বাজেট ও গ্যাজেট সহকারী' : 'Budget & Hardware Guide'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 ml-1">
              {/* Full Screen Toggle */}
              <button
                type="button"
                onClick={toggleFullScreen}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={language === 'bn' ? (isFullScreen ? 'ছোট পর্দা করুন' : 'ফুল স্ক্রিন করুন') : (isFullScreen ? 'Minimize View' : 'Expand Full Screen')}
              >
                {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              {/* Clear History */}
              <button
                type="button"
                onClick={clearHistory}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={language === 'bn' ? 'কথোপকথন রিসেট করুন' : 'Reset Conversation'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Close Window */}
              <button
                type="button"
                onClick={closeChat}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={language === 'bn' ? 'সহকারী বন্ধ করুন' : 'Close Assistant'}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(qp.query, qp.budget, qp.category)}
                className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-orange-500/10 dark:hover:bg-orange-500/20 border border-slate-200 dark:border-slate-700 text-[10px] sm:text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 whitespace-nowrap shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-3.5 space-y-3">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-orange-600 dark:text-orange-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`max-w-[92%] sm:max-w-[88%] space-y-2 ${isUser ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`inline-block p-2.5 sm:p-3 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? 'bg-linear-to-r from-[#ff4400] to-[#ff7700] text-white shadow-md rounded-tr-xs'
                          : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{getMessageDisplay(msg)}</p>

                      {/* Text to Speech Readout Button for AI messages */}
                      {!isUser && (
                        <div className="mt-1.5 pt-1.5 border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                          <span className="font-mono text-[9px]">{msg.timestamp}</span>
                          <button
                            type="button"
                            onClick={() => handleSpeak(getMessageDisplay(msg), msg.id)}
                            className="inline-flex items-center gap-1 hover:text-orange-500 transition-colors cursor-pointer"
                            title="Listen to response"
                          >
                            {speakingMsgId === msg.id ? (
                              <>
                                <VolumeX className="w-3 h-3 text-orange-500" />
                                <span className="text-orange-500 text-[10px]">{language === 'bn' ? 'থামুন' : 'Stop'}</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3" />
                                <span className="text-[10px]">{language === 'bn' ? 'ভয়েস শুনুন' : 'Voice'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Suggested Product Cards */}
                    {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                      <div className={isFullScreen ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1" : "space-y-2 pt-1"}>
                        {msg.suggestedProducts.map((prod) => {
                          const localizedProd = getLocalizedProduct(prod, language);
                          return (
                            <div
                              key={prod._id}
                              className="p-2.5 rounded-2xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 shadow-xs flex items-center justify-between gap-2.5 transition-all group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <Link
                                  href={`/products/${prod._id}`}
                                  className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/60 dark:border-slate-800"
                                >
                                  <Image src={prod.image} alt={prod.title} fill className="object-cover group-hover:scale-105 transition-transform" unoptimized />
                                </Link>

                                <div className="flex-1 min-w-0">
                                  <Link
                                    href={`/products/${prod._id}`}
                                    className="font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors line-clamp-2 leading-tight block"
                                    title={localizedProd.title}
                                  >
                                    {localizedProd.title}
                                  </Link>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <div className="flex items-center gap-1 text-[9px] text-amber-500 shrink-0 font-bold">
                                      <Star className="w-2.5 h-2.5 fill-current" />
                                      <span>
                                        {language === 'bn' ? toBengaliNumber(prod.rating || 4.8) : (prod.rating || 4.8)}
                                      </span>
                                    </div>
                                    <span className="font-mono font-black text-[11px] text-orange-600 dark:text-orange-400">
                                      {formatCurrency(prod.discountPrice || prod.price, language)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleAddSuggestedToCart(prod)}
                                  className="p-2 rounded-xl bg-linear-to-r from-[#ff4400] to-[#ff7700] hover:from-[#ff5500] hover:to-[#ff8800] text-white transition-all shadow-xs active:scale-95 cursor-pointer"
                                  title={language === 'bn' ? '১-ক্লিকে কার্টে যোগ করুন' : '1-Click Add to Cart'}
                                >
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                </button>
                                <Link
                                  href={`/products/${prod._id}`}
                                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                                  title={language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Wave Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <div className="w-6 h-6 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                </div>
                <div className="flex items-center gap-1 p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] font-semibold ml-1">
                    {language === 'bn' ? 'শপনেক্সাস ক্যাটালগ অনুসন্ধান করা হচ্ছে...' : 'Analyzing ShopNexus catalog...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Listening Bar Indicator */}
          {isListening && (
            <div className="px-3 py-1.5 bg-gradient-to-r from-orange-500/15 via-rose-500/15 to-orange-500/15 border-t border-orange-500/30 flex items-center justify-between text-xs text-orange-600 dark:text-orange-400 font-bold animate-pulse">
              <div className="flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-orange-500 animate-bounce" />
                <span className="text-[11px]">{language === 'bn' ? 'শুনছি... আপনার পছন্দের কথা বলুন' : 'Listening... Speak now'}</span>
              </div>
              <button
                type="button"
                onClick={toggleVoiceInput}
                className="text-[10px] underline hover:text-orange-700 cursor-pointer"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Stop'}
              </button>
            </div>
          )}

          {/* Input Bar with Voice Microphone and Send */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2 sm:p-2.5 bg-white dark:bg-[#0b0f19] border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 shrink-0"
          >
            {/* Voice Input Microphone Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/30 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-orange-500 hover:border-orange-500'
              }`}
              title={
                language === 'bn'
                  ? isListening
                    ? 'রেকর্ডিং বন্ধ করুন'
                    : 'মাইক্রোফোন দিয়ে কথা বলুন'
                  : isListening
                  ? 'Stop Recording'
                  : 'Speak using Microphone'
              }
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Text Input Box */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? language === 'bn'
                    ? 'আপনার কথা শুনছি...'
                    : 'Listening to your voice...'
                  : language === 'bn'
                  ? 'গ্যাজেট সম্পর্কে জিজ্ঞাসা করুন...'
                  : 'Ask about gadgets, sound specs...'
              }
              className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-orange-500 font-sans shadow-inner min-w-0"
            />

            {/* Send Message Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2 rounded-xl bg-gradient-to-r from-[#ff4400] to-[#ff7700] hover:from-[#e63d00] hover:to-[#ff6600] disabled:opacity-40 text-white shadow-md shadow-orange-500/25 transition-all cursor-pointer shrink-0"
              title={language === 'bn' ? 'মেসেজ পাঠান' : 'Send Prompt'}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
