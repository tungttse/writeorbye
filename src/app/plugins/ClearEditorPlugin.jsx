import { $getRoot, $createParagraphNode } from 'lexical';
import { useImperativeHandle } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

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
        }
    }));

    return null;
}

