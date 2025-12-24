import { ParagraphNode } from 'lexical';
import { forwardRef, useRef, useImperativeHandle } from 'react';

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
import InactivityPlugin from '../plugins/InactivityPlugin';
import SessionStatsPlugin from '../plugins/SessionStatsPlugin';
import ExportPlugin from '../plugins/ExportPlugin';

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
function onError(error: Error) {
	console.error(error);
}

type SessionStatsData = {
	wpm: number;
	wordsWritten: number;
	activeTime: number;
	sessionDuration: number;
};

interface LexicalEditorProps {
	onToggleFullScreen?: () => void;
	onToggleDarkMode?: () => void;
	onSetWordTarget?: () => void;
	onSetTimer?: () => void;
	onClearText?: () => void;
	onWordCountChange?: (count: number) => void;
	onCharCountChange?: (count: number) => void;
	onOpenSettings?: () => void;
	onOpenExport?: () => void;
	onOpenHelp?: () => void;
	onOpenEmail?: () => void;
	hasContent?: boolean;
	isDarkMode?: boolean;
	isSessionActive?: boolean;
	isWritingSessionActive?: boolean;
	inactivityThreshold?: number;
	punishmentMode?: string;
	onInactivityWarning?: () => void;
	onInactivityPunishment?: () => void;
	onActivity?: () => void;
	onStatsUpdate?: (stats: SessionStatsData) => void;
}

export interface LexicalEditorHandle {
	clear: () => void;
	exportAsText: () => string | undefined;
	exportAsMarkdown: () => string | undefined;
	downloadFile: (content: string, filename: string, type: string) => void;
}

const LexicalEditor = forwardRef<LexicalEditorHandle, LexicalEditorProps>(function LexicalEditor({
	onToggleFullScreen = () => { },
	onToggleDarkMode = () => { },
	onSetWordTarget = () => { },
	onSetTimer = () => { },
	onClearText = () => { },
	onWordCountChange = () => { },
	onCharCountChange = () => { },
	onOpenSettings = () => { },
	onOpenExport = () => { },
	onOpenHelp = () => { },
	onOpenEmail = () => { },
	hasContent = false,
	isDarkMode = false,
	isSessionActive = false,
	// Inactivity props
	isWritingSessionActive = false,
	inactivityThreshold = 5,
	punishmentMode = 'gentle',
	onInactivityWarning = () => { },
	onInactivityPunishment = () => { },
	onActivity = () => { },
	// Session stats props
	onStatsUpdate = (_stats: SessionStatsData) => { }
}, ref) {
	const clearRef = useRef<{ clear: () => void } | null>(null);
	const exportRef = useRef<{ exportAsText: () => string; exportAsMarkdown: () => string; downloadFile: (content: string, filename: string, type: string) => void } | null>(null);

	useImperativeHandle(ref, () => ({
		clear: () => clearRef.current?.clear(),
		exportAsText: () => exportRef.current?.exportAsText(),
		exportAsMarkdown: () => exportRef.current?.exportAsMarkdown(),
		downloadFile: (content: string, filename: string, type: string) => exportRef.current?.downloadFile(content, filename, type)
	}));
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
					onOpenSettings={onOpenSettings}
					onOpenExport={onOpenExport}
					onOpenHelp={onOpenHelp}
					onOpenEmail={onOpenEmail}
					hasContent={hasContent}
					isDarkMode={isDarkMode}
					isSessionActive={isSessionActive}
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
					<ClearEditorPlugin clearEditorRef={clearRef} />
					<WordCountPlugin onWordCountChange={onWordCountChange} onCharCountChange={onCharCountChange} />
					<AutoSavePlugin />
					<HistoryPlugin />
					<AutoFocusPlugin />
					<InactivityPlugin
						isActive={isWritingSessionActive}
						inactivityThreshold={inactivityThreshold}
						punishmentMode={punishmentMode}
						onInactivityWarning={onInactivityWarning as () => void}
						onInactivityPunishment={onInactivityPunishment}
						onActivity={onActivity}
					/>
					<SessionStatsPlugin
						isSessionActive={isWritingSessionActive}
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						onStatsUpdate={onStatsUpdate as any}
					/>
					<ExportPlugin exportRef={exportRef} />
				</div>
			</div>
		</LexicalComposer>
	);
});

export default LexicalEditor;