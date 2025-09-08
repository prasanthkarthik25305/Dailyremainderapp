import { useActivities } from '@/hooks/useActivities';
import { Activity } from 'lucide-react';

const ActivityHeatmap = () => {
  const { getActivityHeatmapData } = useActivities();
  const heatmapData = getActivityHeatmapData();

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-border';
      case 1: return 'bg-success/20';
      case 2: return 'bg-success/40';
      case 3: return 'bg-success/60';
      case 4: return 'bg-success/80';
      default: return 'bg-border';
    }
  };

  const getWeeks = () => {
    const weeks = [];
    for (let i = 0; i < heatmapData.length; i += 7) {
      weeks.push(heatmapData.slice(i, i + 7));
    }
    return weeks;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Activity Heatmap</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-1 overflow-x-auto">
          {getWeeks().map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 rounded-sm ${getLevelColor(day.level)}`}
                  title={`${day.date}: ${day.count} activities`}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getLevelColor(level)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Your activity over the past year
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;