import { useState } from 'react';
import { DailyGoal } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Check, Circle } from 'lucide-react';

interface DailyGoalsProps {
  goals: DailyGoal[];
  onToggleGoal: (goalId: string) => void;
  onAddGoal: (text: string) => void;
  completedGoals: number;
  totalGoals: number;
}

export function DailyGoals({ goals, onToggleGoal, onAddGoal, completedGoals, totalGoals }: DailyGoalsProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [goalText, setGoalText] = useState('');

  const handleAddGoal = () => {
    if (goalText.trim()) {
      onAddGoal(goalText.trim());
      setGoalText('');
      setShowAddModal(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddGoal();
    }
  };

  return (
    <>
      <div className="bg-surface rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Daily Goals</h2>
          <div className="text-sm text-white">
            {completedGoals}/{totalGoals} completed
          </div>
        </div>
        
        <div className="space-y-3">
          {goals.map(goal => (
            <div
              key={goal.id}
              className={`goal-item flex items-center space-x-3 p-3 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors ${
                goal.completed ? 'completed' : ''
              }`}
              onClick={() => onToggleGoal(goal.id)}
            >
              <div className="flex-shrink-0">
                {goal.completed ? (
                  <Check className="text-secondary text-lg" />
                ) : (
                  <Circle className="text-white text-lg" />
                )}
              </div>
              <span className="flex-1 text-sm text-white">{goal.text}</span>
            </div>
          ))}
        </div>
        
        <Button
          className="w-full mt-4 bg-primary hover:bg-blue-600 text-white"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-surface border-slate-700" aria-describedby="add-goal-description">
          <DialogHeader>
            <DialogTitle>Add Daily Goal</DialogTitle>
          </DialogHeader>
          <p id="add-goal-description" className="sr-only">Enter a new daily goal that you want to track and complete today.</p>
          <div className="space-y-4">
            <Input
              placeholder="Enter your goal..."
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-slate-800 border-slate-600 text-white placeholder-muted"
            />
            <div className="flex space-x-3">
              <Button
                onClick={handleAddGoal}
                className="flex-1 bg-primary hover:bg-blue-600 text-white"
              >
                Add Goal
              </Button>
              <Button
                onClick={() => {
                  setShowAddModal(false);
                  setGoalText('');
                }}
                variant="outline"
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
