import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { useNotesStore } from '../../store/notesStore';
import { NoteNew } from '../../models/Note';
import { NoteListIem } from './NoteListIem';
import { icons } from '../../utils/icons';
import './NotesList.css';

const NotesList: React.FC = () => {

  const noteList = useNotesStore( s => s.noteList);
  const addNote = useNotesStore( s => s.addNote);
  const removeNote = useNotesStore( s => s.removeNote);
  const selectNote = useNotesStore( s => s.selectNote);

  const handleSelect = (e: React.MouseEvent, noteId: string) => selectNote(noteId);

  const handleRemove = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation(); 
    removeNote(noteId);
  };

  const handleCreateNote = () => {
    const newNote: NoteNew = {
      title: "New Note",
      content: ""
    };
    addNote(newNote);
  };

  return (<div className='d-flex flex-column gap-2 h-100 w-100'>

    <div className='w-100'>
      <Button 
        className='w-100'
        variant="outline-primary"
        onClick={handleCreateNote}
        >
          <i className={icons.pencil} />
      </Button>
    </div>

    <ListGroup 
      variant="flush"
      className='h-100 overflow-auto hide-scrollbar'
    >
      { noteList.map( (note) => (
        <ListGroup.Item 
          key={note.id} 
          as='div'
          className="w-100"
          >
            <NoteListIem 
              note={note}
              handleSelect={handleSelect}
              handleRemove={handleRemove}
              />
        </ListGroup.Item>
      )) }
    </ListGroup>

    </div>
  );
};

export default NotesList;
