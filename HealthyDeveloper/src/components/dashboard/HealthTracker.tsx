import { useState } from 'react';
import { Droplets, Footprints, Eye, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const HealthTracker = () => {
  const [hydrationCount, setHydrationCount] = useState(3);
  const [walkCount, setWalkCount] = useState(8);
  const [eyeBreakCount, setEyeBreakCount] = useState(5);
  
  const hydrationTarget = 8;
  const walkTarget = 16; // Every 30 minutes for 8 hours
  const eyeBreakTarget = 10;

  const addHydration = () => setHydrationCount(prev => Math.min(prev + 1, hydrationTarget));
  const addWalk = () => setWalkCount(prev => Math.min(prev + 1, walkTarget));
  const addEyeBreak = () => setEyeBreakCount(prev => Math.min(prev + 1, eyeBreakTarget));

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'text-success';
    if (percentage >= 75) return 'text-warning';
    return 'text-primary';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Timer className="w-5 h-5 text-success" />
        <h2 className="text-lg font-semibold">Health Tracker</h2>
      </div>

      <div className="space-y-6">
        {/* Hydration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-primary" />
              <span className="font-medium">Hydration</span>
            </div>
            <span className={`text-sm font-semibold ${getProgressColor(hydrationCount, hydrationTarget)}`}>
              {hydrationCount}/{hydrationTarget}
            </span>
          </div>
          <Progress 
            value={(hydrationCount / hydrationTarget) * 100} 
            className="h-2"
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addHydration}
            disabled={hydrationCount >= hydrationTarget}
          >
            + Add Glass
          </Button>
        </div>

        {/* Movement */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Footprints className="w-4 h-4 text-success" />
              <span className="font-medium">Movement Breaks</span>
            </div>
            <span className={`text-sm font-semibold ${getProgressColor(walkCount, walkTarget)}`}>
              {walkCount}/{walkTarget}
            </span>
          </div>
          <Progress 
            value={(walkCount / walkTarget) * 100} 
            className="h-2"
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addWalk}
            disabled={walkCount >= walkTarget}
          >
            + Log Walk
          </Button>
        </div>

        {/* Eye Breaks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-warning" />
              <span className="font-medium">Eye Breaks</span>
            </div>
            <span className={`text-sm font-semibold ${getProgressColor(eyeBreakCount, eyeBreakTarget)}`}>
              {eyeBreakCount}/{eyeBreakTarget}
            </span>
          </div>
          <Progress 
            value={(eyeBreakCount / eyeBreakTarget) * 100} 
            className="h-2"
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addEyeBreak}
            disabled={eyeBreakCount >= eyeBreakTarget}
          >
            + Eye Rest
          </Button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gradient-subtle rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          Next reminder in <span className="text-warning font-medium">12 minutes</span>
        </p>
      </div>
    </div>
  );
};

export default HealthTracker;