import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Minus, Plus } from 'lucide-react';

const RichTextEditor = ({ selectedNote, handleNoteContentChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && selectedNote) {
      editorRef.current.innerHTML = selectedNote.content; // Set initial content when a note is selected
    }
  }, [selectedNote]);

  // Function to execute rich text commands
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      handleNoteContentChange(editorRef.current.innerHTML); // Trigger content change callback
    }
  };

  // Handle content change
  const handleInput = () => {
    if (editorRef.current) {
      handleNoteContentChange(editorRef.current.innerHTML); // Trigger change callback
    }
  };

  // Adjust font size
  const adjustFontSize = (increase) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        const selectedText = range.extractContents();
        const span = document.createElement('span');

        const parentElement = range.startContainer.parentElement;
        const currentSize = parseInt(
          window.getComputedStyle(parentElement).fontSize.replace('px', '') || '16',
          10
        );
        const newSize = Math.max(10, Math.min(72, currentSize + (increase ? 2 : -2)));

        span.style.fontSize = `${newSize}px`;
        span.appendChild(selectedText);
        range.insertNode(span);

        selection.removeAllRanges();
        handleNoteContentChange(editorRef.current.innerHTML);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-white rounded-lg shadow-xl max-w-5xl mx-auto">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg shadow-md">
        {/* Formatting Buttons */}
        <button
          onClick={() => execCommand('bold')}
          title="Bold"
          className="p-2 hover:bg-indigo-100 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          <Bold size={20} className="text-gray-600" />
        </button>
        <button
          onClick={() => execCommand('italic')}
          title="Italic"
          className="p-2 hover:bg-indigo-100 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          <Italic size={20} className="text-gray-600" />
        </button>
        <button
          onClick={() => execCommand('underline')}
          title="Underline"
          className="p-2 hover:bg-indigo-100 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          <Underline size={20} className="text-gray-600" />
        </button>
        <button
          onClick={() => execCommand('justifyLeft')}
          title="Align Left"
          className="p-2 hover:bg-indigo-100 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          <AlignLeft size={20} className="text-gray-600" />
        </button>
        <button
          onClick={() => execCommand('justifyCenter')}
          title="Align Center"
          className="p-2 hover:bg-indigo-100 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          <AlignCenter size={20} className="text-gray-600" />
        </button>
        <button
          onClick={() => execCommand('justifyRight')}
          title="Align Right"
          className="p-2 hover:bg-indigo-100 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          <AlignRight size={20} className="text-gray-600" />
        </button>
        <button
          onClick={() => adjustFontSize(false)}
          title="Decrease Font Size"
          className="p-2 hover:bg-indigo-100 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          <Minus size={20} className="text-gray-600" />
        </button>
        <button
          onClick={() => adjustFontSize(true)}
          title="Increase Font Size"
          className="p-2 hover:bg-indigo-100 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          <Plus size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Editable Content Area */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[400px] p-4 focus:outline-none prose max-w-none bg-gray-50 rounded-b-lg shadow-inner"
        onInput={handleInput}
        spellCheck="true"
        style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          lineHeight: '1.6',
        }}
      />
    </div>
  );
};

export default RichTextEditor;
