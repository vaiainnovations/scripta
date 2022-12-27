import { Author } from "./Author";

export interface PostExtended {
    id: Long;
    externalId: string;
    text: string;
    subtitle: string;
    content: string;
    tags: string[];
    image: string;
    sectionId: number;
    author: Author;
    creationDate: string;
    lastEditedDate: string;
    attachments: any[];
    entities: any[];
    reaction_cnt_1?: number;
    reaction_cnt_2?: number;
}

export function searchFirstContentImage (content: string): string {
  const match = /!\[[^\]]*\]\((?<filename>.*?)(?="|\))(?<optionalpart>".*")?\)/.exec(content);
  if (match) {
    return match[1];
  }
  return "";
}
