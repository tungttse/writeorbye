'use client';

type SessionStatsProps = {
  stats: {
    wpm: number;
    wordsWritten: number;
    activeTime: number;
    sessionDuration: number;
  };
  isVisible: boolean;
  timeRemaining?: number;
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const SessionStats = ({ stats, isVisible, timeRemaining }: SessionStatsProps) => {
  if (!isVisible) return null;

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 text-white px-4 py-2 shadow-md z-40">
      <div className="max-w-4xl mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-blue-200">WPM</span>
            <span className="font-mono font-bold text-lg">{stats.wpm}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-200">Words</span>
            <span className="font-mono font-bold text-lg">{stats.wordsWritten}</span>
          </div>
        </div>
        
        {timeRemaining !== undefined && timeRemaining > 0 && (
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`font-mono font-bold text-xl ${timeRemaining <= 60 ? 'text-red-300 animate-pulse' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-blue-200">Active</span>
            <span className="font-mono">{formatTime(stats.activeTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-200">Session</span>
            <span className="font-mono">{formatTime(stats.sessionDuration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionStats;
