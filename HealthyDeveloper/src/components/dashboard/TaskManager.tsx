import { useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface TaskManagerProps {
  onAddTask: (task: {
    title: string;
    description: string;
    time_range: string;
    type: 'morning' | 'work' | 'health' | 'evening';
    status: 'completed' | 'current' | 'upcoming' | 'skipped';
  }) => void;
  onResetProgress: () => void;
}

const TaskManager = ({ onAddTask, onResetProgress }: TaskManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    time_range: '',
    type: 'work' as const,
    status: 'upcoming' as const,
  });

  const handleAddTask = () => {
    if (!newTask.title || !newTask.time_range) return;
    
    onAddTask(newTask);
    setNewTask({
      title: '',
      description: '',
      time_range: '',
      type: 'work',
      status: 'upcoming',
    });
    setIsOpen(false);
  };

  return (
    <div className="flex gap-2 mb-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Team Meeting"
              />
            </div>
            
            <div>
              <Label htmlFor="time">Time Range</Label>
              <Input
                id="time"
                value={newTask.time_range}
                onChange={(e) => setNewTask(prev => ({ ...prev, time_range: e.target.value }))}
                placeholder="e.g., 2:00 - 3:00 PM"
              />
            </div>
            
            <div>
              <Label htmlFor="type">Task Type</Label>
              <Select value={newTask.type} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Task details..."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTask} disabled={!newTask.title || !newTask.time_range}>
                Add Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Progress
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset All Progress?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all your streaks, activities, and schedule progress to start fresh. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onResetProgress}>
              Reset Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskManager;