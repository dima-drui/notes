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
  addNote: (note: NoteNew) => Promise<string | undefined>;
  removeNote: (id: string) => Promise<number>;
  setSelectedNote: (id?: string) => Promise<void>;
  queryNotes: (params: { query?: Partial<Note>; options?: EntityQueryOptions<Note> }) => Promise<void>;
  loadNotesList: () => Promise<void>;
  updateNote: (note: NoteUpdateParams) => void;
  updateListNote: (note: NoteUpdateParams) => void;
  sortNotes: (criteria: NoteSortCriteria) => void;
}

export const useNotesStore = create<NotesState>( (set, get) => ({
  noteList: [],
  currentNote: null,
  currentSort: { field: 'title', direction: 'asc' }, // Initialized currentSort

  addNote: async (note: NoteNew): Promise<string | undefined> => {
    try {
      return await DB.create(note);
    } catch (error) {
      logger.error('Error adding note', error);
      throw error;
    }
  },

  removeNote: async (id: string): Promise<number> => {
    try {
     return await DB.delete(id);
    } catch (error) {
      logger.error('Error removing note', error);
      throw error;
    }
  },

  setSelectedNote: async (id?: string): Promise<void> => {
    try {
      if (id) {
        const notes = await DB.read({ query: { id } });
        const note = notes?.[0];
        if (!note) {
          logger.error('Selected note was not found', { id });
          throw new Error('Selected note was not found');
        }
        set({ currentNote: note || null });
      } else {
        set({ currentNote: null });
      }
    } catch (error) {
      logger.error('Error selecting note', error);
      throw error;
    }
  },

  queryNotes: async ({ query = {}, options = {} }: { query?: Partial<Note>; options?: EntityQueryOptions<Note> }): Promise<void> => {
    try {
      const queriedNotes = await DB.read({ query, options });
      set({ noteList: queriedNotes });
    } catch (error) {
      logger.error('Error querying notes', error);
      throw error;
    }
  },

  loadNotesList: async (): Promise<void> => {
    try {
      await get().queryNotes({ options: { projection: ['id',  'title', 'createdAt', 'updatedAt'] } })
    } catch (error) {
      logger.error('Error loading notes list', error);
      throw error;
    }
  },

  updateNote: (note: NoteUpdateParams) => {
    try {
      DB.update(note);
      get().updateListNote(note)
    } catch (error) {
      logger.error('Error updating note', error);
      throw error;
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
