export interface AuthorSearch {
  address: string,
  dtag: string,
  nickname: string,
  profile: string
}

export interface ArticleSearch {
  title: string;
  description: string;
  image: string;
  author: AuthorSearch;
}
