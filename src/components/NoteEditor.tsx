import React, { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useNotesStore } from '../store/notesStore';
import { useForm } from 'react-hook-form';


const NoteEditor: React.FC = () => {

  console.log('NoteEditor')

  const currentNote = useNotesStore( s => s.currentNote);
  const updateNote = useNotesStore( s => s.updateNote);

  // const { currentNote, updateNote } = useNotesStore();
  const { register, setValue, getValues } = useForm({
    defaultValues: {
      title: currentNote?.title || '',
      content: currentNote?.content || ''
    }
  });

  const initValues = () => {
    if (currentNote == null) return
    setValue('title', currentNote.title)
    setValue('content', currentNote.content)
  }

  const save = () => {
    if (currentNote == null) return
    
    const values = getValues();
    if (currentNote.title === values.title 
      && currentNote.content === values.content 
    ) return

    updateNote({ id: currentNote.id, ...values });
  };

  useEffect( () => {
    initValues()
    return () => {
      save()
    }
  }, [ currentNote?.id ]);


  const handleTitleBlur = () => {
    const values = getValues();
    if (currentNote?.title !== values.title) {
      updateNote({ id: currentNote.id, title: values.title, content: values.content });
    }
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
            { ...register('title') }
            placeholder="Title"
            onBlur={handleTitleBlur}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            { ...register('content') }
            placeholder="Content"
          />
        </Form.Group>
      </Form>
    </div>
  );
};

export default NoteEditor;
