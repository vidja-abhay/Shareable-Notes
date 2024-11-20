import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import RichTextEditor from './components/TextEditor';
import NoteList from './components/NoteList';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster, toast } from 'react-hot-toast'; // Import toast

const App = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    setNotes(savedNotes);
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes]);

  const handleAddNote = () => {
    const baseTitle = 'Untitled';
    const newTitle = generateUniqueTitle(baseTitle);

    const newNote = {
      id: crypto.randomUUID(),
      title: newTitle,
      content: '',
      isPinned: false,
      lastModified: Date.now(),
    };

    setNotes((prevNotes) => [...prevNotes, newNote]);
    setSelectedNote(newNote);
    
    // Show success toast
    toast.success('New note created!');
  };

  const generateUniqueTitle = (baseTitle) => {
    let counter = 1;
    let newTitle = baseTitle;
    while (notes.some((note) => note.title === newTitle)) {
      newTitle = `${baseTitle} ${counter}`;
      counter++;
    }
    return newTitle;
  };

  const handleTitleChange = (event) => {
    let updatedTitle = event.target.value.trim();

    if (selectedNote) {
      const updatedNotes = notes.map((note) =>
        note.id === selectedNote.id ? { ...note, title: updatedTitle, lastModified: Date.now() } : note
      );
      setNotes(updatedNotes);
      setSelectedNote({ ...selectedNote, title: updatedTitle });
    }
  };

  const togglePin = (id) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    );

    const sortedNotes = [...updatedNotes].sort((a, b) => {
      if (a.isPinned === b.isPinned) {
        return b.lastModified - a.lastModified;
      }
      return b.isPinned - a.isPinned;
    });

    setNotes(sortedNotes);

    // Show toast for pinning/unpinning
    toast.success('Note pinned/unpinned!');
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }

    // Show success toast
    toast.success('Note deleted!');
  };

  const handleNoteContentChange = (content) => {
    if (selectedNote) {
      const updatedNotes = notes.map((note) =>
        note.id === selectedNote.id ? { ...note, content, lastModified: Date.now() } : note
      );
      setNotes(updatedNotes);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Toast Provider */}

      {/* Sticky Header */}
      <Header />

      <Toaster />
      {/* Main Content Area */}
      <main className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar with Notes */}
        <div className="lg:w-1/4 w-full bg-white shadow-md p-6 overflow-y-auto">
          <div className="mb-6">
            <button
              onClick={handleAddNote}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center"
            >
              <PlusCircle className="mr-2" size={20} /> Create New Note
            </button>
          </div>
          {notes.length === 0 ? (
            <div className="text-center text-gray-500">
              <p>No Notes yet.</p>
            </div>
          ) : (
            <NoteList
              notes={notes}
              togglePin={togglePin}
              deleteNote={deleteNote}
              setSelectedNote={setSelectedNote}
              selectedNote={selectedNote}
            />
          )}
        </div>

        {/* Note Editor */}
        <div className="lg:w-3/4 w-full p-6 overflow-y-auto">
          {selectedNote ? (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={handleTitleChange}
                  className="text-2xl font-semibold text-gray-800 w-full bg-transparent border-b-2 border-gray-300 focus:border-indigo-600 outline-none"
                />
              </div>
              <RichTextEditor
                selectedNote={selectedNote}
                handleNoteContentChange={handleNoteContentChange}
              />
            </>
          ) : (
            <div className="text-center text-gray-500">
              <p>Select a note to edit or create a new one.</p>
            </div>
          )}
        </div>
      </main>

      {/* Sticky Footer */}
      <Footer />
    </div>
  );
};

export default App;
