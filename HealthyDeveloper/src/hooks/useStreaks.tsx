import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Streak {
  id: string;
  streak_type: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

export const useStreaks = () => {
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchStreaks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setStreaks(data || []);
    } catch (error) {
      console.error('Error fetching streaks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStreak = (type: string) => {
    return streaks.find(streak => streak.streak_type === type);
  };

  useEffect(() => {
    if (user) {
      fetchStreaks();

      // Set up real-time subscription
      const channel = supabase
        .channel('streaks-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'streaks',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchStreaks();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    streaks,
    loading,
    getStreak,
    refetch: fetchStreaks,
  };
};