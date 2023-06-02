import { ContentPreviewType } from "~~/types/ContentPreviewType";

export class PostPreview implements ContentPreviewType {
  id: number;
  title: string;
  description: string;
  image: string;
  content: string;
  tags: string[];

  constructor (title: string, description: string, image: string, content: string, id = 0) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image = image;
    this.content = content;
  }
}
