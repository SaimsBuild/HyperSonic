interface HexagonProgressProps {
  progress: number;
  completedTasks: number;
  streak: number;
}

export function HexagonProgress({ progress, completedTasks, streak }: HexagonProgressProps) {
  return (
    <>
      <div className="hexagon mb-8">
        <div className="hexagon-inner">
          <div className="hexagon-progress" style={{ height: `${progress}%` }}></div>
          <div className="hexagon-content">
            <div className="text-5xl font-bold tracking-tight mb-1" style={{ 
              background: 'linear-gradient(135deg, #fff 0%, #e0e0e0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {progress}%
            </div>
            <div className="text-xs font-medium uppercase tracking-wider opacity-90">Complete</div>
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-white/60">Daily Score</div>
        <div className="flex justify-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/30">
              <span className="text-lg">✅</span>
            </div>
            <span className="text-xs text-white/80 font-medium">{completedTasks} Done</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
              <span className="text-lg">🔥</span>
            </div>
            <span className="text-xs text-white/80 font-medium">{streak} Streak</span>
          </div>
        </div>
      </div>
    </>
  );
}
