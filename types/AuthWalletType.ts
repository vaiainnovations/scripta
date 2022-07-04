export interface AuthWalletType {
  name: string;
  img: string;
  route: string;
  isSuggested?: boolean;
}

export class AuthWallet implements AuthWalletType {
  readonly id: string;
  readonly name: string;
  readonly img: string;
  readonly route: string;
  readonly isSuggested: boolean;

  constructor (id: string, name: string, img: string, route: string, isSuggested = false) {
    this.id = id;
    this.name = name;
    this.img = img;
    this.route = route;
    this.isSuggested = isSuggested;
  }
}
