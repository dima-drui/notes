import React from 'react';
import { createRoot } from 'react-dom/client';
import NotesPage from './pages/NotesPage';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <>
      <NotesPage />
    </>
  );
};

export default App


const root = createRoot(document.body);
root.render(<App />);
