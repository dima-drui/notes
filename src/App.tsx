import React from 'react';
import { createRoot } from 'react-dom/client';
import ErrorToast from './components/ErrorToast';
import NotesPage from './pages/NotesPage/NotesPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'


function App() {
  return (
    <>
      <NotesPage />
      <ErrorToast />
    </>
  );
};

export default App


const root = createRoot(document.body);
root.render(<App />);
