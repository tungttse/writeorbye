'use client';

import {
  Timer,
  Target,
  Settings,
  Download,
  Moon,
  Maximize,
  Trash2,
  Mail,
  HelpCircle,
  X
} from 'lucide-react';

type HelpModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 pt-10 px-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-full max-w-2xl shadow-xl my-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How to Use Write or Bye</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          {/* What is Write or Bye */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What is Write or Bye?</h3>
            <p>
              Write or Bye is a writing productivity tool that uses gentle (or not so gentle) 
              consequences to keep you writing. If you stop typing, bad things happen!
            </p>
          </section>

          {/* How to Start */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Getting Started</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Click the <strong>Timer</strong> icon ⏱️ to set a writing session</li>
              <li>Choose your duration (5-30 minutes or custom)</li>
              <li>Start typing! The session begins immediately</li>
              <li>Keep writing to avoid the consequences</li>
            </ol>
          </section>

          {/* Punishment Modes */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Punishment Modes</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-green-500 font-bold">Gentle</span>
                <p>Screen turns red as a warning. No permanent consequences.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 font-bold">Medium</span>
                <p>Warning sound plays + red screen effect.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 font-bold">Hardcore</span>
                <p>⚠️ Your text starts deleting if you stop typing!</p>
              </div>
            </div>
          </section>

          {/* Toolbar Icons */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Toolbar Guide</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-3">
                <Timer size={18} className="text-gray-600 dark:text-gray-400" />
                <span>Set Timer / Start Session</span>
              </div>
              <div className="flex items-center gap-3">
                <Target size={18} className="text-gray-600 dark:text-gray-400" />
                <span>Set Word Target</span>
              </div>
              <div className="flex items-center gap-3">
                <Settings size={18} className="text-gray-600 dark:text-gray-400" />
                <span>Settings (punishment mode)</span>
              </div>
              <div className="flex items-center gap-3">
                <Download size={18} className="text-gray-600 dark:text-gray-400" />
                <span>Export (txt/markdown)</span>
              </div>
              <div className="flex items-center gap-3">
                <Moon size={18} className="text-gray-600 dark:text-gray-400" />
                <span>Dark Mode</span>
              </div>
              <div className="flex items-center gap-3">
                <Maximize size={18} className="text-gray-600 dark:text-gray-400" />
                <span>Full Screen</span>
              </div>
              <div className="flex items-center gap-3">
                <Trash2 size={18} className="text-gray-600 dark:text-gray-400" />
                <span>Clear Text</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-600 dark:text-gray-400" />
                <span>Email to Yourself</span>
              </div>
              <div className="flex items-center gap-3">
                <HelpCircle size={18} className="text-gray-600 dark:text-gray-400" />
                <span>Help (this modal)</span>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pro Tips</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Set a word target to see your progress bar</li>
              <li>Start with Gentle mode until you get comfortable</li>
              <li>Use shorter sessions (5-10 min) for focused sprints</li>
              <li>Your work auto-saves to browser storage</li>
              <li>Export your work when done!</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
