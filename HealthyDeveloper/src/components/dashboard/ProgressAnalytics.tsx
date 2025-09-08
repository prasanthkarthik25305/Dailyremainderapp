import { TrendingUp, Calendar, Zap, Target } from 'lucide-react';

const ProgressAnalytics = () => {
  // Mock data - in real app this would come from backend
  const weeklyStats = {
    focusHours: 42.5,
    pomodorosCompleted: 85,
    healthBreaks: 156,
    streakDays: 7,
  };

  const dailyProgress = [
    { day: 'M', completed: 8, total: 10 },
    { day: 'T', completed: 9, total: 10 },
    { day: 'W', completed: 7, total: 10 },
    { day: 'T', completed: 10, total: 10 },
    { day: 'F', completed: 8, total: 10 },
    { day: 'S', completed: 6, total: 8 },
    { day: 'S', completed: 4, total: 6 },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Weekly Progress</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-subtle rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-2xl font-bold text-primary">{weeklyStats.focusHours}</span>
          </div>
          <p className="text-xs text-muted-foreground">Focus Hours</p>
        </div>

        <div className="text-center p-4 bg-gradient-subtle rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="w-4 h-4 text-success" />
            <span className="text-2xl font-bold text-success">{weeklyStats.pomodorosCompleted}</span>
          </div>
          <p className="text-xs text-muted-foreground">Pomodoros</p>
        </div>

        <div className="text-center p-4 bg-gradient-subtle rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-warning" />
            <span className="text-2xl font-bold text-warning">{weeklyStats.healthBreaks}</span>
          </div>
          <p className="text-xs text-muted-foreground">Health Breaks</p>
        </div>

        <div className="text-center p-4 bg-gradient-subtle rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-2xl font-bold text-accent">{weeklyStats.streakDays}</span>
          </div>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </div>
      </div>

      {/* Daily Progress Chart */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Daily Completion</h3>
        <div className="flex items-end justify-between gap-2 h-20">
          {dailyProgress.map((day, index) => {
            const percentage = (day.completed / day.total) * 100;
            const height = Math.max((percentage / 100) * 64, 8); // Min 8px height
            
            return (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                <div 
                  className="w-full bg-gradient-primary rounded-sm transition-all duration-300"
                  style={{ height: `${height}px` }}
                />
                <div className="text-center">
                  <div className="text-xs font-medium text-foreground">{day.day}</div>
                  <div className="text-2xs text-muted-foreground">
                    {day.completed}/{day.total}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 p-4 bg-success/10 rounded-lg">
        <p className="text-sm text-success font-medium text-center">
          🔥 Great week! You're 15% above your weekly target
        </p>
      </div>
    </div>
  );
};

export default ProgressAnalytics;