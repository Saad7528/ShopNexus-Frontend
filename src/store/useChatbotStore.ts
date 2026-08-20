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
  messages: ChatMessage[];
  isLoading: boolean;
  maxBudget?: number;
  selectedCategory?: string;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  setMaxBudget: (budget?: number) => void;
  setSelectedCategory: (category?: string) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  clearHistory: () => void;
}

export const useChatbotStore = create<ChatbotState>((set, get) => ({
  isOpen: false,
  isLoading: false,
  maxBudget: undefined,
  selectedCategory: undefined,
  messages: [
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: '👋 Hi there! I am your AI Shopping Assistant. How can I help you discover the perfect gear today? Feel free to ask by budget or category!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ],
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
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
