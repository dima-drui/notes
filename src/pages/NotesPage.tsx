import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import NotesList from '../components/NotesList';
import NoteEditor from '../components/NoteEditor';


const NotesPage: React.FC = () => {

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
