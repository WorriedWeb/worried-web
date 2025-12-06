import React, { useState, useEffect, useRef } from 'react';
import { Bold, Italic, List, AlignLeft, AlignCenter, Type, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface RichTextEditorProps {
  initialValue?: string;
  onChange: (html: string) => void;
  label?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialValue = '', onChange, label }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [html, setHtml] = useState(initialValue);

  // Sync initial value changes
  useEffect(() => {
    if (editorRef.current && initialValue !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = initialValue;
      setHtml(initialValue);
    }
  }, []); // Only run on mount to avoid cursor jumping

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setHtml(content);
      onChange(content);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
    handleInput();
  };

  const triggerImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          // Restore focus before inserting
          if (editorRef.current) editorRef.current.focus();
          execCommand('insertImage', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLink = () => {
    // Save selection logic could go here, but simple prompt usually works if focus is maintained
    const url = prompt('Enter URL:');
    if (url) {
      if (editorRef.current) editorRef.current.focus();
      execCommand('createLink', url);
    }
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <div className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden bg-white dark:bg-gray-700 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-shadow">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
          <ToolbarBtn onClick={() => execCommand('bold')} icon={<Bold className="w-4 h-4" />} title="Bold" />
          <ToolbarBtn onClick={() => execCommand('italic')} icon={<Italic className="w-4 h-4" />} title="Italic" />
          <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
          <ToolbarBtn onClick={() => execCommand('formatBlock', 'H2')} icon={<Type className="w-4 h-4" />} title="Heading" />
          <ToolbarBtn onClick={() => execCommand('insertUnorderedList')} icon={<List className="w-4 h-4" />} title="Bullet List" />
          <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
          <ToolbarBtn onClick={() => execCommand('justifyLeft')} icon={<AlignLeft className="w-4 h-4" />} title="Align Left" />
          <ToolbarBtn onClick={() => execCommand('justifyCenter')} icon={<AlignCenter className="w-4 h-4" />} title="Align Center" />
          <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>
          <ToolbarBtn onClick={handleLink} icon={<LinkIcon className="w-4 h-4" />} title="Insert Link" />
          <ToolbarBtn onClick={triggerImageUpload} icon={<ImageIcon className="w-4 h-4" />} title="Insert Image" />
          
          {/* Hidden File Input for Images */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        
        {/* Editor Area */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="min-h-[250px] p-4 outline-none text-dark dark:text-white prose dark:prose-invert max-w-none overflow-y-auto"
          style={{ maxHeight: '400px' }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">Select text to apply formatting.</p>
    </div>
  );
};

// Use onMouseDown with preventDefault to keep focus on the editor
const ToolbarBtn: React.FC<{ onClick: () => void; icon: React.ReactNode; title: string }> = ({ onClick, icon, title }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    title={title}
    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
  >
    {icon}
  </button>
);