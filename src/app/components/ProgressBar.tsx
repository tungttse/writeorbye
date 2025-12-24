'use client';

type ProgressBarProps = {
  current: number;
  target: number;
  showPercentage?: boolean;
};

const ProgressBar = ({ current, target, showPercentage = true }: ProgressBarProps) => {
  const percentage = target > 0 ? Math.min(100, (current / target) * 100) : 0;
  const isComplete = current >= target && target > 0;

  return (
    <div className="w-full">
      <div className="relative h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-300 ease-out rounded-full ${
            isComplete 
              ? 'bg-green-500' 
              : percentage > 75 
                ? 'bg-blue-500' 
                : percentage > 50 
                  ? 'bg-blue-400' 
                  : 'bg-blue-300'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && target > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
          {Math.round(percentage)}% complete
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
