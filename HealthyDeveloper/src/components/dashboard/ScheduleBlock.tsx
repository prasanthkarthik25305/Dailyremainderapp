import { Clock, CheckCircle, AlertCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ScheduleBlockProps {
  title: string;
  timeRange: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming' | 'skipped';
  type: 'morning' | 'work' | 'health' | 'evening';
  onStart?: () => void;
  onComplete?: () => void;
}

const ScheduleBlock = ({ title, timeRange, description, status, type, onStart, onComplete }: ScheduleBlockProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'current':
        return <Play className="w-5 h-5 text-warning animate-pulse" />;
      case 'skipped':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'morning':
        return 'border-l-warning';
      case 'work':
        return 'border-l-primary';
      case 'evening':
        return 'border-l-accent';
      case 'health':
        return 'border-l-success';
      default:
        return 'border-l-muted';
    }
  };

  const getStatusBg = () => {
    switch (status) {
      case 'current':
        return 'bg-gradient-subtle border-primary shadow-glow';
      case 'completed':
        return 'bg-card hover:bg-card-hover border-success/20';
      case 'skipped':
        return 'bg-card hover:bg-card-hover border-destructive/20';
      default:
        return 'bg-card hover:bg-card-hover border-border';
    }
  };

  return (
    <div className={cn(
      "p-4 rounded-xl border-l-4 border transition-all cursor-pointer",
      getTypeColor(),
      getStatusBg()
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{timeRange}</p>
          </div>
        </div>
        
        {status === 'current' && (
          <div className="flex gap-2">
            {onComplete && (
              <Button 
                variant="success" 
                size="sm" 
                onClick={onComplete}
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Complete  
              </Button>
            )}
          </div>
        )}

        {status === 'upcoming' && onStart && (
          <Button variant="hero" size="sm" onClick={onStart}>
            <Play className="w-3 h-3 mr-1" />
            Start
          </Button>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default ScheduleBlock;