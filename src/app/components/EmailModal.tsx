'use client';

import { useState } from 'react';

type EmailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  getContent: () => string;
};

const EmailModal = ({ isOpen, onClose, getContent }: EmailModalProps) => {
  const [email, setEmail] = useState('');
  const [sendLater, setSendLater] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const content = getContent();
    if (!content || content.trim().length === 0) {
      setStatus({ type: 'error', message: 'Nothing to send! Start writing first.' });
      return;
    }

    if (!email) {
      setStatus({ type: 'error', message: 'Please enter your email address.' });
      return;
    }

    let scheduledAt: string | undefined;
    if (sendLater) {
      if (!scheduledDate || !scheduledTime) {
        setStatus({ type: 'error', message: 'Please select a date and time for scheduled delivery.' });
        return;
      }
      scheduledAt = `${scheduledDate}T${scheduledTime}:00`;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          content,
          scheduledAt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setStatus({ type: 'success', message: data.message });
      
      // Reset form after success
      setTimeout(() => {
        setEmail('');
        setSendLater(false);
        setScheduledDate('');
        setScheduledTime('');
        setStatus(null);
        onClose();
      }, 2000);
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Failed to send email' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get min date (now) and max date (72 hours from now)
  const now = new Date();
  const minDate = now.toISOString().split('T')[0];
  const maxDate = new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 pt-20 px-4 z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Email Your Writing</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Send Later Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="sendLater"
              checked={sendLater}
              onChange={(e) => setSendLater(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="sendLater" className="text-sm text-gray-700 dark:text-gray-300">
              Send to my future self
            </label>
          </div>

          {/* Scheduled Date/Time */}
          {sendLater && (
            <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Schedule when you want to receive this email (up to 72 hours)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={minDate}
                    max={maxDate}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Time</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Status Message */}
          {status && (
            <div className={`p-3 rounded-md text-sm ${
              status.type === 'success' 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {status.message}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {sendLater ? 'Schedule Email' : 'Send Now'}
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          Your writing will be sent to your email address.
          {sendLater && ' Scheduled emails can be sent up to 72 hours in advance.'}
        </p>
      </div>
    </div>
  );
};

export default EmailModal;
