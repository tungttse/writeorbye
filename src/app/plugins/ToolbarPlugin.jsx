/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
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
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Undo2, Redo2, Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Timer, Target, Trash2, Moon, Sun, Maximize,
  Download, Settings, HelpCircle, Mail, Menu, Home
} from 'lucide-react';
import Link from 'next/link';

const Divider = () => <div className="divider" />;

// Reusable toolbar button component
const ToolbarButton = ({ onClick, disabled, active, spaced, title, ariaLabel, children }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`toolbar-item ${spaced ? 'spaced' : ''} ${active ? 'active' : ''} ${disabled ? 'opacity-40' : ''}`}
    aria-label={ariaLabel}
    title={title}
  >
    {children}
  </button>
);

// Reusable mobile menu item component
const MobileMenuItem = ({ onClick, disabled, ariaLabel, icon: Icon, label, isDynamic, dynamicIcon: DynamicIcon }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`toolbar-mobile-menu-item ${disabled ? 'opacity-40' : ''}`}
    aria-label={ariaLabel}
  >
    {isDynamic && DynamicIcon ? <DynamicIcon size={18} style={{ marginRight: '8px' }} /> : <Icon size={18} style={{ marginRight: '8px' }} />}
    {label}
  </button>
);

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
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => $updateToolbar(), { editor });
      }),
      editor.registerCommand(SELECTION_CHANGE_COMMAND, () => { $updateToolbar(); return false; }, COMMAND_PRIORITY_LOW),
      editor.registerCommand(CAN_UNDO_COMMAND, (payload) => { setCanUndo(payload); return false; }, COMMAND_PRIORITY_LOW),
      editor.registerCommand(CAN_REDO_COMMAND, (payload) => { setCanRedo(payload); return false; }, COMMAND_PRIORITY_LOW),
    );
  }, [editor, $updateToolbar]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleClickOutside = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Format buttons config
  const formatButtons = [
    { format: 'bold', icon: Bold, active: isBold, label: 'Format Bold' },
    { format: 'italic', icon: Italic, active: isItalic, label: 'Format Italics' },
    { format: 'underline', icon: Underline, active: isUnderline, label: 'Format Underline' },
    { format: 'strikethrough', icon: Strikethrough, active: isStrikethrough, label: 'Format Strikethrough' },
  ];

  // Alignment buttons config
  const alignButtons = [
    { align: 'left', icon: AlignLeft, label: 'Left Align' },
    { align: 'center', icon: AlignCenter, label: 'Center Align' },
    { align: 'right', icon: AlignRight, label: 'Right Align' },
    { align: 'justify', icon: AlignJustify, label: 'Justify Align', spaced: false },
  ];

  // Action buttons config
  const actionButtons = [
    { onClick: onToggleFullScreen, icon: Maximize, title: 'Full Screen', ariaLabel: 'Full Screen' },
    { onClick: onToggleDarkMode, icon: isDarkMode ? Sun : Moon, title: isDarkMode ? 'Light Mode' : 'Dark Mode', ariaLabel: 'Dark Mode' },
    { onClick: onSetWordTarget, icon: Target, title: 'Set Target', ariaLabel: 'Set Target' },
    { onClick: onSetTimer, icon: Timer, title: 'Set Timer', ariaLabel: 'Set Timer' },
    { onClick: onClearText, icon: Trash2, title: hasContent ? 'Clear Text' : 'Nothing to clear', ariaLabel: 'Clear Text', disabled: !hasContent, spaced: false },
    { onClick: onOpenExport, icon: Download, title: hasContent ? 'Export' : 'Nothing to export', ariaLabel: 'Export', disabled: !hasContent },
    { onClick: onOpenSettings, icon: Settings, title: 'Settings', ariaLabel: 'Settings', spaced: false },
    { onClick: onOpenEmail, icon: Mail, title: hasContent ? 'Email to yourself' : 'Nothing to email', ariaLabel: 'Email', disabled: !hasContent, spaced: false },
    { onClick: onOpenHelp, icon: HelpCircle, title: 'Help', ariaLabel: 'Help', spaced: false },
  ];

  // Mobile menu items config
  const mobileMenuItems = [
    { onClick: onToggleFullScreen, icon: Maximize, label: 'Full Screen', ariaLabel: 'Full Screen' },
    { onClick: onToggleDarkMode, icon: isDarkMode ? Sun : Moon, label: isDarkMode ? 'Light Mode' : 'Dark Mode', ariaLabel: isDarkMode ? 'Light Mode' : 'Dark Mode' },
    { onClick: onSetWordTarget, icon: Target, label: 'Set Target', ariaLabel: 'Set Target' },
    { onClick: onSetTimer, icon: Timer, label: 'Set Timer', ariaLabel: 'Set Timer' },
    { onClick: onClearText, icon: Trash2, label: 'Clear Text', ariaLabel: 'Clear Text', disabled: !hasContent },
    { onClick: onOpenExport, icon: Download, label: 'Export', ariaLabel: 'Export', disabled: !hasContent },
    { onClick: onOpenSettings, icon: Settings, label: 'Settings', ariaLabel: 'Settings' },
    { onClick: onOpenHelp, icon: HelpCircle, label: 'Help', ariaLabel: 'Help' },
    { onClick: onOpenEmail, icon: Mail, label: 'Email', ariaLabel: 'Email', disabled: !hasContent },
  ];

  return (
    <div className={`toolbar ${!isSessionActive ? 'no-stats' : ''}`} ref={toolbarRef}>
      {/* Left side - Formatting buttons */}
      <div className="toolbar-left">
        <Link href="/" className="toolbar-item spaced" aria-label="Home" title="Back to Home">
          <Home size={18} />
        </Link>
        <Divider />
        <ToolbarButton disabled={!canUndo} onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} spaced ariaLabel="Undo">
          <Undo2 size={18} />
        </ToolbarButton>
        <ToolbarButton disabled={!canRedo} onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} ariaLabel="Redo">
          <Redo2 size={18} />
        </ToolbarButton>
        <Divider />
        {formatButtons.map(({ format, icon: Icon, active, label }) => (
          <ToolbarButton
            key={format}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)}
            active={active}
            spaced
            ariaLabel={label}
          >
            <Icon size={18} />
          </ToolbarButton>
        ))}
        <Divider />
        {alignButtons.map(({ align, icon: Icon, label, spaced = true }) => (
          <ToolbarButton
            key={align}
            onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align)}
            spaced={spaced}
            ariaLabel={label}
          >
            <Icon size={18} />
          </ToolbarButton>
        ))}
      </div>

      {/* Right side - Action buttons */}
      <div className="toolbar-right">
        <Divider />
        <div className="toolbar-right-buttons">
          {actionButtons.map(({ onClick, icon: Icon, title, ariaLabel, disabled, spaced = true }) => (
            <ToolbarButton
              key={ariaLabel}
              onClick={disabled ? undefined : onClick}
              disabled={disabled}
              spaced={spaced}
              title={title}
              ariaLabel={ariaLabel}
            >
              <Icon size={18} />
            </ToolbarButton>
          ))}
        </div>

        {/* Mobile menu */}
        <div className="toolbar-mobile-menu">
          <ToolbarButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} ariaLabel="More Options" title="More Options">
            <Menu size={18} />
          </ToolbarButton>

          {isMobileMenuOpen && (
            <div className="toolbar-mobile-dropdown">
              <Link href="/" className="toolbar-mobile-menu-item" onClick={closeMobileMenu} aria-label="Home">
                <Home size={18} style={{ marginRight: '8px' }} />
                Back to Home
              </Link>
              {mobileMenuItems.map(({ onClick, icon: Icon, label, ariaLabel, disabled }) => (
                <MobileMenuItem
                  key={ariaLabel}
                  onClick={() => { if (!disabled) { closeMobileMenu(); onClick(); } }}
                  disabled={disabled}
                  icon={Icon}
                  label={label}
                  ariaLabel={ariaLabel}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
