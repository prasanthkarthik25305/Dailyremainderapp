import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Activity {
  id: string;
  activity_type: string;
  title: string;
  duration_minutes: number | null;
  completed_at: string;
  date: string;
  metadata: any;
}

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchActivities = async (days = 30) => {
    if (!user) return;

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivitiesForDate = (date: string) => {
    return activities.filter(activity => activity.date === date);
  };

  const getActivityHeatmapData = () => {
    const heatmapData: { [key: string]: number } = {};
    
    activities.forEach(activity => {
      const date = activity.date;
      heatmapData[date] = (heatmapData[date] || 0) + 1;
    });

    // Generate last 365 days
    const data = [];
    for (let i = 364; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      data.push({
        date: dateString,
        count: heatmapData[dateString] || 0,
        level: Math.min(Math.floor((heatmapData[dateString] || 0) / 2), 4),
      });
    }

    return data;
  };

  const addActivity = async (activity: Omit<Activity, 'id' | 'completed_at' | 'date'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('activities')
        .insert({
          ...activity,
          user_id: user.id,
        });

      if (error) throw error;
      fetchActivities();
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchActivities();

      // Set up real-time subscription
      const channel = supabase
        .channel('activities-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'activities',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchActivities();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    activities,
    loading,
    getActivitiesForDate,
    getActivityHeatmapData,
    addActivity,
    refetch: fetchActivities,
  };
};