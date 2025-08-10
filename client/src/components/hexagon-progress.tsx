interface HexagonProgressProps {
  progress: number;
  completedTasks: number;
  streak: number;
}

export function HexagonProgress({ progress, completedTasks, streak }: HexagonProgressProps) {
  return (
    <>
      <div className="hexagon mb-6">
        <div className="hexagon-inner">
          <div className="hexagon-progress" style={{ height: `${progress}%` }}></div>
          <div className="hexagon-content">
            <div className="text-2xl font-bold">{progress}%</div>
            <div className="text-sm opacity-80">Complete</div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-sm text-muted mb-2">Daily Score</div>
        <div className="flex justify-center space-x-4 text-sm">
          <span className="text-secondary">
            <span className="mr-1">✅</span>{completedTasks} Done
          </span>
          <span className="text-accent">
            <span className="mr-1">🔥</span>{streak} Streak
          </span>
        </div>
      </div>
    </>
  );
}
