import { ContentPreviewType } from "./ContentPreviewType";

export class PostPreview implements ContentPreviewType {
  title: string;
  description: string;
  image: string;
  content: string;

  constructor (title: string, description: string, image: string, content: string) {
    this.title = title;
    this.description = description;
    this.image = image;
    this.content = content;
  }
}
