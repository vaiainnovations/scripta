import { Author } from "~~/types/Author";

export interface PostComment {
  id: number;
  text: string;
  creation_date: Date
  author: Author;
}
