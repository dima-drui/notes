import { DB } from '../services/db';
import { NoteNew } from '../models/Note';

describe('DB.create', () => {
  const originalLocalStorage = globalThis.localStorage;
  let localStorageMock: any;

  beforeAll(() => {
    localStorageMock = (function() {
      let store: Record<string, string> = {};
      return {
        getItem(key: string) {
          return store[key] || null;
        },
        setItem(key: string, value: string) {
          store[key] = value;
        },
        clear() {
          store = {};
        },
        removeItem(key: string) {
          delete store[key];
        }
      };
    })();
    globalThis.localStorage = localStorageMock;
  });

  it('should create, read, update, and delete a task (note) as expected', async () => {
    // 1) Create new task
    const note: NoteNew = { title: 'Initial Title', content: 'Initial Content' };
    const id = await DB.create(note);
    expect(typeof id).toBe('string');

    // 2) Read the created task
    let notes = await DB.read({ query: { id } });
    expect(notes.length).toBe(1);
    expect(notes[0].title).toBe(note.title);
    expect(notes[0].content).toBe(note.content);
    expect(notes[0].id).toBe(id);

    // 3) Update the task name to task 1
    const updateTitleResult = await DB.update({ id, title: 'task 1', content: notes[0].content });
    expect(updateTitleResult).toBe(1);
    notes = await DB.read({ query: { id } });
    expect(notes[0].title).toBe('task 1');
    expect(notes[0].content).toBe('Initial Content');

    // 4) Update the task content to task 1 content
    const updateContentResult = await DB.update({ id, title: notes[0].title, content: 'task 1 content' });
    expect(updateContentResult).toBe(1);
    notes = await DB.read({ query: { id } });
    expect(notes[0].title).toBe('task 1');
    expect(notes[0].content).toBe('task 1 content');

    // 5) Remove the task
    const deleteResult = await DB.delete(id);
    expect(deleteResult).toBe(1);
    notes = await DB.read({ query: { id } });
    expect(notes.length).toBe(0);
  });
});
