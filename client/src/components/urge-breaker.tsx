import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Dumbbell, Snowflake, Headphones, TreePine, Book, Music } from 'lucide-react';
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

  const handleCompleteTask = (task: typeof urgeTasks[0]) => {
    onCompleteTask(task.text);
    toast({
      title: "Great job!",
      description: `You completed: ${task.text}`,
      duration: 3000,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-surface border-slate-700 max-w-md">
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
        
        <p className="text-muted mb-6">Choose a task to redirect your energy:</p>
        
        <div className="space-y-3">
          {urgeTasks.map((task) => {
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
