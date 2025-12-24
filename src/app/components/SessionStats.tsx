'use client';

import { Timer } from 'lucide-react';

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
    <div className="stats-bar">
      <div className="stats-container">
        <div className="stats-group">
          <div className="stats-item">
            <span className="stats-label">WPM</span>
            <span className="stats-value">{stats.wpm}</span>
          </div>
          <div className="stats-item">
            <span className="stats-label">Words</span>
            <span className="stats-value">{stats.wordsWritten}</span>
          </div>
        </div>
        
        {timeRemaining !== undefined && timeRemaining > 0 && (
          <div className="stats-item">
            <Timer size={20} className="stats-label" />
            <span className={`stats-timer ${timeRemaining <= 60 ? 'stats-timer-warning' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}

        <div className="stats-group">
          <div className="stats-item">
            <span className="stats-label">Active</span>
            <span className="font-mono">{formatTime(stats.activeTime)}</span>
          </div>
          <div className="stats-item">
            <span className="stats-label">Session</span>
            <span className="font-mono">{formatTime(stats.sessionDuration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionStats;
