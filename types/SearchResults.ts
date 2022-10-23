export interface AuthorSearch {
  address: string,
  dtag: string,
  nickname: string,
  image: string
}

export interface ArticleSearch {
  title: string;
  description: string;
  image: string;
  author: AuthorSearch;
}
