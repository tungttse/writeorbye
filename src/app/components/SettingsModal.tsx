'use client';

import { useState } from 'react';

export type PunishmentMode = 'gentle' | 'medium' | 'hardcore';

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    punishmentMode: PunishmentMode;
    inactivityThreshold: number;
    soundEnabled: boolean;
  };
  onSave: (settings: {
    punishmentMode: PunishmentMode;
    inactivityThreshold: number;
    soundEnabled: boolean;
  }) => void;
};

const SettingsModal = ({ isOpen, onClose, settings, onSave }: SettingsModalProps) => {
  const [punishmentMode, setPunishmentMode] = useState<PunishmentMode>(settings.punishmentMode);
  const [inactivityThreshold, setInactivityThreshold] = useState(settings.inactivityThreshold);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      punishmentMode,
      inactivityThreshold,
      soundEnabled
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 pt-20 px-4 z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Write or Bye Settings</h2>
        
        {/* Punishment Mode */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Punishment Mode
          </label>
          <div className="space-y-2">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="radio"
                name="punishment"
                value="gentle"
                checked={punishmentMode === 'gentle'}
                onChange={() => setPunishmentMode('gentle')}
                className="mr-3"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Gentle</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Screen turns red as a warning</div>
              </div>
            </label>
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="radio"
                name="punishment"
                value="medium"
                checked={punishmentMode === 'medium'}
                onChange={() => setPunishmentMode('medium')}
                className="mr-3"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Medium</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Warning sound + red screen</div>
              </div>
            </label>
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="radio"
                name="punishment"
                value="hardcore"
                checked={punishmentMode === 'hardcore'}
                onChange={() => setPunishmentMode('hardcore')}
                className="mr-3"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Hardcore</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 text-red-500">⚠️ Text starts deleting!</div>
              </div>
            </label>
          </div>
        </div>

        {/* Inactivity Threshold */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Inactivity Threshold: {inactivityThreshold} seconds
          </label>
          <input
            type="range"
            min="2"
            max="15"
            value={inactivityThreshold}
            onChange={(e) => setInactivityThreshold(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>2s (Hard)</span>
            <span>15s (Easy)</span>
          </div>
        </div>

        {/* Sound Toggle */}
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="mr-3 w-4 h-4"
            />
            <span className="text-gray-700 dark:text-gray-300">Enable warning sounds</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
