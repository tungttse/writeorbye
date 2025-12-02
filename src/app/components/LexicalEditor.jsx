import { $getRoot, $getSelection } from 'lexical';
import { useEffect } from 'react';
import { ParagraphNode } from 'lexical';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import ToolbarPlugin from '../plugins/ToolbarPlugin';

const theme = {
    code: 'editor-code',
    heading: {
        h1: 'editor-heading-h1',
        h2: 'editor-heading-h2',
        h3: 'editor-heading-h3',
        h4: 'editor-heading-h4',
        h5: 'editor-heading-h5',
    },
    image: 'editor-image',
    link: 'editor-link',
    list: {
        listitem: 'editor-listitem',
        nested: {
            listitem: 'editor-nested-listitem',
        },
        ol: 'editor-list-ol',
        ul: 'editor-list-ul',
    },
    paragraph: 'editor-paragraph',
    placeholder: 'editor-placeholder',
    quote: 'editor-quote',
    text: {
        bold: 'editor-text-bold',
        code: 'editor-text-code',
        hashtag: 'editor-text-hashtag',
        italic: 'editor-text-italic',
        overflowed: 'editor-text-overflowed',
        strikethrough: 'editor-text-strikethrough',
        underline: 'editor-text-underline',
        underlineStrikethrough: 'editor-text-underlineStrikethrough',
    },
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
    console.error(error);
}

function LexicalEditor() {
    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError,
        nodes: [ParagraphNode],
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>

            <div className="editor-container">
                <ToolbarPlugin />
                <div className="editor-inner">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className="editor-input"
                                aria-placeholder={'Enter some text...'}
                                placeholder={<div className="editor-placeholder">Enter some text...</div>}
                            />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />

                    <HistoryPlugin />
                    <AutoFocusPlugin />
                </div>
            </div>
        </LexicalComposer>
    );
}

export default LexicalEditor;