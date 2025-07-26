import { create } from 'zustand';
import { Note, NoteNew } from '../models/Note';
import { DB, NoteUpdateParams } from '../services/db';
import { EntityQueryOptions } from '../models';
import { logger } from '../utils/logger';


export type NoteItemList = Pick<Note, 'id' | 'title' | 'createdAt' | 'updatedAt'>;

export type NoteSortCriteria = {
  field: 'title' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
};

interface NotesState {
  noteList: NoteItemList[];
  currentNote: Note | null;
  currentSort: NoteSortCriteria; // Added currentSort property
  addNote: (note: NoteNew) => void;
  removeNote: (id: string) => void;
  selectNote: (id?: string) => void;
  queryNotes: (params: { query?: Partial<Note>; options?: EntityQueryOptions<Note> }) => void;
  loadNotesList: () => void;
  updateNote: (note: NoteUpdateParams) => void;
  sortNotes: (criteria: NoteSortCriteria) => void;
}

export const useNotesStore = create<NotesState>( (set, get) => ({
  noteList: [],
  currentNote: null,
  currentSort: { field: 'title', direction: 'asc' }, // Initialized currentSort

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
      const queriedNotes = DB.read( { options: { projection: ['id',  'title', 'createdAt', 'updatedAt'] }} );
      set({ noteList: queriedNotes });
    } catch (error) {
      logger.error('Error loading notes list', error);
      throw error;
    }
  },

  updateNote: (note: NoteUpdateParams) => {
    try {
      DB.update(note);
      set((s) => ({ 
        noteList: s.noteList.map((n) =>
          n.id === note.id
            ? { id: note.id, title: note.title, createdAt: n.createdAt, updatedAt: new Date() }
            : n
        ),
      }));
    } catch (error) {
      logger.error('Error updating note', error);
      throw error;
    }
  },

  sortNotes: (criteria: NoteSortCriteria) => {
    const { field, direction } = criteria;
    const { noteList, currentSort } = get();

    if (field === currentSort.field && direction === currentSort.direction) return;

    const sortedNotes = [...noteList].sort((a, b) => {
      const comparison = a[field] > b[field] ? 1 : -1;
      return direction === 'asc' ? comparison : -comparison;
    });

    set({ noteList: sortedNotes, currentSort: criteria });
  },
}));
