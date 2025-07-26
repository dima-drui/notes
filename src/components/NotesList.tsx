import React, { useEffect } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { useNotesStore } from '../store/notesStore';
import { icons } from '../utils/icons';
import { NoteNew } from '../models/Note';


const NotesList: React.FC = () => {

  console.log('NotesList')

  const noteList = useNotesStore( s => s.noteList);
  const addNote = useNotesStore( s => s.addNote);
  const removeNote = useNotesStore( s => s.removeNote);
  const selectNote = useNotesStore( s => s.selectNote);
  // const { loadNotesList, addNote, removeNote, selectNote } = useNotesStore();

  const handleSelect = (noteId: string) => selectNote(noteId);

  const handleRemoveClick = (e: React.MouseEvent, noteId: string) => {
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

  return (<div className='d-flex flex-column gap-1 h-100'>

    <div>
      <Button 
        onClick={handleCreateNote}
        >Create Note
      </Button>
    </div>

    <ListGroup className='h-100'>
      { noteList.map( (note) => (
        <ListGroup.Item 
          key={note.id} 
          action 
          onClick={ () => handleSelect(note.id) }
          >
          {note.title}
          <Button 
            variant="danger" 
            size="sm" 
            onClick={(e) => handleRemoveClick(e, note.id)}
            className="float-end"
          >
            <i className={icons.trash}></i>
          </Button>
        </ListGroup.Item>
      )) }
    </ListGroup>

    </div>
  );
};

export default NotesList;
