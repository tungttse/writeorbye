'use client';

type ExportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'txt' | 'md') => void;
};

const ExportModal = ({ isOpen, onClose, onExport }: ExportModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 pt-20 px-4 z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Export Document</h2>
        
        <div className="space-y-3 mb-6">
          <button
            onClick={() => {
              onExport('txt');
              onClose();
            }}
            className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Plain Text</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">.txt file</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>

          <button
            onClick={() => {
              onExport('md');
              onClose();
            }}
            className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Markdown</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">.md file</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ExportModal;
