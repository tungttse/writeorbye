'use client';

import { useState, useEffect, FormEvent, useRef } from 'react';
import CircularTimer from './components/CircularTimer';
import LexicalEditor from './components/LexicalEditor';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [wordTarget, setWordTarget] = useState(0);
  const [timer, setTimer] = useState(0);
  const [showWordTargetInput, setShowWordTargetInput] = useState(false);
  const [showTimerInput, setShowTimerInput] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleFullScreen = () => {
    console.log('toggleFullScreen function called');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  const toggleDarkMode = () => {
    console.log('toggleDarkMode function called');
    setIsDarkMode(!isDarkMode);
  };



  const clearText = () => {
    console.log('clearText function called');
    if (editorRef.current) {
      (editorRef.current as { clear: () => void }).clear();
    }
  };

  const handleWordCountChange = (count: number) => {
    setWordCount(count);
  };

  const handleSetWordTarget = () => {
    console.log('handleSetWordTarget function called');
    setShowWordTargetInput(true);
  };

  const handleSetTimer = () => {
    console.log('handleSetTimer function called');
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

  const handleQuickTimerSelect = (minutes: number) => {
    setTimer(minutes * 60); // Convert minutes to seconds
    setIsTimerActive(true);
    setShowTimerInput(false);
  };

  const handleTimerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const time = event.currentTarget.elements.namedItem('timer') as HTMLInputElement;
    if (time) {
      setTimer(parseInt(time.value, 10) * 60); // Convert minutes to seconds
      setIsTimerActive(true);
      setShowTimerInput(false);
    }
  };

  const handleTimerTimeout = () => {
    setIsTimerActive(false);
    // Add any additional timeout logic here
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="relative flex-1">
        <LexicalEditor 
          ref={editorRef}
          {...({
            onToggleFullScreen: toggleFullScreen,
            onToggleDarkMode: toggleDarkMode,
            onSetWordTarget: handleSetWordTarget,
            onSetTimer: handleSetTimer,
            onClearText: clearText,
            onWordCountChange: handleWordCountChange
          } as any)}
        />
       
        {/* Word Count Display */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-200 dark:bg-gray-800 text-center">
          {wordCount} of {wordTarget}
        </div>
      </div>

      {/* Circular Timer */}
      {isTimerActive && (
        <CircularTimer
          initialTime={timer}
          onTimeout={handleTimerTimeout}
        />
      )}

      {/* Word Target Modal */}
      {showWordTargetInput && (
        <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 pt-20 px-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-md w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Set Word Target</h2>
            <form onSubmit={handleWordTargetSubmit}>
              <input
                type="number"
                name="wordTarget"
                className="p-4 border border-gray-300 dark:border-gray-600 rounded-md w-full mb-4 bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                placeholder="Enter word count target"
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md"
                  onClick={() => setShowWordTargetInput(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
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
        <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 pt-20 px-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-md w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Set Timer</h2>
            
            {/* Quick Select Buttons */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick Select:</p>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15, 20, 25, 30].map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    onClick={() => handleQuickTimerSelect(minutes)}
                    className="px-4 py-2 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-md transition-colors font-medium"
                  >
                    {minutes} min
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleTimerSubmit}>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Or enter custom time:</p>
              <input
                type="number"
                name="timer"
                className="p-4 border border-gray-300 dark:border-gray-600 rounded-md w-full mb-4 bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                placeholder="Enter timer in minutes"
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md"
                  onClick={() => setShowTimerInput(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Set
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}