import React from 'react';
import { ListGroup, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { NoteSortCriteria, useNotesStore } from '../../store/notesStore';
import { NoteNew } from '../../models/Note';
import { NoteListIem } from './NoteListIem';
import { icons } from '../../utils/icons';
import './NotesList.css';



const sortOptions: { label: string; value: NoteSortCriteria; icon: string }[] = [
  { label: 'Title', value: { field: 'title', direction: 'asc' }, icon: icons.arrowUp },
  { label: 'Title', value: { field: 'title', direction: 'desc' }, icon: icons.arrowDown },
  { label: 'Created', value: { field: 'createdAt', direction: 'asc' }, icon: icons.arrowUp },
  { label: 'Created', value: { field: 'createdAt', direction: 'desc' }, icon: icons.arrowDown },
  { label: 'Updated', value: { field: 'updatedAt', direction: 'asc' }, icon: icons.arrowUp },
  { label: 'Updated', value: { field: 'updatedAt', direction: 'desc' }, icon: icons.arrowDown },
];

const NotesList: React.FC = () => {

  const noteList = useNotesStore( s => s.noteList);
  const addNote = useNotesStore( s => s.addNote);
  const removeNote = useNotesStore( s => s.removeNote);
  const selectNote = useNotesStore( s => s.selectNote);
  const sortNotes = useNotesStore((s) => s.sortNotes);
  const currentSort = useNotesStore(s => s.currentSort);

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

    <div className='w-100'>
      <DropdownButton id="dropdown-sort" title="Sort" variant="outline-secondary">
        { sortOptions.map( (option) => (
          <Dropdown.Item 
            key={`${option.value.field}-${option.value.direction}`} 
            onClick={() => sortNotes(option.value)}
            active={option.value.field === currentSort.field && option.value.direction === currentSort.direction}
          >
            <i className={`me-2 ${option.icon}`} />{option.label}
          </Dropdown.Item>
        ))}
      </DropdownButton>
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
