import { Entity } from ".";


export interface NoteNew {
  title: string;
  content: string;
}

export interface Note extends Entity, NoteNew {};
