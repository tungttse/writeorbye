import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { useEffect, useRef, useCallback } from 'react';

export default function InactivityPlugin({ 
  isActive = false,
  inactivityThreshold = 5, // seconds
  punishmentMode = 'gentle', // 'gentle', 'medium', 'hardcore'
  onInactivityWarning = () => {},
  onInactivityPunishment = () => {},
  onActivity = () => {}
}) {
  const [editor] = useLexicalComposerContext();
  const lastActivityRef = useRef(Date.now());
  const warningIntervalRef = useRef(null);
  const punishmentIntervalRef = useRef(null);
  const isWarningRef = useRef(false);

  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    isWarningRef.current = false;
    onActivity();
  }, [onActivity]);

  const deleteLastCharacter = useCallback(() => {
    editor.update(() => {
      const root = $getRoot();
      const text = root.getTextContent();
      if (text.length > 0) {
        // Get the last text node and remove last character
        const allTextNodes = root.getAllTextNodes();
        if (allTextNodes.length > 0) {
          const lastNode = allTextNodes[allTextNodes.length - 1];
          const content = lastNode.getTextContent();
          if (content.length > 1) {
            lastNode.setTextContent(content.slice(0, -1));
          } else if (content.length === 1) {
            lastNode.remove();
          }
        }
      }
    });
  }, [editor]);

  useEffect(() => {
    if (!isActive) {
      // Clear intervals when not active
      if (warningIntervalRef.current) {
        clearInterval(warningIntervalRef.current);
        warningIntervalRef.current = null;
      }
      if (punishmentIntervalRef.current) {
        clearInterval(punishmentIntervalRef.current);
        punishmentIntervalRef.current = null;
      }
      return;
    }

    // Listen for text changes
    const unregister = editor.registerUpdateListener(({ editorState, prevEditorState }) => {
      const currentText = editorState.read(() => $getRoot().getTextContent());
      const prevText = prevEditorState.read(() => $getRoot().getTextContent());
      
      // Only reset on actual typing (text added)
      if (currentText.length > prevText.length) {
        resetActivity();
      }
    });

    // Check for inactivity
    warningIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - lastActivityRef.current) / 1000;
      
      if (elapsed >= inactivityThreshold) {
        if (!isWarningRef.current) {
          isWarningRef.current = true;
          onInactivityWarning();
        }
        
        // Apply punishment based on mode
        if (punishmentMode === 'hardcore' && elapsed >= inactivityThreshold + 2) {
          onInactivityPunishment();
          deleteLastCharacter();
        } else if (punishmentMode !== 'gentle') {
          onInactivityPunishment();
        }
      }
    }, 500);

    return () => {
      unregister();
      if (warningIntervalRef.current) {
        clearInterval(warningIntervalRef.current);
      }
      if (punishmentIntervalRef.current) {
        clearInterval(punishmentIntervalRef.current);
      }
    };
  }, [editor, isActive, inactivityThreshold, punishmentMode, resetActivity, onInactivityWarning, onInactivityPunishment, deleteLastCharacter]);

  return null;
}
