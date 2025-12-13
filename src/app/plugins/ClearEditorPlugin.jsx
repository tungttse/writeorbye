import { $getRoot, $createParagraphNode } from 'lexical';
import { useImperativeHandle } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { STORAGE_KEY } from '../constants';

// Plugin to expose clear functionality
export default function ClearEditorPlugin({ clearEditorRef }) {
    const [editor] = useLexicalComposerContext();

    useImperativeHandle(clearEditorRef, () => ({
        clear: () => {
            editor.update(() => {
                const root = $getRoot();
                root.clear();
                root.append($createParagraphNode());
            });
            // Also clear from localStorage
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch (error) {
                console.error('Error clearing localStorage:', error);
            }
        }
    }));

    return null;
}

