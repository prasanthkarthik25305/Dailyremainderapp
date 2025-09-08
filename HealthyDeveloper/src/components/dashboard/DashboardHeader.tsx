import { useState, useEffect } from 'react';
import { Clock, Zap, Target, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  streak: number;
  onSignOut: () => void;
}

const DashboardHeader = ({ streak, onSignOut }: DashboardHeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return "Early Bird Mode 🦅";
    if (hour < 12) return "Morning Focus 🌅";
    if (hour < 18) return "Productive Hours ⚡";
    return "Evening Wind-down 🌙";
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {formatTime(currentTime)}
              </h1>
              <p className="text-sm text-muted-foreground">
                {formatDate(currentTime)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary font-medium">{getTimeBasedGreeting()}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-success" />
              <span className="text-2xl font-bold text-success">{streak}</span>
            </div>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          
          <Button variant="hero" size="lg" className="ml-4">
            <Zap className="w-4 h-4 mr-2" />
            Start Focus Session
          </Button>
          
          <Button variant="outline" size="sm" onClick={onSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;