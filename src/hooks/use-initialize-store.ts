import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFlashLearnStore } from '@/store/useFlashLearnStore';

/**
 * Hook to initialize store data from Supabase when user is authenticated.
 * Call once in your app layout.
 */
export function useInitializeStore() {
  const { user } = useAuth();
  const {
    fetchFlashcards,
    fetchChatMessages,
    initialized,
    loading,
    activeUserId,
    resetStore,
  } = useFlashLearnStore();

  useEffect(() => {
    if (!user) {
      if (initialized || activeUserId) {
        resetStore();
      }
      return;
    }

    if (activeUserId !== user.id) {
      resetStore();
      fetchFlashcards(user.id);
      fetchChatMessages(user.id);
      return;
    }

    if (!initialized && !loading) {
      fetchFlashcards(user.id);
      fetchChatMessages(user.id);
    }
  }, [
    user,
    initialized,
    loading,
    activeUserId,
    fetchFlashcards,
    fetchChatMessages,
    resetStore,
  ]);
}
