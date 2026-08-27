import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedProducts?: {
    _id: string;
    title: string;
    price: number;
    discountPrice?: number;
    category: string;
    rating: number;
    image: string;
  }[];
  provider?: 'gemini' | 'groq' | 'catalog-engine';
}

interface ChatbotState {
  isOpen: boolean;
  isFullScreen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  maxBudget?: number;
  selectedCategory?: string;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  toggleFullScreen: () => void;
  setFullScreen: (isFullScreen: boolean) => void;
  setMaxBudget: (budget?: number) => void;
  setSelectedCategory: (category?: string) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  clearHistory: () => void;
}

export const useChatbotStore = create<ChatbotState>((set, get) => ({
  isOpen: false,
  isFullScreen: false,
  isLoading: false,
  maxBudget: undefined,
  selectedCategory: undefined,
  messages: [
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: '👋 স্বাগতম! আমি শপনেক্সাস এআই শপিং অ্যাসিস্ট্যান্ট (Nexus AI)। আপনি যেকোনো ভাষায় (বাংলা, বাংলিশ বা ইংরেজি) সাউন্ড সিস্টেম, কিবোর্ড বা আপনার বাজেটের সেরা গ্যাজেট সম্পর্কে জানতে পারেন। মাইকে কথা বলতে পারেন বা টাইপ করতে পারেন!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ],
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false, isFullScreen: false }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleFullScreen: () => set((state) => ({ isFullScreen: !state.isFullScreen })),
  setFullScreen: (isFullScreen) => set({ isFullScreen }),
  setMaxBudget: (maxBudget) => set({ maxBudget }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  addMessage: (msg) => {
    const newMessage: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    set({ messages: [...get().messages, newMessage] });
  },
  setLoading: (isLoading) => set({ isLoading }),
  clearHistory: () =>
    set({
      messages: [
        {
          id: 'welcome-msg-reset',
          sender: 'assistant',
          text: '👋 Chat history refreshed. What are you looking for today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    }),
}));
