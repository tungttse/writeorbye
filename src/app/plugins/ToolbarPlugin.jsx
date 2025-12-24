/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {mergeRegister} from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Timer,
  Target,
  Trash2,
  Moon,
  Sun,
  Maximize,
  Download,
  Settings,
  HelpCircle,
  Mail,
  Menu,
  Home
} from 'lucide-react';
import Link from 'next/link';

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin({ 
  onToggleFullScreen = () => {},
  onToggleDarkMode = () => {},
  onSetWordTarget = () => {},
  onSetTimer = () => {},
  onClearText = () => {},
  onOpenSettings = () => {},
  onOpenExport = () => {},
  onOpenHelp = () => {},
  onOpenEmail = () => {},
  hasContent = false,
  isDarkMode = false,
  isSessionActive = false
}) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(
          () => {
            $updateToolbar();
          },
          {editor},
        );
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateToolbar]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className={`toolbar ${!isSessionActive ? 'no-stats' : ''}`} ref={toolbarRef}>
      {/* Left side - Formatting buttons */}
      <div className="toolbar-left">
        <Link
          href="/"
          className="toolbar-item spaced"
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          aria-label="Home"
          title="Back to Home">
          <Home size={18} />
        </Link>
        <Divider />
        <button
          disabled={!canUndo}
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
          className="toolbar-item spaced"
          aria-label="Undo">
          <Undo2 size={18} />
        </button>
        <button
          disabled={!canRedo}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
          className="toolbar-item"
          aria-label="Redo">
          <Redo2 size={18} />
        </button>
        <Divider />
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
          }}
          className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
          aria-label="Format Bold">
          <Bold size={18} />
        </button>
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
          }}
          className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
          aria-label="Format Italics">
          <Italic size={18} />
        </button>
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
          }}
          className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
          aria-label="Format Underline">
          <Underline size={18} />
        </button>
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
          }}
          className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')}
          aria-label="Format Strikethrough">
          <Strikethrough size={18} />
        </button>
        <Divider />
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
          }}
          className="toolbar-item spaced"
          aria-label="Left Align">
          <AlignLeft size={18} />
        </button>
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
          }}
          className="toolbar-item spaced"
          aria-label="Center Align">
          <AlignCenter size={18} />
        </button>
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
          }}
          className="toolbar-item spaced"
          aria-label="Right Align">
          <AlignRight size={18} />
        </button>
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
          }}
          className="toolbar-item"
          aria-label="Justify Align">
          <AlignJustify size={18} />
        </button>
      </div>

      {/* Right side - Action buttons */}
      <div className="toolbar-right">
        <Divider />
        {/* Desktop buttons - hidden on mobile */}
        <div className="toolbar-right-buttons">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Full Screen button clicked');
              console.log('Handler:', onToggleFullScreen);
              if (typeof onToggleFullScreen === 'function') {
                onToggleFullScreen();
              } else {
                console.error('onToggleFullScreen is not a function!', onToggleFullScreen);
              }
            }}
            className="toolbar-item spaced"
            style={{ cursor: 'pointer', zIndex: 1000, position: 'relative' }}
            aria-label="Full Screen"
            title="Full Screen">
            <Maximize size={18} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Dark Mode button clicked');
              if (typeof onToggleDarkMode === 'function') {
                onToggleDarkMode();
              }
            }}
            className="toolbar-item spaced"
            style={{ cursor: 'pointer', zIndex: 1000, position: 'relative' }}
            aria-label="Dark Mode"
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Set Target button clicked');
              if (typeof onSetWordTarget === 'function') {
                onSetWordTarget();
              }
            }}
            className="toolbar-item spaced"
            style={{ cursor: 'pointer', zIndex: 1000, position: 'relative' }}
            aria-label="Set Target"
            title="Set Target">
            <Target size={18} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Set Timer button clicked');
              if (typeof onSetTimer === 'function') {
                onSetTimer();
              }
            }}
            className="toolbar-item spaced"
            style={{ cursor: 'pointer', zIndex: 1000, position: 'relative' }}
            aria-label="Set Timer"
            title="Set Timer">
            <Timer size={18} />
          </button>
          <button
            type="button"
            disabled={!hasContent}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!hasContent) return;
              console.log('Clear Text button clicked');
              if (typeof onClearText === 'function') {
                onClearText();
              }
            }}
            className={`toolbar-item ${!hasContent ? 'opacity-40 cursor-not-allowed' : ''}`}
            style={{ cursor: hasContent ? 'pointer' : 'not-allowed', zIndex: 1000, position: 'relative' }}
            aria-label="Clear Text"
            title={hasContent ? 'Clear Text' : 'Nothing to clear'}>
            <Trash2 size={18} />
          </button>
          <button
            type="button"
            disabled={!hasContent}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!hasContent) return;
              if (typeof onOpenExport === 'function') {
                onOpenExport();
              }
            }}
            className={`toolbar-item spaced ${!hasContent ? 'opacity-40 cursor-not-allowed' : ''}`}
            style={{ cursor: hasContent ? 'pointer' : 'not-allowed', zIndex: 1000, position: 'relative' }}
            aria-label="Export"
            title={hasContent ? 'Export' : 'Nothing to export'}>
            <Download size={18} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (typeof onOpenSettings === 'function') {
                onOpenSettings();
              }
            }}
            className="toolbar-item"
            style={{ cursor: 'pointer', zIndex: 1000, position: 'relative' }}
            aria-label="Settings"
            title="Settings">
            <Settings size={18} />
          </button>
          <button
            type="button"
            disabled={!hasContent}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!hasContent) return;
              if (typeof onOpenEmail === 'function') {
                onOpenEmail();
              }
            }}
            className={`toolbar-item ${!hasContent ? 'opacity-40 cursor-not-allowed' : ''}`}
            style={{ cursor: hasContent ? 'pointer' : 'not-allowed', zIndex: 1000, position: 'relative' }}
            aria-label="Email"
            title={hasContent ? 'Email to yourself' : 'Nothing to email'}>
            <Mail size={18} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (typeof onOpenHelp === 'function') {
                onOpenHelp();
              }
            }}
            className="toolbar-item"
            style={{ cursor: 'pointer', zIndex: 1000, position: 'relative' }}
            aria-label="Help"
            title="Help">
            <HelpCircle size={18} />
          </button>
        </div>

        {/* Mobile menu button - shown only on mobile */}
        <div className="toolbar-mobile-menu">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="toolbar-item"
            style={{ cursor: 'pointer', zIndex: 1000, position: 'relative' }}
            aria-label="More Options"
            title="More Options">
            <Menu size={18} />
          </button>

          {/* Mobile dropdown menu */}
          {isMobileMenuOpen && (
            <div className="toolbar-mobile-dropdown">
              <Link
                href="/"
                className="toolbar-mobile-menu-item"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Home">
                <Home size={18} style={{ marginRight: '8px' }} />
                Back to Home
              </Link>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMobileMenuOpen(false);
                  if (typeof onToggleFullScreen === 'function') {
                    onToggleFullScreen();
                  }
                }}
                className="toolbar-mobile-menu-item"
                aria-label="Full Screen">
                <Maximize size={18} style={{ marginRight: '8px' }} />
                Full Screen
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMobileMenuOpen(false);
                  if (typeof onToggleDarkMode === 'function') {
                    onToggleDarkMode();
                  }
                }}
                className="toolbar-mobile-menu-item"
                aria-label={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
                {isDarkMode ? <Sun size={18} style={{ marginRight: '8px' }} /> : <Moon size={18} style={{ marginRight: '8px' }} />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMobileMenuOpen(false);
                  if (typeof onSetWordTarget === 'function') {
                    onSetWordTarget();
                  }
                }}
                className="toolbar-mobile-menu-item"
                aria-label="Set Target">
                <Target size={18} style={{ marginRight: '8px' }} />
                Set Target
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMobileMenuOpen(false);
                  if (typeof onSetTimer === 'function') {
                    onSetTimer();
                  }
                }}
                className="toolbar-mobile-menu-item"
                aria-label="Set Timer">
                <Timer size={18} style={{ marginRight: '8px' }} />
                Set Timer
              </button>
              <button
                type="button"
                disabled={!hasContent}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!hasContent) return;
                  setIsMobileMenuOpen(false);
                  if (typeof onClearText === 'function') {
                    onClearText();
                  }
                }}
                className={`toolbar-mobile-menu-item ${!hasContent ? 'opacity-40 cursor-not-allowed' : ''}`}
                aria-label="Clear Text">
                <Trash2 size={18} style={{ marginRight: '8px' }} />
                Clear Text
              </button>
              <button
                type="button"
                disabled={!hasContent}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!hasContent) return;
                  setIsMobileMenuOpen(false);
                  if (typeof onOpenExport === 'function') {
                    onOpenExport();
                  }
                }}
                className={`toolbar-mobile-menu-item ${!hasContent ? 'opacity-40 cursor-not-allowed' : ''}`}
                aria-label="Export">
                <Download size={18} style={{ marginRight: '8px' }} />
                Export
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMobileMenuOpen(false);
                  if (typeof onOpenSettings === 'function') {
                    onOpenSettings();
                  }
                }}
                className="toolbar-mobile-menu-item"
                aria-label="Settings">
                <Settings size={18} style={{ marginRight: '8px' }} />
                Settings
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMobileMenuOpen(false);
                  if (typeof onOpenHelp === 'function') {
                    onOpenHelp();
                  }
                }}
                className="toolbar-mobile-menu-item"
                aria-label="Help">
                <HelpCircle size={18} style={{ marginRight: '8px' }} />
                Help
              </button>
              <button
                type="button"
                disabled={!hasContent}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!hasContent) return;
                  setIsMobileMenuOpen(false);
                  if (typeof onOpenEmail === 'function') {
                    onOpenEmail();
                  }
                }}
                className={`toolbar-mobile-menu-item ${!hasContent ? 'opacity-40 cursor-not-allowed' : ''}`}
                aria-label="Email">
                <Mail size={18} style={{ marginRight: '8px' }} />
                Email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
