import { ParagraphNode } from 'lexical';
import { forwardRef } from 'react';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import ToolbarPlugin from '../plugins/ToolbarPlugin';
import ClearEditorPlugin from '../plugins/ClearEditorPlugin';
import WordCountPlugin from '../plugins/WordCountPlugin';
import AutoSavePlugin from '../plugins/AutoSavePlugin';

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

const LexicalEditor = forwardRef(function LexicalEditor({
	onToggleFullScreen = () => { },
	onToggleDarkMode = () => { },
	onSetWordTarget = () => { },
	onSetTimer = () => { },
	onClearText = () => { },
	onWordCountChange = () => { }
} = {}, ref) {
	console.log('LexicalEditor received props:', {
		onToggleFullScreen: typeof onToggleFullScreen,
		onToggleDarkMode: typeof onToggleDarkMode,
		onSetWordTarget: typeof onSetWordTarget,
		onSetTimer: typeof onSetTimer,
		onClearText: typeof onClearText
	});
	const initialConfig = {
		namespace: 'MyEditor',
		theme,
		onError,
		nodes: [ParagraphNode],
	};

	return (
		<LexicalComposer initialConfig={initialConfig}>
			<div className="editor-container">
				<ToolbarPlugin
					onToggleFullScreen={onToggleFullScreen}
					onToggleDarkMode={onToggleDarkMode}
					onSetWordTarget={onSetWordTarget}
					onSetTimer={onSetTimer}
					onClearText={onClearText}
				/>
				<div className="editor-inner">
					<RichTextPlugin
						contentEditable={
							<ContentEditable
								className="editor-input"
							/>
						}
						ErrorBoundary={LexicalErrorBoundary}
					/>
					<ClearEditorPlugin clearEditorRef={ref} />
					<WordCountPlugin onWordCountChange={onWordCountChange} />
					<AutoSavePlugin />
					<HistoryPlugin />
					<AutoFocusPlugin />
				</div>
			</div>
		</LexicalComposer>
	);
});

export default LexicalEditor;