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
  addNote: (note: NoteNew) => Promise<string | undefined | { error: any }>;
  removeNote: (id: string) => Promise<number | { error: any }>;
  setSelectedNote: (id?: string) => Promise<void | { error: any }>;
  queryNotes: (params: { query?: Partial<Note>; options?: EntityQueryOptions<Note> }) => Promise<void | { error: any }>;
  loadNotesList: () => Promise<void | { error: any }>;
  updateNote: (note: NoteUpdateParams) => Promise<number | { error: any }>;
  updateListNote: (note: NoteUpdateParams) => void | { error: any };
  sortNotes: (criteria: NoteSortCriteria) => void | { error: any };
}

export const useNotesStore = create<NotesState>( (set, get) => ({
  noteList: [],
  currentNote: null,
  currentSort: { field: 'title', direction: 'asc' }, // Initialized currentSort

  addNote: async (note: NoteNew) => {
    try {
      return await DB.create(note);
    } catch (error) {
      logger.error('Error adding note', error);
      return { error };
    }
  },

  removeNote: async (id: string) => {
    try {
      const removeCount = await DB.delete(id);
      await get().setSelectedNote();
      return removeCount;
    } catch (error) {
      logger.error('Error removing note', error);
      return { error };
    }
  },

  setSelectedNote: async (id?: string) => {
    try {
      if (id) {
        const notes = await DB.read({ query: { id } });
        const note = notes?.[0];
        if (!note) {
          logger.error('Selected note was not found', { id });
          return { error: "Selected note was not found" };
        }
        set({ currentNote: note || null });
      } else {
        set({ currentNote: null });
      }
    } catch (error) {
      logger.error('Error selecting note', error);
      return { error };
    }
  },

  queryNotes: async ({ query = {}, options = {} }: { query?: Partial<Note>; options?: EntityQueryOptions<Note> }) => {
    try {
      const queriedNotes = await DB.read({ query, options });
      set({ noteList: queriedNotes });
    } catch (error) {
      logger.error('Error querying notes', error);
      return { error };
    }
  },

  loadNotesList: async () => {
    try {
      await get().queryNotes({ options: { projection: ['id',  'title', 'createdAt', 'updatedAt'] } })
    } catch (error) {
      logger.error('Error loading notes list', error);
      return { error };
    }
  },

  updateNote: async (note: NoteUpdateParams) => {
    try {
      const updateQty = await DB.update(note);
      get().updateListNote(note)
      return updateQty
    } catch (error) {
      logger.error('Error updating note', error);
      return {error};
    }
  },

  updateListNote: (note: NoteUpdateParams) => {
    try {
      set((s) => ({ 
        noteList: s.noteList.map((n) =>
          n.id === note.id
            ? { id: note.id, title: note.title, createdAt: n.createdAt, updatedAt: new Date() }
            : n
        ),
      }));
    } catch (error) {
      logger.error('Error updating list w note', {error, note});
      return { error };
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
