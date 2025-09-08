import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface ScheduleBlock {
  id: string;
  title: string;
  description: string;
  time_range: string;
  type: 'morning' | 'work' | 'health' | 'evening';
  status: 'completed' | 'current' | 'upcoming' | 'skipped';
  scheduled_date: string;
}

export const useSchedule = () => {
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSchedule = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('schedule_blocks')
        .select('*')
        .eq('user_id', user.id)
        .eq('scheduled_date', new Date().toISOString().split('T')[0])
        .order('time_range');

      if (error) throw error;
      
      if (data && data.length === 0) {
        // Create default schedule for new users
        await createDefaultSchedule();
      } else {
        setScheduleBlocks((data || []) as ScheduleBlock[]);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to load schedule',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSchedule = async () => {
    if (!user) return;

    // Check if user already has schedule for today to prevent duplicates
    const { data: existingSchedule } = await supabase
      .from('schedule_blocks')
      .select('id')
      .eq('user_id', user.id)
      .eq('scheduled_date', new Date().toISOString().split('T')[0])
      .limit(1);

    if (existingSchedule && existingSchedule.length > 0) {
      return; // Schedule already exists for today
    }

    const defaultSchedule = [
      {
        title: "Morning Routine",
        time_range: "4:00 - 6:30 AM",
        description: "Wake up, motivational quote, coding contest practice prep",
        type: "morning" as const,
        status: "upcoming" as const,
      },
      {
        title: "Exercise & Freshening",
        time_range: "5:00 - 6:30 AM", 
        description: "Stretches, cardio, shower and prepare for the day",
        type: "health" as const,
        status: "upcoming" as const,
      },
      {
        title: "Work/Study Block",
        time_range: "9:00 AM - 12:00 PM",
        description: "Focus time for main work or study tasks",
        type: "work" as const,
        status: "current" as const,
      },
      {
        title: "Email Check", 
        time_range: "11:00 AM",
        description: "Scheduled email review and responses",
        type: "work" as const,
        status: "upcoming" as const,
      },
      {
        title: "Afternoon Focus",
        time_range: "2:00 - 5:00 PM",
        description: "Deep work session with smart break scheduling",
        type: "work" as const,
        status: "upcoming" as const,
      },
      {
        title: "Project Learning",
        time_range: "8:00 - 9:00 PM",
        description: "Tech learning and personal project development",
        type: "evening" as const,
        status: "upcoming" as const,
      },
      {
        title: "Interview Prep",
        time_range: "10:00 - 11:00 PM",
        description: "Daily interview questions and revision",
        type: "evening" as const,
        status: "upcoming" as const,
      },
    ];

    try {
      const { data, error } = await supabase
        .from('schedule_blocks')
        .insert(
          defaultSchedule.map(block => ({
            ...block,
            user_id: user.id,
            scheduled_date: new Date().toISOString().split('T')[0],
          }))
        )
        .select();

      if (error) throw error;
      setScheduleBlocks((data || []) as ScheduleBlock[]);
    } catch (error) {
      console.error('Error creating default schedule:', error);
    }
  };

  const updateScheduleBlockStatus = async (id: string, status: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('schedule_blocks')
        .update({ status })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setScheduleBlocks(prev => 
        prev.map(block => 
          block.id === id ? { ...block, status: status as ScheduleBlock['status'] } : block
        )
      );

      // Update streak if completed
      if (status === 'completed') {
        const block = scheduleBlocks.find(b => b.id === id);
        if (block) {
          await updateStreak(block.type);
          
          // Log activity
          await supabase
            .from('activities')
            .insert({
              user_id: user.id,
              activity_type: block.type === 'health' ? 'exercise' : block.type === 'work' ? 'work' : 'study',
              title: block.title,
              duration_minutes: 60, // Default duration
            });
        }
      }

      toast({
        title: 'Schedule Updated',
        description: `Task marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating schedule block:', error);
      toast({
        title: 'Error',
        description: 'Failed to update schedule',
        variant: 'destructive',
      });
    }
  };

  const updateStreak = async (type: string) => {
    if (!user) return;

    try {
      await supabase.rpc('update_streak', {
        p_user_id: user.id,
        p_streak_type: type === 'health' ? 'exercise' : 'daily_completion',
      });
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSchedule();

      // Set up real-time subscription
      const channel = supabase
        .channel('schedule-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'schedule_blocks',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchSchedule();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const addCustomTask = async (task: Omit<ScheduleBlock, 'id' | 'scheduled_date'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('schedule_blocks')
        .insert({
          ...task,
          user_id: user.id,
          scheduled_date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) throw error;
      
      setScheduleBlocks(prev => [...prev, data as ScheduleBlock]);
      
      toast({
        title: 'Task Added',
        description: `${task.title} has been added to your schedule`,
      });
    } catch (error) {
      console.error('Error adding custom task:', error);
      toast({
        title: 'Error',
        description: 'Failed to add task',
        variant: 'destructive',
      });
    }
  };

  const resetAllProgress = async () => {
    if (!user) return;

    try {
      // Reset all streaks to 0
      await supabase
        .from('streaks')
        .update({ 
          current_streak: 0, 
          longest_streak: 0, 
          last_activity_date: null 
        })
        .eq('user_id', user.id);

      // Reset all schedule blocks to upcoming
      await supabase
        .from('schedule_blocks')
        .update({ status: 'upcoming' })
        .eq('user_id', user.id)
        .eq('scheduled_date', new Date().toISOString().split('T')[0]);

      // Clear all activities
      await supabase
        .from('activities')
        .delete()
        .eq('user_id', user.id);

      await fetchSchedule();
      
      toast({
        title: 'Progress Reset',
        description: 'All streaks and progress have been reset to start fresh',
      });
    } catch (error) {
      console.error('Error resetting progress:', error);
      toast({
        title: 'Error',
        description: 'Failed to reset progress',
        variant: 'destructive',
      });
    }
  };

  return {
    scheduleBlocks,
    loading,
    updateScheduleBlockStatus,
    addCustomTask,
    resetAllProgress,
    refetch: fetchSchedule,
  };
};