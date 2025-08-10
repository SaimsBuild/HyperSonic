import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Dumbbell, Snowflake, Headphones, TreePine, Book, Music, Shuffle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const urgeTasks = [
  { id: '1', icon: Dumbbell, text: 'Do 20 push-ups', type: 'exercise' as const },
  { id: '2', icon: Snowflake, text: 'Take a cold shower', type: 'physical' as const },
  { id: '3', icon: Headphones, text: 'Listen to a podcast', type: 'mental' as const },
  { id: '4', icon: TreePine, text: 'Go for a quick walk', type: 'exercise' as const },
  { id: '5', icon: Book, text: 'Read for 10 minutes', type: 'mental' as const },
  { id: '6', icon: Music, text: 'Listen to motivational music', type: 'mental' as const },
];

interface UrgeBreakerProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteTask: (taskText: string) => void;
}

export function UrgeBreaker({ isOpen, onClose, onCompleteTask }: UrgeBreakerProps) {
  const { toast } = useToast();
  const [randomTasks, setRandomTasks] = useState<typeof urgeTasks>([]);

  // Generate random selection of tasks when modal opens
  useEffect(() => {
    if (isOpen) {
      const shuffled = [...urgeTasks].sort(() => Math.random() - 0.5);
      setRandomTasks(shuffled.slice(0, 4)); // Show 4 random tasks
    }
  }, [isOpen]);

  const handleCompleteTask = (task: typeof urgeTasks[0]) => {
    onCompleteTask(task.text);
    toast({
      title: "Great job!",
      description: `You completed: ${task.text}`,
      duration: 3000,
    });
  };

  const shuffleTasks = () => {
    const shuffled = [...urgeTasks].sort(() => Math.random() - 0.5);
    setRandomTasks(shuffled.slice(0, 4));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-surface border-slate-700 max-w-md" aria-describedby="urge-breaker-description">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Urge Breaker</DialogTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-muted hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        <p id="urge-breaker-description" className="sr-only">Select a healthy activity to redirect your energy and overcome urges. Tasks are randomly selected to provide variety.</p>
        
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted">Choose a task to redirect your energy:</p>
          <Button
            onClick={shuffleTasks}
            variant="ghost"
            size="sm"
            className="text-accent hover:text-yellow-400"
          >
            <Shuffle className="w-4 h-4 mr-1" />
            Shuffle
          </Button>
        </div>
        
        <div className="space-y-3">
          {randomTasks.map((task) => {
            const IconComponent = task.icon;
            return (
              <button
                key={task.id}
                onClick={() => handleCompleteTask(task)}
                className="urge-task w-full p-4 rounded-lg cursor-pointer flex items-center space-x-3 text-left"
              >
                <IconComponent className="w-5 h-5" />
                <span>{task.text}</span>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
