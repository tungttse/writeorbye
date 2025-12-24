import { $getRoot } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

export default function WordCountPlugin({ onWordCountChange, onCharCountChange }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const text = $getRoot().getTextContent();
        // Count words: split by whitespace and filter out empty strings
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = text.trim() === '' ? 0 : words.length;
        const charCount = text.length;
        
        if (onWordCountChange) {
          onWordCountChange(wordCount);
        }
        if (onCharCountChange) {
          onCharCountChange(charCount);
        }
      });
    });
  }, [editor, onWordCountChange, onCharCountChange]);

  return null;
}

