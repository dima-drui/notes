import { v4 } from 'uuid';
import { Note, NoteNew } from '../models/Note';
import { EntityQueryOptions } from '../models';


type NoteReadParams = {
  query?: Partial<Note>, 
  options?: EntityQueryOptions<Note>
}

export type NoteUpdateParams = Omit<Note, 'createdAt' | 'updatedAt'>

interface NoteDb {
  create(note: NoteNew): string;
  read({ query, options }: NoteReadParams): Note[] | [];
  update(note: NoteUpdateParams): number;
  delete(noteId: string | string[]): number;
}


class LocalStorageStore implements NoteDb {
  private readonly storageKey = 'notes';

  read({ query = {}, options = {} }: { query?: Partial<Note>, options?: EntityQueryOptions<Note> }): Note[] | [] {
    const notes = this.getStoredNotes();
    if (notes.length === 0) return notes;

    // imitating db behavior

    try {
      // Filter notes based on the query
      const filteredNotes = Object.keys(query).length
        ? notes.filter((note) => {
            return Object.entries(query).every(([key, value]) => {
              return note[key as keyof Note] === value;
            });
          })
        : notes;

      // Apply sorting based on the sortBy object
      if (options.sortBy) {
        filteredNotes.sort((a, b) => {
          for (const [key, order] of Object.entries(options.sortBy ?? {})) {
            const fieldA = a[key as keyof Note];
            const fieldB = b[key as keyof Note];

            if (fieldA < fieldB) return order === 1 ? -1 : 1;
            if (fieldA > fieldB) return order === 1 ? 1 : -1;
          }
          return 0; // If all fields are equal
        });
      }

      // Apply projection to include/exclude fields
      const projection = options.projection;
      const projectedNotes = (projection && projection.length > 0)
        ? filteredNotes.map((note: Note) => {
            const projectedNote: Partial<Note> = {};
            for (const key of projection) {
              Object.assign(projectedNote, { [key]: note[key] });
            }
            return projectedNote as Note;
          })
        : filteredNotes;

      // Apply pagination (limit)
      if (options.limit) {
        return projectedNotes.slice(0, options.limit);
      }

      return projectedNotes;
    } catch (error) {
      throw error;
    }
  }

  create(note: NoteNew): string {
    try {
      const id = v4();
      const noteToSave: Note = {
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...note
      }
      const notes = this.getStoredNotes();
      notes.push(noteToSave);
      this.saveStoredNotes(notes);
      return id;
    } catch (error) {
      throw error;
    }
  }

  update(note: NoteUpdateParams): number {
    try {
      const notes = this.getStoredNotes();
      const existingNote = notes.find((n) => n.id === note.id);
      if (existingNote) {
        existingNote.content = note.content;
        existingNote.title = note.title;
        existingNote.updatedAt = new Date();
        this.saveStoredNotes(notes);
        return 1; // 1 row updated
      }
      return 0; // No rows updated
    } catch (error) {
      throw error;
    }
  }

  delete(noteId: string | string[]): number {
    try {
      const idsToDelete = Array.isArray(noteId) ? noteId : [noteId];
      const notes = this.getStoredNotes();
      const initialLength = notes.length;
      const filteredNotes = notes.filter((note) => !idsToDelete.includes(note.id));
      this.saveStoredNotes(filteredNotes);
      return initialLength - filteredNotes.length; // Number of rows deleted
    } catch (error) {
      throw error;
    }
  }

  private getStoredNotes(): Note[] {
    try {
      const notes = localStorage.getItem(this.storageKey);
      return notes ? JSON.parse(notes) : [];
    } catch (error) {
      throw error;
    }
  }

  private saveStoredNotes(notes: Note[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(notes));
    } catch (error) {
      throw error;
    }
  }
}

export const DB: NoteDb = new LocalStorageStore();
