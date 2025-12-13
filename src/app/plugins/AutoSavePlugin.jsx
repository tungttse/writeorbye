import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useRef } from 'react';

import { STORAGE_KEY } from '../constants';

export default function AutoSavePlugin() {
  const [editor] = useLexicalComposerContext();
  const isInitialLoad = useRef(true);
  const timeoutRef = useRef(null);

  // Load saved content on mount
  useEffect(() => {
    if (isInitialLoad.current) {
      try {
        const savedContent = localStorage.getItem(STORAGE_KEY);
        if (savedContent) {
          const editorState = editor.parseEditorState(savedContent);
          editor.setEditable(false);
          editor.setEditorState(editorState);
          // Use setTimeout to ensure editor is ready before making it editable
          // and to mark initial load as complete
          timeoutRef.current = setTimeout(() => {
            editor.setEditable(true);
            isInitialLoad.current = false;
            timeoutRef.current = null;
          }, 0);
        } else {
          // No saved content, mark as loaded
          isInitialLoad.current = false;
        }
      } catch (error) {
        console.error('Error loading saved content:', error);
        // If parsing fails, clear the invalid data
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
          console.error('Error clearing invalid localStorage data:', e);
        }
        // Mark as loaded even if there was an error
        isInitialLoad.current = false;
      }
    }

    // Cleanup function to clear timeout if component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [editor]);

  // Auto-save on content change
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      // Skip saving on initial load
      if (isInitialLoad.current) {
        return;
      }

      editorState.read(() => {
        try {
          const serializedState = JSON.stringify(editorState.toJSON());
          localStorage.setItem(STORAGE_KEY, serializedState);
        } catch (error) {
          // Handle localStorage quota exceeded or disabled
          if (error.name === 'QuotaExceededError') {
            console.warn('localStorage quota exceeded. Unable to save editor content.');
          } else {
            console.error('Error saving editor content:', error);
          }
        }
      });
    });
  }, [editor]);

  return null;
}

