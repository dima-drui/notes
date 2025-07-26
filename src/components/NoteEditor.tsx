import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useNotesStore } from '../store/notesStore';


const NoteEditor: React.FC = () => {
  const { currentNote, updateNote } = useNotesStore();

  const [title, setTitle] = useState(currentNote?.title || '');
  const [content, setContent] = useState(currentNote?.content || '');

  useEffect(() => {
    if (currentNote) {
      // setTitle(currentNote.title);
      // setContent(currentNote.content);
    }
  }, [ currentNote?.id ]);

  useEffect(() => {
    return () => {
      if (currentNote) {
        updateNote({ id: currentNote.id, title, content });
      }
    };
  }, [currentNote, title, content ]);

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  if (!currentNote) {
    return <p>Select a note to edit or create a new one.</p>;
  }

  return (
    <div>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={onTitleChange}
            placeholder="Title"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={content}
            onChange={onContentChange}
            placeholder="Content"
          />
        </Form.Group>
      </Form>
    </div>
  );
};

export default NoteEditor;
