import { create } from 'zustand';
import { Note, NoteNew } from '../models/Note';
import { DB, NoteUpdateParams } from '../services/db';
import { EntityQueryOptions } from '../models';
import { logger } from '../utils/logger';

interface NotesState {
  noteList: Pick<Note, 'id' | 'title'>[];
  currentNote: Note | null;
  addNote: (note: NoteNew) => void;
  removeNote: (id: string) => void;
  selectNote: (id?: string) => void;
  queryNotes: (params: { query?: Partial<Note>; options?: EntityQueryOptions<Note> }) => void;
  loadNotesList: () => void;
  updateNote: (note: NoteUpdateParams) => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  noteList: [],
  currentNote: null,

  addNote: (note: NoteNew) => {
    try {
      const id = DB.create(note);
      get().loadNotesList();
      get().selectNote(id);
    } catch (error) {
      logger.error('Error adding note', error);
      throw error;
    }
  },

  removeNote: (id: string) => {
    try {
      DB.delete(id);
      get().loadNotesList();
      get().selectNote();
    } catch (error) {
      logger.error('Error removing note', error);
      throw error;
    }
  },

  selectNote: (id?: string) => {
    try {
      if (id) {
        const note = DB.read({ query: { id } })[0] || null;
        set({ currentNote: note });
      } else {
        set({ currentNote: null });
      }
    } catch (error) {
      logger.error('Error selecting note', error);
      throw error;
    }
  },

  queryNotes: ({ query = {}, options = {} }: { query?: Partial<Note>; options?: EntityQueryOptions<Note> }) => {
    try {
      const queriedNotes = DB.read({ query, options });
      set({ noteList: queriedNotes });
    } catch (error) {
      logger.error('Error querying notes', error);
      throw error;
    }
  },

  loadNotesList: () => {
    try {
      const queriedNotes = DB.read( { options: { projection: ['id',  'title'] }} );
      set({ noteList: queriedNotes });
    } catch (error) {
      logger.error('Error loading notes list', error);
      throw error;
    }
  },

  updateNote: (note: NoteUpdateParams) => {
    try {
      DB.update(note);
      set( 
        s => ({ 
            noteList: [ ...s.noteList.map( n => n.id == note.id ? note : n  ) ] 
        })
      );
    } catch (error) {
      logger.error('Error updating note', error);
      throw error;
    }
  },
}));
