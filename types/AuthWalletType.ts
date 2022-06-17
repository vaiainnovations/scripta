export interface AuthWalletType {
  name: string;
  img: string;
  route: string;
  isSuggested?: boolean;
}

export class AuthWallet implements AuthWalletType {
  readonly name: string;
  readonly img: string;
  readonly route: string;
  readonly isSuggested: boolean;

  constructor (name: string, img: string, route: string, isSuggested = false) {
    this.name = name;
    this.img = img;
    this.route = route;
    this.isSuggested = isSuggested;
  }
}
