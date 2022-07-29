export interface PostExtended {
    external_id: string;
    text: string;
    subtitle: string;
    content: string;
    tags: string[];
    image: string;
    sectionId: number;
    author: string;
    creation_date: string;
    last_edited_date: string;
    attachments: any[];
    entities: any[];
}
