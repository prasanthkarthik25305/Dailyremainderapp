import { useState } from 'react';
import { useSchedule } from '@/hooks/useSchedule';
import { useStreaks } from '@/hooks/useStreaks';
import { useAuth } from '@/hooks/useAuth';
import DashboardHeader from './DashboardHeader';
import ScheduleBlock from './ScheduleBlock';
import TaskManager from './TaskManager';
import HealthTracker from './HealthTracker';
import PomodoroTimer from './PomodoroTimer';
import ProgressAnalytics from './ProgressAnalytics';
import ActivityHeatmap from './ActivityHeatmap';
import MotivationalModal from './MotivationalModal';
import heroWorkspace from '@/assets/hero-workspace.jpg';

const MainDashboard = () => {
  const { scheduleBlocks, loading, updateScheduleBlockStatus, addCustomTask, resetAllProgress } = useSchedule();
  const { streaks } = useStreaks();
  const { signOut } = useAuth();
  const [motivationalModal, setMotivationalModal] = useState({ isOpen: false, activityType: '' });

  const handleStartFocus = (blockId?: string, activityType?: string) => {
    if (blockId && activityType) {
      // Show motivational modal for exercise activities
      if (activityType === 'health') {
        setMotivationalModal({ isOpen: true, activityType: 'exercise' });
      }
      updateScheduleBlockStatus(blockId, 'current');
    }
  };

  const handleCompleteTask = (blockId: string, activityType: string) => {
    updateScheduleBlockStatus(blockId, 'completed');
    
    // Show motivational modal for completed exercise
    if (activityType === 'health') {
      setMotivationalModal({ isOpen: true, activityType: 'exercise' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  const currentStreak = streaks.find(s => s.streak_type === 'daily_completion')?.current_streak || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10"
        />
        <img 
          src={heroWorkspace} 
          alt="Developer workspace" 
          className="absolute inset-0 w-full h-64 object-cover opacity-30"
        />
        <div className="relative z-20 container mx-auto px-6 pt-8">
          <DashboardHeader streak={currentStreak} onSignOut={signOut} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Schedule */}  
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Today's Schedule</h2>
              <span className="text-sm text-muted-foreground">
                {scheduleBlocks.filter(s => s.status === 'completed').length} of {scheduleBlocks.length} completed
              </span>
            </div>
            
            <TaskManager onAddTask={addCustomTask} onResetProgress={resetAllProgress} />
            
            <div className="space-y-4">
              {scheduleBlocks.map((schedule) => (
                <ScheduleBlock
                  key={schedule.id}
                  title={schedule.title}
                  timeRange={schedule.time_range}
                  description={schedule.description}
                  status={schedule.status}
                  type={schedule.type}
                  onStart={schedule.status === 'upcoming' ? () => handleStartFocus(schedule.id, schedule.type) : undefined}
                  onComplete={schedule.status === 'current' ? () => handleCompleteTask(schedule.id, schedule.type) : undefined}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Tools & Analytics */}
          <div className="space-y-6">
            <PomodoroTimer />
            <HealthTracker />
            <ProgressAnalytics />
            <ActivityHeatmap />
          </div>
        </div>
      </div>

      <MotivationalModal
        isOpen={motivationalModal.isOpen}
        onClose={() => setMotivationalModal({ isOpen: false, activityType: '' })}
        activityType={motivationalModal.activityType}
      />
    </div>
  );
};

export default MainDashboard;