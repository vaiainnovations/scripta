export interface PostExtended {
    id: Long;
    externalId: string;
    text: string;
    subtitle: string;
    content: string;
    tags: string[];
    image: string;
    sectionId: number;
    author: string;
    creationDate: string;
    lastEditedDate: string;
    attachments: any[];
    entities: any[];
}
