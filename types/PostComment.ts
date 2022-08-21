export interface PostComment {
  id: number;
  text: string;
  creation_date: Date
  author: {
    address: string;
    dtag: string;
    nickname: string;
    profile_pic: string;
  };
}
