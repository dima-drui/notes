import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import NotesList from './NotesList';
import NoteEditor from './NoteEditor';
import { useNotesStore } from '../../store/notesStore';


const NotesPage: React.FC = () => {

  const loadNotesList = useNotesStore( s => s.loadNotesList );

  useEffect( () => {
    loadNotesList()
  }, [] )

  return (
    <Container
      fluid
      className='h-100'
      >
        <Row>
          <Col xs={3}>
            <NotesList />
          </Col>
          <Col xs={9}>
            <NoteEditor />
          </Col>
        </Row>
    </Container>
  );
};

export default NotesPage;
