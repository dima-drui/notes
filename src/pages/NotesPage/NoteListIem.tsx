import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { NoteItemList } from '../../store/notesStore';
import { icons } from '../../utils/icons';


type NoteItem = {
  note: NoteItemList;
  handleSelect: (e: React.MouseEvent, noteId: string) => void;
  handleRemove: (e: React.MouseEvent, noteId: string) => void;
}

export const NoteListIem = ({note, handleSelect, handleRemove}: NoteItem) => {
  return (
    <ButtonGroup className="w-100">
      <Button
        variant='light'
        className="text-start text-truncate w-100"
        onClick={ (e) => handleSelect(e, note.id) }
        >
          <span>{note.title}</span>
      </Button>
      <Button 
        variant="link" 
        size="sm" 
        onClick={(e) => handleRemove(e, note.id)}
        className="float-end"
      >
        <i className={icons.trash}></i>
      </Button>
    </ButtonGroup>
  )
}