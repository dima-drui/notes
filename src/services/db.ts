import { v4 } from 'uuid';
import { Note, NoteNew } from '../models/Note';
import { EntityQueryOptions } from '../models';


type NoteReadParams = {
  query?: Partial<Note>, 
  options?: EntityQueryOptions<Note>
}

export type NoteUpdateParams = Omit<Note, 'createdAt' | 'updatedAt'>

interface NoteDb {
  read({ query, options }: NoteReadParams): Promise<Note[] | []>;
  create(note: NoteNew): Promise<string | undefined>;
  update(note: NoteUpdateParams): Promise<number>;
  delete(noteId: string | string[]): Promise<number>;
}


class LocalStorageStore implements NoteDb {
  private readonly storageKey = 'notes';

  async read({ query = {}, options = {} }: { query?: Partial<Note>, options?: EntityQueryOptions<Note> }): Promise<Note[] | []> {
    return new Promise( (resolve, reject) => {
      try {
        const notes = this.getStoredNotes();
        if (notes.length === 0) return resolve(notes);

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
          return resolve(projectedNotes.slice(0, options.limit));
        }

        resolve(projectedNotes);
      } catch (error) {
        reject(error);
      }
    });
  }

  async create(note: NoteNew): Promise<string | undefined> {
    return new Promise( (resolve, reject) => {
      try {
        const id = v4();
        const noteToSave: Note = {
          id,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...note
        };
        const notes = this.getStoredNotes();
        notes.push(noteToSave);
        this.saveStoredNotes(notes);
        resolve(id);
      } catch (error) {
        reject(error);
      }
    });
  }

  async update(note: NoteUpdateParams): Promise<number> {
    return new Promise( (resolve, reject) => {
      try {
        const notes = this.getStoredNotes();
        const existingNote = notes.find((n) => n.id === note.id);
        if (existingNote) {
          existingNote.content = note.content;
          existingNote.title = note.title;
          existingNote.updatedAt = new Date();
          this.saveStoredNotes(notes);
          resolve(1); // 1 row updated
        } else {
          resolve(0); // No rows updated
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async delete(noteId: string | string[]): Promise<number> {
    return new Promise( (resolve, reject) => {
      try {
        const idsToDelete = Array.isArray(noteId) ? noteId : [noteId];
        const notes = this.getStoredNotes();
        const initialLength = notes.length;
        const filteredNotes = notes.filter((note) => !idsToDelete.includes(note.id));
        this.saveStoredNotes(filteredNotes);
        resolve(initialLength - filteredNotes.length); // Number of rows deleted
      } catch (error) {
        reject(error);
      }
    });
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
