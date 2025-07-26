import React, { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useNotesStore } from '../../store/notesStore';
import { useForm } from 'react-hook-form';
import { useToastStore, ToastType } from '../../store/toastStore';


const NoteEditor: React.FC = () => {

  const currentNote = useNotesStore( s => s.currentNote);
  const updateNote = useNotesStore( s => s.updateNote);
  const toast = useToastStore();

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

  const save = async () => {
    if (currentNote == null) return;
    const values = getValues();
    if (
      currentNote.title === values.title &&
      currentNote.content === values.content
    ) return;

    const res = await updateNote({ id: currentNote.id, ...values });
    if ( res == 0 || (typeof res !== 'number' && res.error) ) {
      toast.addToast("Failed to save the note. Please try again.", ToastType.ERROR);
    }
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
      save();
    }
  };

  if (!currentNote) {
    return <p>Select a note to edit or create a new one.</p>;
  }

  return (
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
  );
};

export default NoteEditor;
