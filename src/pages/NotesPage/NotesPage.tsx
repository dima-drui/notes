import React, { useEffect, useState } from 'react';
import NotesList from './NotesList';
import NoteEditor from './NoteEditor';
import { useNotesStore } from '../../store/notesStore';
import './NotesPage.css';


const NOTE_LIST_INIT_W = 300;
const NOTE_LIST_W_MIN = 150;
const NOTE_LIST_W_MAX = 600;


const NotesPage: React.FC = () => {

  const loadNotesList = useNotesStore( s => s.loadNotesList );
  const [panelWidth, setPanelWidth] = useState(NOTE_LIST_INIT_W);

  useEffect( () => {
    loadNotesList()
  }, [] )

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = panelWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      if (newWidth > NOTE_LIST_W_MIN && newWidth < NOTE_LIST_W_MAX) { // Set min and max width
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className='h-100 w-100 d-flex flex-row'>
        <div style={{ width: panelWidth }} >
          <NotesList />
        </div>
        <div className="resize-handle" onMouseDown={handleMouseDown} />
        <div className='w-100'>
          <NoteEditor />
        </div>
    </div>
  );
};

export default NotesPage;
