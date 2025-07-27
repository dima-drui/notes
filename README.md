# My New App

## Description
This is an Electron application built with React, TypeScript, and Webpack. It includes features such as note management and uses localStorage for data persistence.

## Prerequisites
- Node.js (v16 or later)
- npm (v7 or later)

## Installation
Install dependencies:
```bash
npm install
```

## Running the Application
To start the Electron application, run:
```bash
npm start
```

## Running Tests
To execute the unit tests, run:
```bash
npm test
```

## Building the Application
To build the application for distribution, run:
```bash
npm run make
```
This will create a distributable version of the app in the `out` directory.

## Architecture Decisions
- **Frontend Framework**: React is used for building the user interface due to its component-based architecture and reusability.
- **State Management**: Zustand is used for lightweight and scalable state management.
- **Styling**: React-Bootstrap is used for consistent and responsive UI components.
- **Data Persistence**: LocalStorage is used for storing notes locally.
- **Electron**: Chosen for building cross-platform desktop applications.

## Known Limitations
- **LocalStorage**: Data is stored locally and cannot be shared across devices.
- **Scalability**: The application is not designed for handling a large number of notes efficiently.
- **Offline Support**: Limited offline capabilities as it relies on the browser's localStorage.

## API Documentation

### Notes Store (`notesStore`)
- **`noteList`**: Array of notes.
- **`addNote`**: Adds a new note.
- **`removeNote`**: Removes a note by ID.
- **`setSelectedNote`**: Sets the currently selected note.
- **`sortNotes`**: Sorts notes based on criteria.

### Toast Store (`toastStore`)
- **`addToast`**: Adds a toast notification.
- **`removeToast`**: Removes a toast notification.

### DB Service (`db.ts`)
- **`read`**: Reads notes based on query and options.
- **`create`**: Creates a new note.
- **`update`**: Updates an existing note.
- **`delete`**: Deletes a note by ID.

## License
This project is licensed under the MIT License.
