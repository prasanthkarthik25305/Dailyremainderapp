import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const PomodoroTimer = () => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(2);

  const durations = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Auto-switch modes
      if (mode === 'work') {
        setCompletedPomodoros(prev => prev + 1);
        const nextMode = completedPomodoros % 4 === 3 ? 'longBreak' : 'shortBreak';
        setMode(nextMode);
        setTimeLeft(durations[nextMode]);
      } else {
        setMode('work');
        setTimeLeft(durations.work);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, completedPomodoros]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((durations[mode] - timeLeft) / durations[mode]) * 100;

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durations[mode]);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(durations[newMode]);
    setIsRunning(false);
  };

  const getModeConfig = () => {
    switch (mode) {
      case 'work':
        return {
          title: 'Focus Time',
          icon: Monitor,
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          buttonVariant: 'hero' as const,
        };
      case 'shortBreak':
        return {
          title: 'Short Break',
          icon: Coffee,
          color: 'text-success',
          bgColor: 'bg-success/10',
          buttonVariant: 'success' as const,
        };
      case 'longBreak':
        return {
          title: 'Long Break',
          icon: Coffee,
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          buttonVariant: 'warning' as const,
        };
    }
  };

  const config = getModeConfig();
  const Icon = config.icon;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="text-center space-y-6">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.bgColor}`}>
          <Icon className={`w-4 h-4 ${config.color}`} />
          <span className={`font-medium ${config.color}`}>{config.title}</span>
        </div>

        <div className="space-y-4">
          <div className="text-6xl font-bold text-foreground">
            {formatTime(timeLeft)}
          </div>
          
          <Progress value={progress} className="h-3" />
          
          <div className="text-sm text-muted-foreground">
            Pomodoro #{completedPomodoros + 1} • Today: {completedPomodoros} completed
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button variant={config.buttonVariant} size="lg" onClick={toggleTimer}>
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start
              </>
            )}
          </Button>
          
          <Button variant="outline" size="lg" onClick={resetTimer}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button 
            variant={mode === 'work' ? 'default' : 'ghost'} 
            size="sm"
            onClick={() => switchMode('work')}
          >
            Work
          </Button>
          <Button 
            variant={mode === 'shortBreak' ? 'success' : 'ghost'} 
            size="sm"
            onClick={() => switchMode('shortBreak')}
          >
            Short
          </Button>
          <Button 
            variant={mode === 'longBreak' ? 'warning' : 'ghost'} 
            size="sm"
            onClick={() => switchMode('longBreak')}
          >
            Long
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;