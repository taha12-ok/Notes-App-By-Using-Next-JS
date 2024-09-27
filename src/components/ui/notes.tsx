"use client"; // Enables client-side rendering for this component

import { useState, useEffect } from "react"; // Import useState and useEffect hooks from React
import { Button } from "@/components/ui/button"; // Import custom Button component
import { Card } from "@/components/ui/card"; // Import custom Card component
import { FilePenIcon, TrashIcon } from "lucide-react"; // Import icons from lucide-react

// Define the Note type
type Note = {
  id: number;
  title: string;
  content: string;
};

// Default notes to initialize the app with
const defaultNotes: Note[] = [
  {
    id: 1,
    title: "Grocery List",
    content: "Milk, Eggs, Bread, Apples",
  },
  {
    id: 2,
    title: "Meeting Notes",
    content: "Discuss new project timeline, assign tasks to team",
  },
  {
    id: 3,
    title: "Idea for App",
    content: "Develop a note-taking app with a clean and minimalist design",
  },
];

// Custom hook to manage localStorage with state
function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store the value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // useEffect to load stored value from localStorage when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [key]);

  // Function to set a new value both in state and localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

export default function NotesApp() {
  // State to manage notes using localStorage
  const [notes, setNotes] = useLocalStorage<Note[]>("notes", defaultNotes);
  // State to manage new note input
  const [newNote, setNewNote] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  });
  // State to manage the ID of the note being edited
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  // State to check if the component is mounted
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // useEffect to set the component as mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Function to handle adding a new note
  const handleAddNote = (): void => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const newNoteWithId = { id: Date.now(), ...newNote };
      setNotes([...notes, newNoteWithId]);
      setNewNote({ title: "", content: "" });
    }
  };

  // Function to handle editing a note
  const handleEditNote = (id: number): void => {
    const noteToEdit = notes.find((note) => note.id === id);
    if (noteToEdit) {
      setNewNote({ title: noteToEdit.title, content: noteToEdit.content });
      setEditingNoteId(id);
    }
  };

  // Function to handle updating a note
  const handleUpdateNote = (): void => {
    if (newNote.title.trim() && newNote.content.trim()) {
      setNotes(
        notes.map((note) =>
          note.id === editingNoteId
            ? { id: note.id, title: newNote.title, content: newNote.content }
            : note
        )
      );
      setNewNote({ title: "", content: "" });
      setEditingNoteId(null);
    }
  };

  // Function to handle deleting a note
  const handleDeleteNote = (id: number): void => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  // Return null if the component is not mounted to avoid SSR issues
  if (!isMounted) {
    return null;
  }

  // JSX return statement rendering the Notes App UI
  return (
    <div className="flex flex-col h-screen bg-[#F3ECE7] text-[#333333]">
  <header className="bg-[#FDFCFB] p-6 shadow-md">
    <h1 className="text-3xl font-bold text-center">Note Taker</h1>
  </header>
  <main className="flex-1 overflow-auto p-6">
    <div className="mb-6 max-w-xl mx-auto">
      {/* Input for note title */}
      <input
        type="text"
        placeholder="Title"
        value={newNote.title || ""}
        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        className="w-full h-12 rounded-md border border-[#6D6D6D] bg-[#FAF0E6] px-4 text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all"
      />
      {/* Textarea for note content */}
      <textarea
        placeholder="Content"
        value={newNote.content || ""}
        onChange={(e) =>
          setNewNote({ ...newNote, content: e.target.value })
        }
        className="mt-4 w-full h-32 rounded-md border border-[#6D6D6D] bg-[#FAF0E6] px-4 py-2 text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#8B0000] transition-all"
      />
      {/* Button to add or update note */}
      {editingNoteId === null ? (
        <button
          onClick={handleAddNote}
          className="mt-4 w-full h-12 bg-[#8B0000] text-white rounded-md hover:bg-[#A52A2A] transition-all focus:outline-none"
        >
          Add Note
        </button>
      ) : (
        <button
          onClick={handleUpdateNote}
          className="mt-4 w-full h-12 bg-[#8B0000] text-white rounded-md hover:bg-[#A52A2A] transition-all focus:outline-none"
        >
          Update Note
        </button>
      )}
    </div>

    {/* Display list of notes */}
    <div className="grid gap-6 max-w-xl mx-auto">
      {notes.map((note) => (
        <div
          key={note.id}
          className="p-6 bg-[#FDFCFB] shadow-lg rounded-md border border-[#E0E0E0] hover:shadow-xl transition-all"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{note.title}</h2>
            <div className="flex space-x-2">
              <button
                className="bg-transparent hover:bg-[#F3ECE7] p-2 rounded-md focus:outline-none"
                onClick={() => handleEditNote(note.id)}
              >
                <FilePenIcon className="h-5 w-5 text-[#6D6D6D]" />
              </button>
              <button
                className="bg-transparent hover:bg-[#F3ECE7] p-2 rounded-md focus:outline-none"
                onClick={() => handleDeleteNote(note.id)}
              >
                <TrashIcon className="h-5 w-5 text-[#6D6D6D]" />
              </button>
            </div>
          </div>
          <p className="mt-3 text-[#495057]">{note.content}</p>
        </div>
      ))}
    </div>
  </main>
</div>


  );
}