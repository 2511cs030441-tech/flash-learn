import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

// =================== TYPES ===================

export interface Flashcard {
  id: string;
  user_id: string;
  front: string;
  back: string;
  subject: string;
  difficulty: 'easy' | 'good' | 'hard';
  next_review: string;
  interval: number;
  ease_factor: number;
  review_count: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface StudyStats {
  cardsReviewed: number;
  streak: number;
  totalCards: number;
  dueToday: number;
  accuracy: number;
}

// =================== SRS ALGORITHM ===================

export function calculateNextReview(
  card: Flashcard,
  quality: 'easy' | 'good' | 'hard'
): { interval: number; ease_factor: number; next_review: string; review_count: number } {
  const qualityMap = { hard: 0, good: 3, easy: 5 };
  const q = qualityMap[quality];

  let { interval, ease_factor } = card;
  const { review_count } = card;

  if (q < 3) {
    interval = 1;
  } else {
    if (review_count === 0) interval = 1;
    else if (review_count === 1) interval = 3;
    else interval = Math.round(interval * ease_factor);
  }

  ease_factor = Math.max(1.3, ease_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return { interval, ease_factor, next_review: nextReview.toISOString(), review_count: review_count + 1 };
}

// =================== STORE ===================

interface FlashLearnStore {
  flashcards: Flashcard[];
  chatMessages: ChatMessage[];
  loading: boolean;
  initialized: boolean;
  activeUserId: string | null;

  // Data fetching
  fetchFlashcards: (userId: string) => Promise<void>;
  fetchChatMessages: (userId: string) => Promise<void>;

  // Flashcard actions
  addFlashcard: (userId: string, front: string, back: string, subject: string) => Promise<void>;
  updateFlashcard: (id: string, front: string, back: string, subject: string) => Promise<void>;
  removeFlashcard: (id: string) => Promise<void>;
  reviewCard: (id: string, quality: 'easy' | 'good' | 'hard') => Promise<void>;
  getDueCards: () => Flashcard[];

  // Chat actions
  addChatMessage: (userId: string, role: 'user' | 'assistant', content: string) => Promise<void>;
  clearChat: (userId: string) => Promise<void>;

  // Stats
  getStats: () => StudyStats;

  // Session lifecycle
  resetStore: () => void;
}

export const useFlashLearnStore = create<FlashLearnStore>((set, get) => ({
  flashcards: [],
  chatMessages: [],
  loading: false,
  initialized: false,
  activeUserId: null,

  fetchFlashcards: async (userId: string) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      set({ flashcards: [], initialized: true, activeUserId: userId, loading: false });
      return;
    }

    set({
      flashcards: (data ?? []) as Flashcard[],
      initialized: true,
      activeUserId: userId,
      loading: false,
    });
  },

  fetchChatMessages: async (userId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      set({ chatMessages: [], activeUserId: userId });
      return;
    }

    set({ chatMessages: (data ?? []) as ChatMessage[], activeUserId: userId });
  },

  addFlashcard: async (userId, front, back, subject) => {
    const newCard = {
      user_id: userId,
      front,
      back,
      subject,
      difficulty: 'good' as const,
      next_review: new Date().toISOString(),
      interval: 1,
      ease_factor: 2.5,
      review_count: 0,
    };

    const { data, error } = await supabase
      .from('flashcards')
      .insert(newCard)
      .select()
      .single();

    if (!error && data) {
      set((s) => ({ flashcards: [data as Flashcard, ...s.flashcards] }));
    }
  },

  updateFlashcard: async (id, front, back, subject) => {
    set((s) => ({
      flashcards: s.flashcards.map(c =>
        c.id === id ? { ...c, front, back, subject } : c
      ),
    }));
    await supabase.from('flashcards').update({ front, back, subject }).eq('id', id);
  },

  removeFlashcard: async (id) => {
    set((s) => ({ flashcards: s.flashcards.filter(c => c.id !== id) }));
    await supabase.from('flashcards').delete().eq('id', id);
  },

  reviewCard: async (id, quality) => {
    const card = get().flashcards.find(c => c.id === id);
    if (!card) return;

    const updates = calculateNextReview(card, quality);
    const updateData = { ...updates, difficulty: quality };

    set((s) => ({
      flashcards: s.flashcards.map(c =>
        c.id === id ? { ...c, ...updateData } : c
      ),
    }));

    await supabase.from('flashcards').update(updateData).eq('id', id);
  },

  getDueCards: () => {
    const now = new Date();
    return get().flashcards.filter(c => new Date(c.next_review) <= now);
  },

  addChatMessage: async (userId, role, content) => {
    const newMsg = {
      user_id: userId,
      role,
      content,
    };

    const { data, error } = await supabase
      .from('chat_messages')
      .insert(newMsg)
      .select()
      .single();

    if (!error && data) {
      set((s) => ({ chatMessages: [...s.chatMessages, data as ChatMessage] }));
    }
  },

  clearChat: async (userId) => {
    set({ chatMessages: [] });
    await supabase.from('chat_messages').delete().eq('user_id', userId);
  },

  getStats: () => {
    const cards = get().flashcards;
    const reviewed = cards.filter(c => c.review_count > 0);
    return {
      cardsReviewed: reviewed.length,
      streak: 7, // TODO: calculate from study_sessions
      totalCards: cards.length,
      dueToday: get().getDueCards().length,
      accuracy: reviewed.length > 0
        ? Math.round((reviewed.filter(c => c.difficulty !== 'hard').length / reviewed.length) * 100)
        : 0,
    };
  },

  resetStore: () => {
    set({
      flashcards: [],
      chatMessages: [],
      loading: false,
      initialized: false,
      activeUserId: null,
    });
  },
}));
