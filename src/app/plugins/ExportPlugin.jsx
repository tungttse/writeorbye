import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { useImperativeHandle } from 'react';

export default function ExportPlugin({ exportRef }) {
  const [editor] = useLexicalComposerContext();

  useImperativeHandle(exportRef, () => ({
    exportAsText: () => {
      return editor.getEditorState().read(() => {
        return $getRoot().getTextContent();
      });
    },
    
    exportAsMarkdown: () => {
      return editor.getEditorState().read(() => {
        const root = $getRoot();
        let markdown = '';
        
        root.getChildren().forEach((node) => {
          const text = node.getTextContent();
          
          // Check for text formatting by examining text nodes
          if (node.getType() === 'paragraph') {
            const textNodes = node.getAllTextNodes ? node.getAllTextNodes() : [];
            let formattedText = '';
            
            textNodes.forEach((textNode) => {
              let nodeText = textNode.getTextContent();
              const format = textNode.getFormat ? textNode.getFormat() : 0;
              
              // Apply markdown formatting based on format flags
              // Format is a bitmask: 1=bold, 2=italic, 4=strikethrough, 8=underline
              if (format & 1) nodeText = `**${nodeText}**`; // bold
              if (format & 2) nodeText = `*${nodeText}*`; // italic
              if (format & 4) nodeText = `~~${nodeText}~~`; // strikethrough
              
              formattedText += nodeText;
            });
            
            markdown += (formattedText || text) + '\n\n';
          } else {
            markdown += text + '\n\n';
          }
        });
        
        return markdown.trim();
      });
    },
    
    downloadFile: (content, filename, type = 'text/plain') => {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }));

  return null;
}
