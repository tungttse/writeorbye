import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { useEffect, useRef, useCallback } from 'react';

export default function SessionStatsPlugin({ 
  isSessionActive = false,
  onStatsUpdate = () => {}
}) {
  const [editor] = useLexicalComposerContext();
  const sessionStartRef = useRef(null);
  const initialWordCountRef = useRef(0);
  const lastWordCountRef = useRef(0);
  const activeTimeRef = useRef(0);
  const lastActivityRef = useRef(null);
  const statsIntervalRef = useRef(null);

  const calculateWPM = useCallback(() => {
    if (!sessionStartRef.current) return 0;
    
    const elapsedMinutes = activeTimeRef.current / 60;
    if (elapsedMinutes < 0.1) return 0; // Avoid division by small numbers
    
    const wordsWritten = lastWordCountRef.current - initialWordCountRef.current;
    return Math.round(Math.max(0, wordsWritten) / elapsedMinutes);
  }, []);

  const updateStats = useCallback(() => {
    const wpm = calculateWPM();
    const wordsWritten = Math.max(0, lastWordCountRef.current - initialWordCountRef.current);
    
    onStatsUpdate({
      wpm,
      wordsWritten,
      activeTime: Math.round(activeTimeRef.current),
      sessionDuration: sessionStartRef.current 
        ? Math.round((Date.now() - sessionStartRef.current) / 1000) 
        : 0
    });
  }, [calculateWPM, onStatsUpdate]);

  useEffect(() => {
    if (isSessionActive) {
      // Start session
      sessionStartRef.current = Date.now();
      lastActivityRef.current = Date.now();
      activeTimeRef.current = 0;
      
      // Get initial word count
      editor.getEditorState().read(() => {
        const text = $getRoot().getTextContent().trim();
        const words = text.split(/\s+/).filter(w => w.length > 0);
        initialWordCountRef.current = text === '' ? 0 : words.length;
        lastWordCountRef.current = initialWordCountRef.current;
      });

      // Update stats every second
      statsIntervalRef.current = setInterval(() => {
        // Track active time (if typing happened in last 5 seconds)
        if (lastActivityRef.current && (Date.now() - lastActivityRef.current) < 5000) {
          activeTimeRef.current += 1;
        }
        updateStats();
      }, 1000);

    } else {
      // End session
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
        statsIntervalRef.current = null;
      }
      sessionStartRef.current = null;
    }

    return () => {
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
      }
    };
  }, [isSessionActive, editor, updateStats]);

  useEffect(() => {
    if (!isSessionActive) return;

    const unregister = editor.registerUpdateListener(({ editorState, prevEditorState }) => {
      const currentText = editorState.read(() => $getRoot().getTextContent());
      const prevText = prevEditorState.read(() => $getRoot().getTextContent());
      
      // Update word count
      editorState.read(() => {
        const text = $getRoot().getTextContent().trim();
        const words = text.split(/\s+/).filter(w => w.length > 0);
        lastWordCountRef.current = text === '' ? 0 : words.length;
      });

      // Track activity only when typing (text added)
      if (currentText.length > prevText.length) {
        lastActivityRef.current = Date.now();
      }
    });

    return unregister;
  }, [editor, isSessionActive]);

  return null;
}
