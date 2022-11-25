export interface ContentPreviewType {
  id: number;
  title: string;
  description: string;
  image: string;
  content: string;
  tags: string[];
  analytics?: {
    views: number;
    upvotes: number;
    downvotes: number;
  }
}
