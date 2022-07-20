export interface AuthorSearch {
  name: string,
  image: string
}

export interface ArticleSearch {
  title: string;
  description: string;
  image: string;
  author: AuthorSearch;
}
