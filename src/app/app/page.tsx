'use client';

import { useState, useEffect, FormEvent, useRef, useCallback } from 'react';
import LexicalEditor from '../components/LexicalEditor';
import SettingsModal, { PunishmentMode } from '../components/SettingsModal';
import ProgressBar from '../components/ProgressBar';
import SessionStats from '../components/SessionStats';
import ExportModal from '../components/ExportModal';
import HelpModal from '../components/HelpModal';
import EmailModal from '../components/EmailModal';
import ConfirmModal from '../components/ConfirmModal';
import Footer from '../components/Footer';

type SessionStatsData = {
  wpm: number;
  wordsWritten: number;
  activeTime: number;
  sessionDuration: number;
};

export default function WritePage() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage on initial load (client-side only)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('writeorbye-darkmode');
      if (saved !== null) {
        return saved === 'true';
      }
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [wordTarget, setWordTarget] = useState(0);
  const [timer, setTimer] = useState(0);
  const [showWordTargetInput, setShowWordTargetInput] = useState(false);
  const [showTimerInput, setShowTimerInput] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const editorRef = useRef<{
    clear: () => void;
    exportAsText: () => string;
    exportAsMarkdown: () => string;
    downloadFile: (content: string, filename: string, type: string) => void;
  } | null>(null);

  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [settings, setSettings] = useState({
    punishmentMode: 'gentle' as PunishmentMode,
    inactivityThreshold: 5,
    soundEnabled: false
  });

  // Writing session state
  const [isWritingSessionActive, setIsWritingSessionActive] = useState(false);
  const [isInactivityWarning, setIsInactivityWarning] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStatsData>({
    wpm: 0,
    wordsWritten: 0,
    activeTime: 0,
    sessionDuration: 0
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Persist to localStorage
    localStorage.setItem('writeorbye-darkmode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleClearTextRequest = () => {
    setShowClearConfirm(true);
  };

  const clearText = () => {
    if (editorRef.current) {
      editorRef.current.clear();
    }
  };

  const handleWordCountChange = (count: number) => {
    setWordCount(count);
  };

  const handleSetWordTarget = () => {
    setShowWordTargetInput(true);
  };

  const handleSetTimer = () => {
    setShowTimerInput(true);
  };

  const handleWordTargetSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.currentTarget.elements.namedItem('wordTarget') as HTMLInputElement;
    if (target) {
      setWordTarget(parseInt(target.value, 10));
      setShowWordTargetInput(false);
    }
  };

  const handleTimerTimeout = () => {
    setIsTimerActive(false);
    setIsWritingSessionActive(false);
    setTimeRemaining(0);
  };

  // Timer countdown effect
  useEffect(() => {
    if (!isTimerActive || timeRemaining <= 0) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimerTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  // Inactivity handlers
  const handleInactivityWarning = useCallback(() => {
    setIsInactivityWarning(true);
    if (settings.soundEnabled && settings.punishmentMode !== 'gentle') {
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2telehhMk9PVmHQjGEOS09KTdCcYQ5LS0ZJ0JxhCktLRknQnF0KS0tGSdCcYQpLS0ZJ0JxhCktLRknQnGEKS0tGSdCcYQpLS0ZJ0Jxc=');
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch (e) {
        // Ignore audio errors
      }
    }
  }, [settings.soundEnabled, settings.punishmentMode]);

  const handleInactivityPunishment = useCallback(() => {
    // Additional punishment effects handled by CSS class
  }, []);

  const handleActivity = useCallback(() => {
    setIsInactivityWarning(false);
  }, []);

  const handleStatsUpdate = useCallback((stats: SessionStatsData) => {
    setSessionStats(stats);
  }, []);

  // Export handler
  const handleExport = useCallback((format: 'txt' | 'md') => {
    if (!editorRef.current) return;
    
    const textContent = editorRef.current.exportAsText();
    if (!textContent || textContent.trim().length === 0) {
      alert('Nothing to export! Start writing first.');
      return;
    }
    
    const timestamp = new Date().toISOString().split('T')[0];
    if (format === 'txt') {
      editorRef.current.downloadFile(textContent, `writeorbye-${timestamp}.txt`, 'text/plain');
    } else {
      const content = editorRef.current.exportAsMarkdown();
      editorRef.current.downloadFile(content, `writeorbye-${timestamp}.md`, 'text/markdown');
    }
  }, []);

  // Start writing session when timer starts
  const handleStartSession = useCallback(() => {
    setIsWritingSessionActive(true);
    setSessionStats({ wpm: 0, wordsWritten: 0, activeTime: 0, sessionDuration: 0 });
  }, []);

  // Modified timer handlers to start session
  const handleQuickTimerSelectWithSession = (minutes: number) => {
    const seconds = minutes * 60;
    setTimer(seconds);
    setTimeRemaining(seconds);
    setIsTimerActive(true);
    setShowTimerInput(false);
    handleStartSession();
  };

  const handleTimerSubmitWithSession = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const time = event.currentTarget.elements.namedItem('timer') as HTMLInputElement;
    if (time) {
      const seconds = parseInt(time.value, 10) * 60;
      setTimer(seconds);
      setTimeRemaining(seconds);
      setIsTimerActive(true);
      setShowTimerInput(false);
      handleStartSession();
    }
  };

  return (
    <div className={`app-container ${isInactivityWarning ? 'inactivity-warning' : ''}`}>
      {/* Session Stats */}
      <SessionStats stats={sessionStats} isVisible={isWritingSessionActive} timeRemaining={timeRemaining} />

      <div className="editor-wrapper">
        <LexicalEditor 
          ref={editorRef}
          onToggleFullScreen={toggleFullScreen}
          onToggleDarkMode={toggleDarkMode}
          onSetWordTarget={handleSetWordTarget}
          onSetTimer={handleSetTimer}
          onClearText={handleClearTextRequest}
          onWordCountChange={handleWordCountChange}
          onCharCountChange={setCharCount}
          onOpenSettings={() => setShowSettings(true)}
          onOpenExport={() => setShowExport(true)}
          onOpenHelp={() => setShowHelp(true)}
          onOpenEmail={() => setShowEmail(true)}
          hasContent={wordCount > 0}
          isDarkMode={isDarkMode}
          isSessionActive={isWritingSessionActive}
          isWritingSessionActive={isWritingSessionActive}
          inactivityThreshold={settings.inactivityThreshold}
          punishmentMode={settings.punishmentMode}
          onInactivityWarning={handleInactivityWarning}
          onInactivityPunishment={handleInactivityPunishment}
          onActivity={handleActivity}
          onStatsUpdate={handleStatsUpdate}
        />
       
        {/* Word Count Display with Progress */}
        <div className="word-count-bar">
          <div className="word-count-container">
            {wordTarget > 0 && (
              <ProgressBar current={wordCount} target={wordTarget} />
            )}
            <div className="word-count-text">
              <span className="font-medium">{wordCount}</span> words
              {wordTarget > 0 && <span> / {wordTarget} target</span>}
              <span className="mx-2">•</span>
              <span>{charCount}</span> characters
            </div>
          </div>
        </div>
      </div>

      {/* Word Target Modal */}
      {showWordTargetInput && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Set Word Target</h2>
            <form onSubmit={handleWordTargetSubmit}>
              <input
                type="number"
                name="wordTarget"
                className="modal-input"
                placeholder="Enter word count target"
              />
              <div className="btn-row">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowWordTargetInput(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Set
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Timer Modal */}
      {showTimerInput && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Set Timer & Start Session</h2>
            <p className="modal-helper-text">
              Starting a timer will begin your writing session with inactivity detection.
            </p>
            
            {/* Quick Select Buttons */}
            <div className="mb-4">
              <p className="modal-helper-text-sm">Quick Select:</p>
              <div className="quick-select-grid">
                {[5, 10, 15, 20, 25, 30].map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    onClick={() => handleQuickTimerSelectWithSession(minutes)}
                    className="btn-quick-select"
                  >
                    {minutes} min
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleTimerSubmitWithSession}>
              <p className="modal-helper-text-sm">Or enter custom time:</p>
              <input
                type="number"
                name="timer"
                className="modal-input"
                placeholder="Enter timer in minutes"
              />
              <div className="btn-row">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowTimerInput(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Start Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={setSettings}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        onExport={handleExport}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />

      {/* Email Modal */}
      <EmailModal
        isOpen={showEmail}
        onClose={() => setShowEmail(false)}
        getContent={() => editorRef.current?.exportAsText() || ''}
      />

      {/* Clear Text Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={clearText}
        title="Clear All Text?"
        message="This will permanently delete everything you've written. This action cannot be undone."
        confirmText="Clear Everything"
        cancelText="Keep Writing"
        variant="danger"
      />

      <Footer />
    </div>
  );
}
